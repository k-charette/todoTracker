import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Avatar, CircularProgress, Divider, Button, Grid, TextField, Typography } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'

const AccountProfile = ({ history, classes }) => {
    
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        uiLoading: true,
        buttonLoading: false,
        errors: '',
        imageError: ''
    })

    const [profilePicture, setProfilePicture] = useState({
        avatar: '',
    })

    useEffect(() => {
        authMiddleWare(history)
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}`}
        axios.get('/user').then((response) => {
            console.log(response.data)
            setUserInfo({
                firstName: response.data.userCredentials.firstName,
                lastName: response.data.userCredentials.lastName,
                email: response.data.userCredentials.email,
                username: response.data.userCredentials.username,
                uiLoading: false
            })
            setProfilePicture({
                avatar: response.data.userCredentials.imageUrl
            })
        })
        .catch((error) => {
            console.log(error)
            setUserInfo({
                errorMsg: 'Error in retrieving the data'
            })
        })
    },[history])

    const handleChange = (event) => {
        setUserInfo({
            ...userInfo, [event.target.name]: event.target.value
        })
    }

    const updateFormValues = async (event) => {
        event.preventDefault()
        setUserInfo({ buttonLoading: true})
        authMiddleWare(history) 
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}` }
        const formRequest = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
        }
        try {
            await axios.post('/user', formRequest).then(() => {
                setUserInfo({
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    username: userInfo.username
                })
            
            })
        } catch(error) {
            if (error.response.status === 404) {
                history.push('/login')
            }
        }
    }

    const handleImageChange = (event) => {
        setProfilePicture({
            image: event.target.files[0],
        })
    }

    const profilePictureHandler = async (event) => {
        event.preventDefault()
        setUserInfo({
            uiLoading: true
        })
        authMiddleWare(history)
        const authToken = localStorage.getItem('AuthToken')
        let form_data = new FormData()
            form_data.append('image', profilePicture.image)
            form_data.append('content', userInfo.content)
            axios.defaults.headers.common = { Authorization: `${authToken}`}

        try {
            await axios.post('/user/image', form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(() => {
                window.location.reload()
            })
        } catch(error) {
            if (error.response.status === 403) {
                history.push('/login')
            }
            console.log(error)
            setUserInfo({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                username: userInfo.username,
                email: userInfo.email,
                uiLoading: false,
                imageError: 'Error in posting the data'
            })
        }
    }
    const { firstName, lastName, username } = userInfo

    const { avatar } = profilePicture
    if (userInfo.uiLoading === true) {
        return (
            <div className={classes.content}>
                <div className={classes.toolbar}/>
                {userInfo.uiLoading && <CircularProgress size={150} className={classes.uiProgress}/>}
            </div>
        )
    } else {
    
    return (
        <>
        <div className={classes.details}>
            <div>
                <Avatar src={avatar} className={classes.avatar} />
                <Typography
                    className={classes.nameText}
                    gutterBottom variant='h4'
                >
                    <p className='font-sans text-2xl sm:text-3xl tracking-wider'>{firstName} {lastName} / {username}</p>
                </Typography>
                <input className={classes.chooseFile} type='file' onChange={handleImageChange}/>
                <Button 
                    className={classes.uploadButton}
                    color='default'
                    variant='contained'
                    type='submit'
                    startIcon={<CloudUploadIcon/>}
                    size='small'
                    onClick={profilePictureHandler}
                >
                    Upload Photo
                </Button>
                
                {userInfo.imageError ? (
                    <div className={classes.customError}>
                        {' '}
                        {`Wrong Image Format` && `Supported Format are PNG and JPG`}
                    </div>
                ) : (
                    false
                )}
            </div>
        </div>
        <div className={classes.progress} />
                <Divider/>
            <br/>
            <form autoComplete='off'>
                <Grid container spacing={3} >
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label='Update First Name'
                            margin='dense'
                            name='firstName'
                            variant='outlined'
                            inputProps={{className: classes.updateField}}
                            defaultValue={userInfo.firstName}
                            onChange={handleChange}
                        >
                        </TextField>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            label='Update Last Name'
                            margin='dense'
                            name='lastName'
                            variant='outlined'
                            inputProps={{className: classes.updateField}}
                            defaultValue={userInfo.lastName}
                            onChange={handleChange}
                        >
                        </TextField>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            disabled
                            fullWidth
                            label='Email'
                            margin='dense'
                            name='email'
                            variant='outlined'
                            defaultValue={userInfo.email}
                            onChange={handleChange}
                        >
                        </TextField>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            disabled
                            fullWidth
                            label='Username'
                            margin='dense'
                            name='username'
                            variant='outlined'
                            defaultValue={userInfo.username}
                            onChange={handleChange}
                        >
                        </TextField>
                    </Grid>
                </Grid>
            </form>
                <Button
                    color='primary'
                    variant='contained'
                    type='submit'
                    className={classes.submitButton}
                    onClick={updateFormValues}
                    disabled={
                        userInfo.buttonLoading ||
                        !userInfo.firstName ||
                        !userInfo.lastName 
                    }
                    >
                    Save Details
                    {userInfo.buttonLoading && <CircularProgress size={30} className={classes.progress}/>}
                </Button>
        </>
    )
    }
}

const styles = (theme) => ({
    root: {},
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        margin: 'auto',
    },
    toolBar: theme.mixins.toolbar,
    uiProgress: {
        color: '#63B3ED',
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    chooseFile: {
        margin: theme.spacing(2),
        color: '#4A5568'
    },
    uploadButton: {
        margin: theme.spacing(1),
        color: '#4A5568'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    submitButton: {
        marginTop: '10px',
        backgroundColor: '#63B3ED'
    },
    details: {
        display: 'flex',
        color: '#4A5568',
        margin: 'auto',
        justifyContent: 'center'
    },
    updateField: {
        color: '#4A5568',
    },
    avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
        flexGrow: 0,
        marginTop: 20,
        marginBottom: 20,
        margin: 'auto'
    },
    nameText: {
        paddingLeft: '15px',    
    },
    accountInfo: {
        color: '#4A5568',
    },
    progress: {
        marginTop: theme.spacing(2)
    },
})

export default withStyles(styles)(AccountProfile)