import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core';

const Todo = (props) => {

    const { classes } = props
    return (
        <div className={classes.content}>
            <div className={classes.toolbar}>
                <Typography paragraph>
                    hi I am a todo
                </Typography>
            </div>
        </div>
    )
}

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
})

export default withStyles(styles)(Todo)