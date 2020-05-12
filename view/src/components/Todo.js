import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Button, Card, CardActions, CardContent, CircularProgress, Container, Dialog, DialogContent, DialogTitle, DialogContentText, Grid, IconButton, Slide, TextField, Toolbar, Typography, DialogActions } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import CloseIcon from '@material-ui/icons/Close'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { authMiddleWare } from '../util/auth'

const Todo = ({ classes, history, children, onClose }) => {
    const [todoInfo, setTodoInfo] = useState({
        todos: '',
        title: '',
        body: '',
        todoId: '',
    })

    const [getCurrentTodos, setCurrentTodos] = useState({
        todos: []
    })
    
    const [buttonType, setButtonType] = useState('')
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
            setCurrentTodos({
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

    const handleSubmit = (event) => {
        event.preventDefault()
        authMiddleWare(history)
        const userTodo = {
            title: todoInfo.title,
            body: todoInfo.body
        }
        let options = {}
        if(buttonType === 'Edit') {
            options = {
                url: `/todo/${todoInfo.todoId}`,
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
        console.log(authToken)
        axios.defaults.headers.common = { Authorization: `${authToken}`}
        axios(options).then(() => {
            setOpen(false)
            window.location.reload()
        })
        .catch((error) => {
            setOpen({ open: true, errors: error.response.data })
            console.log(error)
        })

    }

    const handleViewOpen = (data) => {
        setTodoInfo({
            title: data.todo.title,
            body: data.todo.body
        })

        setViewOpen(true)
    }

    const handleViewClose = () => {
        setViewOpen(false)
    }

    const handleEditOpen = (data) => {
        setTodoInfo({
            title: data.todo.title,
            body: data.todo.body,
            todoId: data.todo.todoId,
        })
        setButtonType('Edit')
        setOpen(true)
    }

    // const DialogTitle = withStyles(styles)((props) => {
    //     const { ...other } = props
    //     return (
    //         <MuiDialogTitle disableTypography className={classes.root} {...other}>
    //              <Typography varian='h6'>{children}</Typography>
    //              {
    //                  onClose ? (
    //                     <IconButton aria-label='close' className={classes.closeButton} onClock={onClose}>
    //                         <CloseIcon/>
    //                     </IconButton>
    //                 ) : null
    //              }
    //         </MuiDialogTitle>
    //     )
    // })

    // const DialogContent = withStyles((theme) => ({
    //     viewRoot: {
    //         padding: theme.spacing(2)
    //     }
    // }))(MuiDialogContent)

    dayjs.extend(relativeTime)

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
                            { buttonType === 'Edit' ? 'Edit Todo' : 'Create New Todo' }
                        </Typography>
                        <Button
                            autoFocus
                            color='inherit'
                            onClick={handleSubmit}
                            className={classes.submitButton}
                        >
                            { buttonType === 'Edit' ? 'Save' : 'Submit'}
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
                        helperText='* Required Field'
                        onChange={handleChange}
                    />
                    <TextField
                        variant='outlined'
                        required
                        fullWidth
                        autoFocus
                        margin='dense'
                        id='todoBody'
                        label='What do you want to get done?'
                        name='body'
                        autoComplete='todoBody' 
                        helperText='* Required Field'
                        multiline
                        rows={10}
                        rowsMax={10} 
                        onChange={handleChange}
                    />
                </form>
                </DialogContent>
            </Dialog>
            <div>
            <Container maxWidth='lg' className={classes.container}>
            <Grid container spacing={2}>
                {
                   getCurrentTodos.todos.map((todo) => (
                       <Grid item xs={12} sm={6}>
                           <Card className={classes.root} variant='outlined'>
                               <CardContent>
                                    <Typography key={todo.todoId} variant='h5' component='h2'>
                                        {todo.title}
                                    </Typography>
                                    <Typography className={classes.pos} color='textSecondary'>
                                    {dayjs(todo.createdAt).fromNow()}
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        {`${todo.body.substring(0, 65)}`}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size='small' color='primary' onClick={() => handleViewOpen({ todo })} >
                                        {' '}
                                        View{' '}
                                    </Button>
                                    <Button size='small' color='primary' onClick={() => handleEditOpen({ todo })}>
                                        {' '}
                                        Edit{' '}
                                    </Button>
                                    <Button size='small' color='primary' >
                                        {' '}
                                        Delete{' '}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                         <Dialog
                            onClose={handleViewClose}
                            aria-labelledby='customized-dialog-title'
                            open={viewOpen}
                            fullWidth
                            classes={{ paperFullWidth: classes.dialogStyle }}
                        >
                            <DialogTitle id='customized-dialog-title' onClose={handleViewClose}>
                                {todoInfo.title}
                            </DialogTitle>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    id='todoDetails'
                                    name='body'
                                    multiline
                                    readonly
                                    rows={1}
                                    rowsMaxs={10}
                                    value={todoInfo.body}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </Container>
            </div>
        </main>
    )
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        overflow: 'auto',
        height: '100vh',
        margin: 'auto',
        padding: theme.spacing(3)
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
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
        minWidth: 470,
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
        backgroundColor: '#63B3ED',
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