import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import  AccountProfile  from './AccountProfile'

const Account = ({ classes }) => {
    return (
        <div className={classes.content}>
            <div className={classes.toolbar} />
            <AccountProfile />
        </div>
    )
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        margin: 'auto',
    },
    toolBar: theme.mixins.toolbar,
})

export default withStyles(styles)(Account)