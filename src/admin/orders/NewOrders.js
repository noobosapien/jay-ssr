import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import OrderTemplate from './OrderTemplate';

import { UserContext } from '../../App';

import { getNewOrders } from '../api-admin';


const useStyles = makeStyles((theme) => ({
    order: {
        marginTop: '5%'
    }
}));

export default function NewOrders(props){

    const { update, setUpdate } = props;

    const userContext = useContext(UserContext);
    const classes = useStyles();

    const [newOrders, setNewOrders] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const getOrders = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                if(userContext.user){
                    const result = await getNewOrders({user: userContext.user}, signal);
                    if(result.orders){
                        setNewOrders([...result.orders]);
                    }
                }
    
            }catch(e){
                console.log(e);
            }
        }

        getOrders();
    }, [update]);

    useEffect(() => {
        var orderTotal = 0;

        if(newOrders instanceof Array){
            newOrders.forEach((ord) => {
                orderTotal += ord.price;
            });
            setTotal(orderTotal);
        }

        orderTotal = 0;

    }, [newOrders]);
    
    return <> 
    <Grid container>
        <Grid item>
            <Typography>Total in new orders: ${total/100}</Typography>
        </Grid>
        {
            newOrders.map((order, i) => {
                return <>
                <Grid item className={classes.order}>
                    <OrderTemplate update={update} setUpdate={setUpdate} order={order} />
                </Grid>
                </>
            })
        }
    </Grid>
    </>
}