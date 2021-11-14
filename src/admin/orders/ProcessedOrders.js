import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Pagination from '@mui/material/Pagination';

import OrderTemplate from './OrderTemplate';

import { UserContext } from '../../App';

import { getProcessedOrders } from '../api-admin';

const useStyles = makeStyles((theme) => ({
    order: {
        marginTop: '5%'
    }
}));

export default function ProcessedOrders(props){
    const { update, setUpdate } = props;
    const classes = useStyles();

    const userContext = useContext(UserContext);

    const [procOrders, setProcOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [curIndex, setCurIndex] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const getOrders = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                if(userContext.user){
                    const result = await getProcessedOrders({user: userContext.user}, signal);
                    if(result.orders){
                        setProcOrders([...result.orders]);
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

        if(procOrders instanceof Array){
            procOrders.forEach((ord) => {
                orderTotal += ord.price;
            });
            setTotal(orderTotal);
        }

        orderTotal = 0;

    }, [procOrders]);

    const incIndex = e => {
        setCurIndex(curIndex + 4);
    }

    return <> 
    <Grid container justify='center'>
        <Grid item>
            <Typography>Total in processed orders: ${total/100}</Typography>
        </Grid>
        {
            procOrders.map((order, i) => {
                return <>
                <Grid item className={classes.order}>
                    <OrderTemplate update={update} setUpdate={setUpdate} order={order} />
                </Grid>
                </>
            })
        }

        <Grid item xs={12}/>
        <Grid item>
            <Pagination
            count={4} 
            variant='text' 
            color='primary' 
            size='large' />
        </Grid>
        {/* <Grid item>
            <Button color='primary' variant='outlined' onClick={incIndex}>Load more</Button>
        </Grid> */}
    </Grid>
    </>

}