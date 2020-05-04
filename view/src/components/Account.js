import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { CircularProgress, Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core'
import clsx from 'clsx'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'
import  AccountProfile  from './AccountProfile'

const Account = ({history, classes, ...rest}) => {
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
                uiLoading: true
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
    const updateFormValues = (event) => {
        event.preventDefault()
        setUserInfo({ buttonLoading: true})
        authMiddleWare(history) 
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}` }
        const formRequest = {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
        }

        axios.post('/user', formRequest).then(() => {
            setUserInfo({
                buttonLoading: false
            })
        })
        .catch((error) => {
            if (error.response.status === 400) {
                history.push('/login')
            }

            console.log(error)
            setUserInfo({
                buttonLoading: false
            })
        })
    }

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
            <AccountProfile 
                firstName={userInfo.firstName}
                lastName={userInfo.lastName}
                username={userInfo.username}
            />
            <br />
            <Card {...rest} className={clsx(classes.root, classes)}>
                <form autoComplete='off' onSubmit={updateFormValues}>
                    <Divider/>
                    <CardContent>
                        <Grid container spacing={3} >
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label='Enter New First Name'
                                    margin='dense'
                                    name='firstName'
                                    variant='outlined'
                                    key={userInfo.firstName}
                                    defaultValue={userInfo.firstName}
                                    onChange={handleChange}
                                >
                                </TextField>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    label='Enter New Last Name'
                                    margin='dense'
                                    name='lastName'
                                    variant='outlined'
                                    key={userInfo.lastName}
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
                                    key={userInfo.email}
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
                                    key={userInfo.username}
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
        </div>
    )
    
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        margin: 'auto',
    },
    toolBar: theme.mixins.toolbar,
    root: {},
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