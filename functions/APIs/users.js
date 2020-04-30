const { admin, db } = require('../util/admin')
const config = require('../util/config')
const firebase = require('firebase')

firebase.initializeApp(config);


const { validateLoginData, validateSignUpData } = require('../util/validation')

//Login code
exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }
    
    const { valid, errors } = validateLoginData(user)
    if (!valid) return response.status(400).json(errors)
    
    firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((data) => {
        return data.user.getIdToken()
    })
    .then((token) => {
        return response.json({ token })
    })
    .catch((err)=>{
        console.error(err)
        return response.status(403).json({ general: 'Wrong email/password combination, please try again.'})
    })
}

//new user sign up code 
exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        username: request.body.username
    }

    const { valid, errors } = validateSignUpData(newUser)

    if (!valid) return response.status(400).json(errors)

    let token, userId

    db.doc(`/users/${newUser.username}`).get()
    .then((doc) => {
            if(doc.exists){
            return response.status(400).json({ username: 'This username is already taken'})
        } else {
            return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                    )
        }
    })
    .then((data) => {
        userId = data.user.uid 
        return data.user.getIdToken()
    })
    .then((idToken) => {
        token = idToken
        const userCredentials = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            confirmPassword: newUser.confirmPassword,
            createdAt: new Date().toISOString(),
            userId
        }
        return db.doc(`/users/${newUser.username}`).set(userCredentials)
    })
    .then(() => {
        return response.status(201).json({ token })
    })
    .catch((err) => {
        console.error(err)
        if (err.code === 'auth/email-already-in-use') {
            return response.status(400).json({ email: 'Email already in use' })
        } else {
            return response.status(500).json({ general: 'Something went wrong, please try again'})
        }
    })
}

deleteImage = (imageName) => {
    const bucket = admin.storage().bucket()
    const path = `${imageName}`

    return bucket.file(path).delete()
    .then(() => {
        return
    })
    .catch((error) => {
        return
    })
}

exports.uploadProfilePhoto = (request, response) => {
    // all required variables from the busboy docs
    // saving incoming files to disk
    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')
    const busboy = new BusBoy({headers: request.headers})

    let imageFileName
    let imageToBeUploaded = {}

    busboy.on('file', (fieldName, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/png' && mimetype !== 'image/jpeg'){
            return response.status(400).json({ error: 'Wrong file type submitted' })
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1]
        imageFileName = `${request.user.username}.${imageExtension}`
        const filePath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = { filePath, mimetype }
        file.pipe(fs.createWriteStream(filePath))
    })

    deleteImage(imageFileName)
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${request.user.username}`).update({
                imageUrl
            })
        })
        .then(() => {
            return response.json({ message: 'Image uploaded successfully' })
        })
        .catch((err) => {
            console.error(err)
            return response.status(500).json({ error: error.code })
        })
    })
    return busboy.end(request.rawBody)
}

