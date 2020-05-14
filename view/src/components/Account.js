import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import  AccountProfile  from './AccountProfile'
import { Container, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx'

const Account = ({ classes }) => {

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    return (
        <div className={classes.content}>
            <div className={classes.toolbar} />
            <Container className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={fixedHeightPaper}>
                            <AccountProfile />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        margin: 'auto',
        flexGrow: 1,
        flexWrap: 'wrap',
        height: '100vh',
        overflow: 'auto',
    },
    paper: {
        padding:theme.spacing(2),
        textAlign: 'center',
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    toolBar: theme.mixins.toolbar,
})

export default withStyles(styles)(Account)