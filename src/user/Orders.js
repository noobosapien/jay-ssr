import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';

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
            orders.push(<>
                <Grid key={uuidv4()} item xs={12} lg={6} style={{marginBottom: '5%'}}>
                    <Order id={orderIDs[i]} />
                </Grid>
                <Grid item xs={12}/>
                </>
            )
        }
        setAllOrders(orders);

    }, [orderIDs]);

    const addOneToAllowed = e => {
        setAllowed(allowed+2);
    }
    
    return <> 
        
        <Grid container justify='center'>
            <Grid item >
                <Typography className={classes.heading} variant='h4'>Orders</Typography>
            </Grid>
            <Grid item xs={8} lg={4}/>
            <Grid ite xs={12} style={{marginBottom: '4%'}} />

            {
                allOrders instanceof Array ? allOrders.map((ao, i) => 
                i <= allowed ?
                <> {ao} </> :
                <></>
            ) : undefined
            }
            <Grid item xs={12}/>

            <Grid item>
                <Button endIcon={<ArrowDropDownCircleIcon/>} variant='outlined' onClick={addOneToAllowed}>
                    Load more
                </Button>
            </Grid>
        </Grid>
    </>
}