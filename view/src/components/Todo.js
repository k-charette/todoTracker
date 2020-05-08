import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Button, Card, CardActions, CardContent, CircularProgress, Dialog, Grid, IconButton, MuiDialogTitle, MuiDialogContent, Slide, TextField, Toolbar, Typography } from '@material-ui/core'
import { DialogTitle } from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { authMiddleWare } from '../util/auth'


const Todo = (props) => {
    const [todo, setTodo] = useState({
        todos: '',
        title: '',
        body: '',
        todoId: '',
        errors: [],
        open: false,
        uiLoading: true,
        buttonType: '',
        viewOpen: false
    })

    useEffect(() => {
        authMiddleWare(props.history)
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}` }

        axios.get('/todos').then((response) =>{
            setTodo({
                todos: response.data,
                uiLoading: false
            })
        })
        .catch((err) => {
            console.log(err)
        })
    },[props.history])

    const handleChange = (event) => {
        setTodo({
            ...todos, [event.target.name]: event.target.value
        })
    }

    const deleteTodoHandler = async (data) => {
        authMiddleWare(props.history)
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}`}

        let todoId = data.todo.todoId
        try{
            await axios.delete(`todo/${todoId}`).then(() => {
                window.location.reload()
            })
        } 
        catch(err) {
            console.log(err)
        }
    }

    const editClickHandlerOpen = (data) => {
        setTodo({
            title: data.todo.title,
            body: data.todo.body,
            todoId: data.todo.todoId,
            buttonType: 'Edit',
            open: true
        })
    }

    const viewHandlerOpen = (data) => {
        setTodo({
            title: data.todo.title,
            body: data.todo.body,
            viewOpen: true
        })
    }

    const Transition = React.forwardRef(function Transition(props, ref){
        return <Slide direction='up' ref={ref} {...props} />
    })

    const DialogTitle = withStyles(styles)((props) => {
        const { children, classes, onClose, ...other } = props
        return (
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography varian='h6'>
                    {children}
                </Typography>
                {onClose ? (
                    <IconButton aria-label='close' className={classes.closeButton} onClock={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null }
            </MuiDialogTitle>
        )
    })

    const DialogContent = withStyles((theme) => ({
        viewRoot: {
            padding: theme.spacing(2)
        }
    }))(MuiDialogContent)

    dayjs.extend(relativeTime)
    const { classes } = props
    const { open, errors, viewOpen } = todo

    const handleClickOpen = () => {
        setTodo({
            todo: '',
            title: '',
            body: '',
            buttonType: '',
            open: true
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        authMiddleWare(props.history)
        const userTodo = {
            title: todo.title,
            body: todo.body
        }

        let options = {}
        if (todo.buttonType === 'Edit') {
            options = {
                url: `/todo/${todo.todoId}`,
                method: 'put',
                data: userTodo
            }
        } else {
            options = {
                url: '/todo',
                method: 'post',
                data: userTodo
            }
        }

        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}`}

        await axios(options).then(() => {
            setTodo({
                open: false
            })
            window.location.reload()
        })
        .catch((error) => {
            setTodo({
                open: true,
                errors: error.response.data
            })
            console.log(error)
        })
    }

    const handleViewClose = () => {
        setTodo({
            viewOpen: false
        })
    }

    const handleClose = (event) => {
        setTodo({
            open: false
        })
    }

    if (todo.uiLoading === true){
        return (
            <div className={classes.content}>
                    <div className={classes.toolbar}/>
                    {todo.uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
            </div>
        )
    } else {
        return (
            <div className={classes.content}>
                <div className={classes.toolbar}>
                    <IconButton 
                        className={classes.floatingButton}
                        color='primary'
                        aria-label='Add Todo'
                        onClick={handleClickOpen}
                    >
                        <AddCircleIcon style={{fontSize: 60}}/>
                    </IconButton>
                    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                        <AppBar className={classes.appBar}>
                            <Toolbar>
                                <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
                                    <CloseIcon />
                                </IconButton>
                                <Typography variant='h6' className={classes.title}>
                                    { todo.buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo' }
                                </Typography>
                                <Button
                                    autoFocus
                                    color='inherit'
                                    onClick={handleSubmit}
                                    className={classes.submitButton}
                                >
                                    {todo.buttonType === 'Edit' ? 'Save' : 'Submit'}
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <form className={classes.form} noValidate>
                            <Grid container space={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant='outlined'
                                        required
                                        fullWidth
                                        id='todoTitle'
                                        label='Todo Title'
                                        name='title'
                                        autoComplete='todoTitle'
                                        helperText={errors.title}
                                        defaultValue={todo.title}
                                        error={errors.title ? true : false}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant='outlined'
                                        required
                                        fullWidth
                                        id='todoDetails'
                                        label='Todo Details'
                                        name='body'
                                        autoComplete='todoDetails'
                                        multiline
                                        rows={25}
                                        rowsMax={25}
                                        helperText={errors.body}
                                        defaultValue={todo.body}
                                        error={errors.body ? true : false}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Dialog>
                  
                    <Grid container spacing={2}>
                        {todo.todos.map((info) => {
                            <Grid item xs={12} sm={6}>
                                <Card className={}>

                                </Card>
                            </Grid>
                        })

                        }
                    </Grid>
                </div>
            </div>
        )
    }
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    title: {
		marginLeft: theme.spacing(2),
		flex: 1
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
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(3)
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
	dialogeStyle: {
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