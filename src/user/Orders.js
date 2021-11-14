import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import Pagination from '@mui/material/Pagination';

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
    pages: {
        // background: 'green',
    },
    pagination: {
        marginBottom: '15%',
        marginTop: '15%',
    }
}));


export default function Orders(props){
    const classes = useStyles();

    const userContext = useContext(UserContext);
    const [orderIDs, setOrderIDs] = useState([]);
    const [allowed, setAllowed] = useState(0);
    const [allOrders, setAllOrders] = useState();
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getAllOrders = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const result = await getOrders({user: userContext.user}, signal);
            if(result && result.orders instanceof Array){
                setOrderIDs([...result.orders]);

                if(Math.floor(result.orders.length % 2) === 0)
                    setPages(Math.floor(result.orders.length / 2));
                else
                    setPages(Math.floor(result.orders.length / 2) + 1);
            }
        }

        getAllOrders();
    }, [userContext.user]);

    useEffect(() => {

        var orders = [];

        for(var i = allowed; i < allowed + 2 ; i++){

            if(orderIDs[i] === undefined){
                break;
            }

            orders.push(<>
                <Grid key={uuidv4()} item xs={12} lg={6} style={{marginBottom: '5%'}}>
                    <Order id={orderIDs[i]} />
                </Grid>
                <Grid item xs={12}/>
                </>
            )
        }
        setAllOrders(orders);

    }, [orderIDs, allowed]);

    const addOneToAllowed = (e, p) => {
        setAllowed((p * 2) - 2);
        setPage(p);
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
                i <= 1 ?
                <> {ao} </> :
                <></>
            ) : undefined
            }
            <Grid item xs={12}/>

            <Grid item>
                <Pagination
                count={pages} 
                page={page}
                variant='text' 
                color='primary' 
                classes={{text: classes.pages}}
                onChange={addOneToAllowed}
                className={classes.pagination} />
            </Grid>
        </Grid>
    </>
}