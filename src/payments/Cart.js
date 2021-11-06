import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'react-router-dom/Link';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CartItems from './CartItems';

import { CartContext } from '../App';

import { subTotal } from './api-cart';

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
    itemCard: {
        minWidth: 275,
        padding: '4%'
    },
    totalHeader: {
        marginTop: '100px',
        fontFamily: 'Lexend Exa',
        fontSize: '1.4em',
        color: theme.palette.common.gray
    },
    toCheckout: {
        marginTop: '100px',
        fontFamily: 'Lexend Exa',
        fontSize: '1em',
        // background: theme.palette.common.blue,
        color: theme.palette.common.blue,
        borderColor: theme.palette.common.blue
    },
    cartEmpty: {
        width: '600px',
        [theme.breakpoints.down('sm')]: {
            width: '360px'
        }
    },
    mainCard: {
        marginTop: '5%',
        [theme.breakpoints.down('sm')]: {
            marginTop: '10%'
        }
    }

}));

export default function Cart(props){
    const classes = useStyles();
    const [total, setTotal] = useState(0);
    const [showCheckout, setShowCheckout] = useState(false);

    const cartContext = useContext(CartContext);

    useEffect(()=>{
        if(cartContext.cart instanceof Array && cartContext.cart.length < 1){
            setShowCheckout(false);
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
                setTotal(result.total);
                return setShowCheckout(true);
            }else{
                return setShowCheckout(false);
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

    const cartItems = <> 
    <Grid container justify='center'>
        <CartItems />

        <Grid item xs={8} />
        <Grid item>
            <Typography className={classes.totalHeader}>
                {total > 0 ? `Sub total: $${total/100}` : undefined}
            </Typography>
        </Grid>
        <Grid item xs={12} />
        <Grid item>
            <Button className={classes.toCheckout} 
            component={Link} to='/checkout'
            disabled={!showCheckout} variant='outlined'>
                Go to checkout
            </Button>
        </Grid>
    </Grid>
    </>

    const cartEmpty = <> 
    <Grid container justify='center'>
        <Grid item>
            <img 
            alt='empty cart' 
            src='https://jaytronics.s3.ap-southeast-2.amazonaws.com/other/cartempty.png' 
            className={classes.cartEmpty}/>
        </Grid>
    </Grid>
    </>
    
    return <>
    <Card>
        <Grid container>
            <Grid item xs={12}>
                <Card className={classes.mainCard}>
                    <Grid container justify='center'>
                        <Grid item>
                            <Typography variant='h4' className={classes.heading}>Cart</Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <Card className={classes.itemCard}>
                            {total > 0 ? cartItems : cartEmpty}
                        </Card>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    </Card>
    </>
}