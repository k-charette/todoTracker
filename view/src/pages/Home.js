import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'
import Account from '../components/Account';
import Todo from '../components/Todo';
import { Drawer, AppBar, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, Avatar, CircularProgress } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import withStyles from '@material-ui/core/styles/withStyles';

const Home = ({history, classes}) => {
    const [loadPage, setLoadPage] = useState({
        render: false
    })

    const [authUser, setAuthUser] = useState({
        firstName: '',
        lastName: '',
        profilePicture: '',
        uiLoading: true,
        imageLoading: false
    })
    
    const loadAccountPage = (event) => {
        setLoadPage({
            render: false
        })
    }

    const loadTodoPage = (event) => {
        setLoadPage({
            render: true
        })
    }

    const logoutHandler = (event) => {
        localStorage.removeItem('AuthToken')
        history.push('/login')
    }

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
    }, [history])

    const { firstName, lastName, profilePicture, uiLoading } = authUser

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
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h5" noWrap>
                            <p className='font-sans tracking-widest'>Todo Tracker </p>
                        </Typography>
                    </Toolbar>
                </AppBar>
					<Drawer
                        anchor='left'
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<Avatar src={profilePicture} className={classes.avatar} />
							<p className={classes.nameText}>
								{' '}
								<p className='font-sans text-xl sm:text-2xl tracking-wider'>{firstName} {lastName}</p>
							</p>
						</center>
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
                    {loadPage.render ? <Todo /> : <Account /> }
            </div>
		</div>
    )
    }
}
const drawerWidth = 240

const styles = (theme) => ({
	root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        margin: 'auto'
    },
	appBar: {
        zIndex: theme.zIndex.drawer + 1,
        position: 'fixed',
        backgroundColor: '#63B3ED'
	},
	drawer: {
		width: drawerWidth,
        flexShrink: 0,
        color: '#4A5568'
	},
	drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#f5f5f5'
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
        flexGrow: 0,
        marginTop: 20,
        marginBottom: 20
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