import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from '../App';

import Order from './Order';

import { getOrders } from './api-user';

const useStyles = makeStyles(theme => ({
    heading: {
        paddingLeft: '5%',
        paddingTop: '2%',
        paddingBottom: '5%'
    },
    orderRow: {
        '& > *': {
          borderBottom: 'unset',
        },
      },
}));


export default function Orders(props){
    const classes = useStyles();

    const userContext = useContext(UserContext);
    const [orderIDs, setOrderIDs] = useState([]);
    const [allowed, setAllowed] = useState(1);
    const [allOrders, setAllOrders] = useState();

    useEffect(() => {
        const getAllOrders = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const result = await getOrders({user: userContext.user}, signal);
            if(result && result.orders instanceof Array){
                setOrderIDs([...result.orders]);
            }
        }

        getAllOrders();
    }, [userContext.user]);

    useEffect(() => {

        var orders = [];

        for(var i = 0; i < orderIDs.length ; i++){
            orders.push(
                <Grid key={uuidv4()} item xs={12}>
                    <Order id={orderIDs[i]} />
                </Grid>
            )
        }
        setAllOrders(orders);

    }, [orderIDs]);

    const addOneToAllowed = e => {
        setAllowed(allowed+2);
    }
    
    return <> 
        <Typography className={classes.heading} variant='h4'>Orders</Typography>

        <Card variant='outlined'>
            <Grid container>

                {
                    allOrders instanceof Array ? allOrders.map((ao, i) => 
                    i <= allowed ?
                    <> {ao} </> :
                    <></>
                ) : undefined
                }

                <Grid item>
                    <Button onClick={addOneToAllowed}>More</Button>
                </Grid>
            </Grid>
        </Card>
    </>
}