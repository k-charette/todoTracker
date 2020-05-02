import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Typography, CircularProgress, Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import clsx from 'clsx'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'

const Account = (props) => {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        profilePicture: '',
        uiLoading: true,
        buttonLoading: false,
        imageError: ''
    })

    useEffect(() => {
        authMiddleWare(props.history)
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}`}
        axios.get('/user').then((response) => {
            console.log(response.data)
            setUserInfo({
                firstName: response.data.userCredentials.firstName,
                lastName: response.data.userCredentials.lastName,
                email: response.data.userCredentials.email,
                username: response.data.userCredentials.username,
                uiLoading: true
            })
        })
        .catch((error) => {
            console.log(error)
            setUserInfo({
                errorMsg: 'Error in retrieving the data'
            })
        })
    },[props.history])

    const handleChange = (event) => {
        setUserInfo({
            ...userInfo, [event.target.name]: event.target.value
        })
    }

    const handleImageChange = (event) => {
        setUserInfo({
            image: event.target.files[0]
        })
    }

    const profilePictureHandler = (event) => {
        event.preventDefault()
        setUserInfo({
            uiLoading: true
        })
        authMiddleWare(props.history)
        const authToken = localStorage.getItem('AuthToken')
        let form_data = new FormData()
        form_data.append('image', userInfo.image)
        form_data.append('content', userInfo.content)
        axios.defaults.headers.common = { Authorization: `${authToken}`}

        axios.post('/user/image', form_data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        .then(() => {
            window.location.reload()
        })
        .catch((error) => {
            if (error.response.status === 403) {
                props.history.push('/login')
            }
            console.log(error)
            setUserInfo({
                uiLoading: false,
                imageError: 'Error in posting the data'
            })
        })
    }

    const updateFormValues = (event) => {
        event.preventDefault()
        setUserInfo({ buttonLoading: true})
        authMiddleWare(props.history) 
        const authToken = localStorage.getItem('AuthToekn')
        axios.defaults.headers.common = { Authorization: `${authToken}` }
        const formRequest = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName
        }

        axios.post('/user', formRequest).then(() => {
            setUserInfo({
                buttonLoading: false
            })
        })
        .catch((error) => {
            if (error.response.status === 400) {
                props.history.push('/login')
            }

            console.log(error)
            setUserInfo({
                buttonLoading: false
            })
        })
    }

    const { classes, ...rest} = props
    // if (userInfo.uiLoading === true) {
    //     return (
    //         <div className={classes.content}>
    //             <div className={classes.toolbar}/>
    //             {userInfo.uiLoading && <CircularProgress size={150} className={classes.uiProgress}/>}
    //         </div>
    //     )
    // } else {
        return (
            <div className={classes.content}>
                <div className={classes.toolbar} />
                <Card {...rest} className={clsx(classes.root, classes)}>
                    <CardContent>
                        <div className='classes.details'>
                            <div>
                                <Typography
                                    className='classes.locationText'
                                    gutterBottom variant='h2'
                                >
                                    {userInfo.firstName} {userInfo.lastName}
                                </Typography>
                                <Button 
                                    className='classes.uploadButton'
                                    color='primary'
                                    variant='text'
                                    type='submit'
                                    startIcon={<CloudUploadIcon/>}
                                    size='small'
                                    onClick={profilePictureHandler}
                                >
                                    Upload Photo
                                </Button>
                                <input type='file' onChange={handleImageChange}/>
                                {userInfo.imageError ? (
                                    <div className={classes.customError}>
                                        {' '}
                                        Wrong Image Format || Supported Format are PNG and JPG
                                    </div>
                                ) : (
                                    false
                                )}
                            </div>
                        </div>
                        <div className={classes.progress} />
                    </CardContent>
                    <Divider/>
                </Card>
                <br />

                <Card {...rest} className={clsx(classes.root, classes)}>
                    <form autoComplete='off' noValidate onSubmit={updateFormValues}>
                        <Divider/>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label='First Name'
                                        margin='dense'
                                        name='firstName'
                                        varian='outlined'
                                        value={userInfo.firstName}
                                        onChange={handleChange}
                                    >
                                    </TextField>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Last Name'
                                        margin='dense'
                                        name='lastName'
                                        varian='outlined'
                                        value={userInfo.lastName}
                                        onChange={handleChange}
                                    >
                                    </TextField>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Email'
                                        margin='dense'
                                        name='email'
                                        varian='outlined'
                                        value={userInfo.email}
                                        onChange={handleChange}
                                    >
                                    </TextField>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Username'
                                        margin='dense'
                                        name='username'
                                        varian='outlined'
                                        value={userInfo.username}
                                        onChange={handleChange}
                                    >
                                    </TextField>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider/>
                        <CardActions />
                    </form>
                </Card>
                <Button
                    color='primary'
                    variant='contained'
                    type='submit'
                    className={classes.submitButton}
                    disabled={
                        userInfo.buttonLoading ||
                        !userInfo.firstName ||
                        !userInfo.lastName 
                    }
                >
                    Save Details
                    {userInfo.buttonLoading && <CircularProgress size={30} className={classes.progress}/>}
                </Button>
            </div>
        )
    
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,        
        padding: theme.spacing(4),
        margin: 'auto',
        marginTop: '100px',
    },
    toolBar: theme.mixins.toolbar,
    root: {},
    details: {
        display: 'flex',
        padding: '32px',
        marginTop: '100px'
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0
    },
    locationText: {
        paddingLeft: '15px'
    },
    buttonProperty: {
        position: 'absolute',
        top: '50%'
    },
    uiProgress: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    progress: {
        marginTop: theme.spacing(2)
    },
    uploadButton: {
        marginRight: theme.spacing(2)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    submitButton: {
        marginTop: '10px'
    }
})

export default withStyles(styles)(Account)