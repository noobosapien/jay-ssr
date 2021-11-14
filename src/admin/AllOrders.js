import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import NewOrders from './orders/NewOrders';
import ProcessedOrders from './orders/ProcessedOrders';


const useStyles = makeStyles((theme) => ({
    heading: {
        marginTop: '20%'
    }
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

            <Grid item>
                <Typography variant='h3'>New Orders</Typography>
            </Grid>
            <Grid item xs={12} />

            <Grid item>
                <NewOrders update={update} setUpdate={setUpdate}/>
            </Grid>
            <Grid item xs={12} />


            <Grid item className={classes.heading}>
                <Typography variant='h3'>Processed Orders</Typography>
            </Grid>
            <Grid item xs={12} />
            
            <Grid item>
                <ProcessedOrders update={update} setUpdate={setUpdate}/>
            </Grid>
            <Grid item xs={12} />
        </Grid>
    </>
}