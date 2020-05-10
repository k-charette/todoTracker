import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Button, Card, CardActions, CardContent, CircularProgress, Dialog, DialogContent, DialogContentText, Grid, IconButton, Slide, TextField, Toolbar, Typography, DialogActions } from '@material-ui/core'
// import MuiDialogTitle from '@material-ui/core/DialogTitle'
// import MuiDialogContent from '@material-ui/core/DialogContent'
import CloseIcon from '@material-ui/icons/Close'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { authMiddleWare } from '../util/auth'

const Todo = ({ classes, history }) => {
    const [todoInfo, setTodoInfo] = useState({
        todos: '',
        title: '',
        body: '',
        todoId: '',
        buttonType: '',
    })
    
    const [open, setOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [uiLoading, setUiLoading] = useState(true)
    const [errors, setErrors] = useState([])

    // handleChange to keep track of the form input changes
    const handleChange = (event) => {
        setTodoInfo({
            ...todoInfo, [event.target.name]: event.target.value
        })
    }

    useEffect(() => {
        authMiddleWare(history)
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}` }

        axios.get('/todos').then((response) =>{
            setTodoInfo({
                todos: response.data
            })

            setUiLoading({
                uiLoading: false
            })
        })
        .catch((err) => {
            console.log(err)
        })
    },[history])

    //handleClickOpen for the button to open dialog modal to add todo
    const handleClickOpen = () => {
        setOpen(true)
    }

    //handleClose to close the dialog modal
    const handleClose = () => {
        setOpen(false)
    }


    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <IconButton className={classes.floatingButton} aria-label='Add Todo' color='primary' onClick={handleClickOpen}>
                <AddCircleIcon style={{ fontSize: 60}} />
            </IconButton>
            <Dialog
                fullScreen
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby='form-dialog-title'
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
                            <CloseIcon />
                        </IconButton>
                        <Typography varian='h6' className={classes.title}>
                            {todoInfo.buttonType === 'Edit' ? 'Edit Todo' : 'Create New Todo' }
                        </Typography>
                        <Button
                            autoFocus
                            color='inherit'
                            // onClick={handleSubmit}
                            className={classes.submitButton}
                        >
                            {todoInfo.buttonType === 'Edit' ? 'Save' : 'Submit'}
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{marginTop: '100px'}}>
                <form className={classes.form}>
                <TextField
                        variant='outlined'
                        required
                        fullWidth
                        autoFocus
                        margin='dense'
                        id='todoTitle'
                        label='Add a title...'
                        name='title'
                        autoComplete='todoTitle'
                        helperText={errors.title}
                        onChange={handleChange}
                        defaultValue={todoInfo.title}
                    />
                    <TextField
                        variant='outlined'
                        required
                        fullWidth
                        autoFocus
                        margin='dense'
                        id='todoBody'
                        label='What do you need to get done...?'
                        name='body'
                        autoComplete='todoBody' 
                        multiline
                        rows={10}
                        rowsMax={10} 
                        onChange={handleChange}
                        defaultValue={todoInfo.body}
                    />
                </form>
                </DialogContent>
            </Dialog>
        </main>
    )
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        margin: 'auto',
        padding: theme.spacing(3)
    },
    
    title: {
		marginLeft: theme.spacing(2),
		flex: 1
    },
    appBar: {
        backgroundColor: '#63B3ED',
    },

	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
        right: 0,
        color: '#63B3ED'
	},
	form: {
		width: '100%',
        margin: 'auto',
    },
    toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
    },    
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
})

export default withStyles(styles)(Todo)