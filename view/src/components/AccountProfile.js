import React, { useState } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Typography, Card, CardContent, Divider, Button } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import clsx from 'clsx'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'

const AccountProfile = ({firstName, lastName, username, history, classes, ...rest}) => {
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
        authMiddleWare(history)
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
                history.push('/login')
            }
            console.log(error)
            setUserInfo({
                uiLoading: false,
                imageError: 'Error in posting the data'
            })
        })
    }
    
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
        </>
    )
}

const styles = (theme) => ({
    root: {},
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
    uploadButton: {
        marginRight: theme.spacing(2)
    },
})

export default withStyles(styles)(AccountProfile)