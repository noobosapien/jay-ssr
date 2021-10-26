import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';

import { UserContext } from '../App';
import { CartContext } from '../App';

import { getOrder } from './api-checkout';

const useStyles = makeStyles(theme => ({
    mainCard: {
        minWidth: '5rem',
        minHeight: '50rem',
        marginTop: '10%'
    }
}));

export default function OrderSuccess(props){

    const classes = useStyles();

    const { id } = useParams();
    const history = useHistory();
    const userContext = useContext(UserContext);
    const cartContext = useContext(CartContext);

    useEffect(() => {
        const viewOrder = async () => { 
            if(userContext && userContext.user){
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                const result = await getOrder({user: userContext.user}, id, signal);

                if(result && result.viewed){
                    history.push('/user/account');
                }
            }
        }

        viewOrder();
    }, [userContext.user, id]);

    useEffect(() => {
        cartContext.setCart([]);
    }, [cartContext])

    const pushToAccount = e => history.push('/user/account');

    return<>
    <Card className={classes.mainCard}>
    <Grid container justify="center" alignItems="center">
        <Grid item>
            <Grow in>
                <Typography variant='h4'>Order placed successfully!</Typography>
            </Grow>
        </Grid>
        <Grid item xs={12} />
        <Grid item>
            <Grow in timeout={1000}>
                <Typography variant='h6'>Go to the account page to view the order</Typography>
            </Grow>
        </Grid>
        <Grid item xs={12} />
        <Grid item>
            <Grow in timeout={1000}>
                <Button variant='outlined' onClick={pushToAccount}>Account</Button>
            </Grow>
        </Grid>
    </Grid>
    </Card>
    </>
}