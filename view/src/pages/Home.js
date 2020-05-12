import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'
import Account from '../components/Account';
import Todo from '../components/Todo';
import { Drawer, AppBar, Container, Grid, Paper, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, CircularProgress } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx'

const Home = ({history, classes}) => {

    const [authUser, setAuthUser] = useState({
        firstName: '',
        lastName: '',
        profilePicture: '',
        uiLoading: true,
        imageLoading: false
    })

    const [open, setOpen] = useState(true)

    const [loadPage, setLoadPage] = useState({
        render: false
    })

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }
    
    const loadAccountPage = () => {
        setLoadPage({
            render: true
        })
    }

    const loadTodoPage = () => {
        setLoadPage({
            render: false
        })
    }

    const logoutHandler = () => {
        localStorage.removeItem('AuthToken')
        history.push('/login')
    }

    const _isMounted = useRef(true)
    useEffect(() => {
        authMiddleWare(history)
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}`}
        axios.get('/user').then((response) => {
            console.log(response.data)
            setAuthUser({
                firstName: response.data.userCredentials.firstName,
                lastName: response.data.userCredentials.lastName,
                email: response.data.userCredentials.email,
                username: response.data.userCredentials.username,
                profilePicture: response.data.userCredentials.imageUrl,
                uiLoading: false,
            })
        })
        .catch((error) => {
            if(error.response.status === 400) {
                history.push('/login')
            }
            console.log(error)
            setAuthUser({ errorMsg: 'Error in getting the data' })
        })

        return () => _isMounted.current = false
    }, [history])

    const { uiLoading } = authUser

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

	if (uiLoading === true) {
        return (
            <div className={classes.root}>
                {uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
            </div>
        );
	} else {
    return(
        <div className={classes.root}>
			<CssBaseline />
                <AppBar position="absolute" className={clsx(classes.appBar, open  && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h5" noWrap>
                            <p className='font-sans tracking-widest'>Todo Tracker </p>
                        </Typography>
                    </Toolbar>
                </AppBar>
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
                        }}
                        open={open}
					>
                        <div className={classes.toolBarIcon}>
                            <IconButton onClick={handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
						<List className={classes.directoryText}>
							<ListItem button key="Todo" onClick={loadTodoPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
                                <p className='font-sans text-xl sm:text-2xl tracking-wider '>Todo </p>
							</ListItem>

							<ListItem button key="Account" onClick={loadAccountPage}>
								<ListItemIcon>
									{' '}
									<AccountBoxIcon />{' '}
								</ListItemIcon>
                                <p className='font-sans text-xl sm:text-2xl tracking-wider '>Account </p>
							</ListItem>
							<ListItem button key="Logout" onClick={logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
                                <p className='font-sans text-xl sm:text-2xl tracking-wider '>Logout </p>
							</ListItem>
						</List>
					</Drawer>
			<div className={classes.content}>
                <div className={classes.toolbar}/>
                <Container fixed className={classes.container}>
                    <Grid>
                        <Paper className={fixedHeightPaper}>
                            {loadPage.render ? <Account /> : <Todo /> }
                        </Paper>
                    </Grid>
                </Container>
            </div>
		</div>
    )
    }
}
const drawerWidth = 240

const styles = (theme) => ({
	root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        flexWrap: 'wrap',
        height: '100vh',
        padding: theme.spacing(3),
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    paper: {
        padding:theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
	appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#63B3ED',
        transition: theme.transitions.create(['width', 'margin'],{
           easing: theme.transitions.easing.sharp,
           duration: theme.transitions.duration.leavingScreen, 
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'],{
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen, 
         }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    toolBarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    title: {
        flexGrow: 1,
    },
	drawer: {
		width: drawerWidth,
        flexShrink: 0,
        color: '#4A5568'
	},
	drawerPaper: {
        width: drawerWidth,
        position: 'relative',
        backgroundColor: '#f5f5f5',
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9)
        },
    },
    nameText: {
        color: '#4A5568'
    },
    directoryText: {
        color: '#4A5568'
    },
	uiProgress: {
        color: '#63B3ED',
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
});

export default withStyles(styles)(Home)