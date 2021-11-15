import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Pagination from '@mui/material/Pagination';

import OrderTemplate from './OrderTemplate';

import { UserContext } from '../../App';

import { getProcessedOrders, getProcOrderPages, getProcOrderTotal } from '../api-admin';

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
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getOrderPages = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                if(userContext.user){
                    const result = await getProcOrderPages({user: userContext.user}, signal);
                    if(result.pages){
                        setPages(Number(result.pages));
                        if(page > result.pages)
                            setPage(result.pages);
                    }
                }
    
            }catch(e){
                console.log(e);
            }
        }

        getOrderPages();
    }, [update, userContext.user]);

    useEffect(() => {
        const getOrders = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                if(userContext.user){
                    const result = await getProcessedOrders(page, {user: userContext.user}, signal);
                    if(result.orders){
                        setProcOrders([...result.orders]);
                    }
                }
    
            }catch(e){
                console.log(e);
            }
        }

        getOrders();
    }, [update, userContext.user, page]);

    useEffect(() => {
        const getOrders = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                if(userContext.user){
                    const result = await getProcOrderTotal({user: userContext.user}, signal);
                    if(result.total){
                        setTotal(result.total);
                    }
                }
    
            }catch(e){
                console.log(e);
            }
        }

        getOrders();

    }, [update, userContext.user]);

    const onPageClick = (e, p) => {
        setPage(p);
    }

    return <> 
    <Grid container justify='center'>
        <Grid item>
            <Typography>Total in new orders: ${total/100}</Typography>
        </Grid>
        {
            procOrders.map((order, i) => {
                return <>
                <Grid item className={classes.order}>
                    <OrderTemplate isProc={true} update={update} setUpdate={setUpdate} order={order} />
                </Grid>
                </>
            })
        }
        <Grid item>
            <Pagination
            count={pages}
            page={page} 
            variant='text' 
            color='primary' 
            size='large'
            onChange={onPageClick} />
        </Grid>
    </Grid>
    </>

}