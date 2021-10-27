import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import NewOrders from './orders/NewOrders';


const useStyles = makeStyles((theme) => ({
    
}));

export default function AllOrders(props){

    const classes = useStyles();
    const [update, setUpdate] = useState(0);

    return <>
        <Grid container justify='center'>
            <Grid item>
                <Typography className={classes.typ} variant='h6'>All Orders</Typography>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={2}>
                <Typography>New Orders</Typography>
            </Grid>
            <Grid item xs={10} />
            <Grid item xs={12} >
                <NewOrders update={update} setUpdate={setUpdate}/>
            </Grid>

            <Grid item xs={2}>
                <Typography>Processed Orders</Typography>
            </Grid>
            <Grid item xs={10} />
        </Grid>
    </>
}