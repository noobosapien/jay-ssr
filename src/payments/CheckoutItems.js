import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import { UserContext, CartContext } from '../App';
import { subTotal } from './api-cart';

const useStyles = makeStyles(theme => ({
    items: {
        marginTop: '10%',
        marginBottom: '10%'
    },
    itemDesc: {
        // marginTop: '10%',
        // marginBottom: '10%',
        color: theme.palette.common.gray,
        fontSize: '1.2rem'
    },
    itemText: {
        // marginTop: '10%',
        // marginBottom: '10%',
        fontSize: '1.2rem',
        color: theme.palette.common.black,
    },
    space: {
        marginBottom: '4%'
    },
    checkoutHead: {
        marginTop: '4%'
    },
    shipLabel: {
        fontSize: '1.2rem',
        color: theme.palette.common.white
    },
    totalLabel: {
        fontSize: '1.2rem',
        color: theme.palette.common.white
    },
    itemAvatar: {
        background: theme.palette.common.purple,
        color: theme.palette.common.white
    }
}));

export default function CheckoutItems(props){
    const classes = useStyles();
    const cartContext = useContext(CartContext);
    const userContext = useContext(UserContext);

    const [total, setTotal] = useState(undefined);
    const { shipping } = props;

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
                setTotal(Number(result.total));
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
            <Typography variant='h5' className={classes.checkoutHead}>Checkout Items:</Typography>
        </Grid>
        <Grid item container justify="space-around" className={classes.items}>
            {
                cartContext.cart.map((item)=>{
                    return (
                        <>
                        <Grid item xs={8}>
                            <Typography className={classes.itemDesc} >
                                <Chip className={classes.itemAvatar} label={item.amount} /> x {item.name} 
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography className={classes.itemText}>${
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
                        <Grid item xs={12} className={classes.space}/>

                        </>
                    )
                })
            }
            <Grid item xs={12} className={classes.space}/>
            <Grid item>
                {/* <Typography className={classes.itemDesc}>Shipping </Typography> */}
                <Chip color='primary' 
                avatar={shipping === 1100 ? <Avatar style={{background: '#ff6f00'}}>R</Avatar> : <></>} 
                label="Shipping" 
                classes={{label: classes.shipLabel}}/>
                {/* {
                    shipping === 1100 ? <Avatar>R</Avatar> : <></>
                }
                 */}
            </Grid>
            <Grid item xs={2}>
                <Typography className={classes.itemText}>${shipping/100}</Typography>
            </Grid>
            <Grid item xs={12} className={classes.space}/>

            <Grid item>
                <Chip color='primary' 
                label="Total" 
                classes={{label: classes.totalLabel}}/>
                {/* <Typography className={classes.itemDesc}>Total </Typography> */}
            </Grid>
            <Grid item xs={2}>
                <Typography className={classes.itemText}>${(total  + shipping)/100}</Typography>
            </Grid>
            <Grid item xs={12}/>
        </Grid>
    </Grid>
    </Card>
    </>
}