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

