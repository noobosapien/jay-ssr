import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { UserContext, CartContext } from '../App';
import { subTotal } from './api-cart';

const useStyles = makeStyles(theme => ({
    items: {
        marginTop: '10%',
        marginBottom: '10%'
    },
    itemDesc: {
        marginTop: '10%',
        marginBottom: '10%',
        fontSize: '1.2rem'
    },
    itemText: {
        marginTop: '10%',
        marginBottom: '10%',
        fontFamily: 'Inconsolata',
        fontSize: '1.2rem'
    }
  
}));

export default function CheckoutItems(props){
    const classes = useStyles();
    const cartContext = useContext(CartContext);

    const [total, setTotal] = useState(undefined);
    const [shipping, setShipping] = useState(800);

    useEffect(()=>{
        if(cartContext.cart instanceof Array && cartContext.cart.length < 1){
            setTotal(0);
        }
    }, [cartContext.cart]);

    useEffect(()=>{
        const items = [];

        const getSubTotal = async (products, signal) => {
            const result = await subTotal(products, signal);
            const check = [];

            if(!(result.IDs instanceof Array)){
                return;
            }

            for(var i = 0; i < result.IDs.length; i++){
                for(var j = 0; j < cartContext.cart.length; j++){
                    if(cartContext.cart[j]._id === result.IDs[i]){
                        check.push(result.IDs[i]);
                    }
                }
            }

            if(check.length > 0 && 
                check.length === result.IDs.length && 
                check.length === cartContext.cart.length){
                setTotal(Number(result.total) + shipping);
            }

        }

        if(cartContext.cart instanceof Array){
            for(var i = 0; i < cartContext.cart.length; i++){
                var item = {_id: cartContext.cart[i]._id, amount: cartContext.cart[i].amount}
                items.push(item);
            }

            const abortController = new AbortController();
            const signal = abortController.signal;
            getSubTotal(items, signal);
        }

    }, [cartContext.cart]);

    return<>

    <Card variant="outlined">
    <Grid container justify='space-around'>
        <Grid item xs={10}>
            <Typography variant='h5'>Checkout Items:</Typography>
        </Grid>
        <Grid item container justify="space-around" className={classes.items}>
            {
                cartContext.cart.map((item)=>{
                    return (
                        <>
                        <Grid item xs={12}/>
                        <Grid item xs={4}>
                            <Typography className={classes.itemDesc} variant='h6'>{item.amount} x {item.name} - </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography className={classes.itemText} variant='h6'>${
                                item.price1 && item.price2 && item.price3 ? 
                                item.amount > 0 && item.amount < item.price1.lessThan ?
                                item.price1.price*item.amount/100:
                                item.amount >= item.price1.lessThan && item.amount < item.price2.moreThan ?
                                item.price2.price*item.amount/100:
                                item.amount >= item.price2.moreThan ?
                                item.price3.price*item.amount/100:
                                undefined : undefined
                            }</Typography>
                        </Grid>
                        <Grid item xs={12}/>

                        </>
                    )
                })
            }
            <Grid item xs={12}/>
            <Grid item xs={4}>
                <Typography className={classes.itemDesc} variant="h6">Shipping - </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography className={classes.itemText} variant="h6">$8</Typography>
            </Grid>
            <Grid item xs={12}/>

            <Grid item xs={12}/>
            <Grid item xs={4}>
                <Typography className={classes.itemDesc} variant='h6'>Total - </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography className={classes.itemText} variant='h6'>${total/100}</Typography>
            </Grid>
            <Grid item xs={12}/>
        </Grid>
    </Grid>
    </Card>
    </>
}