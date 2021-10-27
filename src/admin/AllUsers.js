import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Users from './users/Users';

const useStyles = makeStyles((theme) => ({
    
}));

export default function AllUsers(props){

    const classes = useStyles();

    return <>
        <Grid container justify='center'>
            <Grid item>
                <Typography className={classes.typ} variant='h6'>All Users</Typography>
            </Grid>
            <Grid item xs={12} />
            <Grid item xs={12} >
                <Users />
            </Grid>
        </Grid>
    </>
}