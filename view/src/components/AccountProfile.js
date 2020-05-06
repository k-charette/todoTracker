import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { CircularProgress, Card, CardActions, CardContent, Divider, Button, Grid, TextField, Typography } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import clsx from 'clsx'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'

const AccountProfile = ({history, classes, ...rest}) => {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        profilePicture: '',
        uiLoading: true,
        buttonLoading: false,
        errors: '',
        imageError: ''
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
        setUserInfo({
            image: event.target.files[0]
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
            form_data.append('image', userInfo.image)
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
                uiLoading: false,
                imageError: 'Error in posting the data'
            })
        }
    }

    const { firstName, lastName, username } = userInfo
    if (userInfo.uiLoading === true) {
        return (
            <div className={classes.content}>
                <div className={classes.toolbar}/>
                {console.log(userInfo.uiLoading)}
                {userInfo.uiLoading && <CircularProgress size={150} className={classes.uiProgress}/>}
            </div>
        )
    } else {
    
    return (
        <>
            <Card {...rest} className={clsx(classes.root, classes)}>
                <CardContent>
                    <div className='classes.details'>
                        <div>
                            <Typography
                                className='classes.nameText'
                                gutterBottom variant='h2'
                            >
                                {firstName} {lastName} / {username}
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
                                    {`Wrong Image Format` && `Supported Format are PNG and JPG`}
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
            <br/>
            <Card {...rest} className={clsx(classes.root, classes)}>
                    <form autoComplete='off'>
                        <Divider/>
                        <CardContent>
                            <Grid container spacing={3} >
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Update First Name'
                                        margin='dense'
                                        name='firstName'
                                        variant='outlined'
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
                                        defaultValue={userInfo.lastName}
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
                                        variant='outlined'
                                        defaultValue={userInfo.email}
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
                                        variant='outlined'
                                        defaultValue={userInfo.username}
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
        margin: 'auto',
    },
    toolBar: theme.mixins.toolbar,
    uiProgress: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
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
    },
    details: {
        display: 'flex',
        marginTop: '100px'
    },
    avatar: {
        marginLeft: 'auto',
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0
    },
    nameText: {
        paddingLeft: '15px'
    },
    progress: {
        marginTop: theme.spacing(2)
    },
})

export default withStyles(styles)(AccountProfile)