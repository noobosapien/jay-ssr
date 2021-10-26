import React from 'react';
import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { CartContext } from '../App';

const useStyles = makeStyles(theme => ({
    mainCard: {
        // boxShadow: '2px 0.1px #5e5e5e, -0.2em 0 .4em #007d93ff',
    },
    image: {
        width: '150px'
    },
    name: {
        fontSize: '1.4rem',
        textDecoration: 'none !important',
    },
    parameter: {
        fontSize: '0.8rem'
    },
    value: {
        fontSize: '1.0rem'
    },
    price: {
        fontSize: '1.4rem',
        color: theme.palette.common.green
    },
    priceReduction: {
        fontSize: '1.2rem',
        color: theme.palette.common.red
    },
    removeButton: {
        background: 'rgb(255,0,1)',
        // background: 'linear-gradient(90deg, rgba(124,0,104,1) 32%, rgba(255,0,0,1) 86%)',
        color: theme.palette.common.white,
        boxShadow: '0.1px 0.1px red, -0.2em 0 .4em purple',
    }
}));

export default function CartItems(props){
    const classes = useStyles();
    
    const cartContext = useContext(CartContext);

    const removeItem = product => event => {
        if(!(cartContext.cart instanceof Array))
            return;
        
        var newCart = cartContext.cart.filter((item) => {
            return item._id !== product._id;
        });

        cartContext.setCart(newCart);
    }

    return <>
        <Grid container direction="row" justifyContent="center" alignItems="center">
            {!(cartContext.cart instanceof Array) ? undefined : cartContext.cart.map((item) => {
                return <Grid item xs={12}>
                    <Card variant="outlined" className={classes.mainCard}>
                        <CardContent>
                            <Grid container justifyContent="space-evenly">
                                <Grid item xs={3}>
                                    <img className={classes.image} src={item.image} alt="item"/>
                                </Grid>

                                <Grid container item xs={4}>
                                    <Grid item xs={12}>
                                        <Typography component={Link} to={`/prod/${item._id}`} className={classes.name}>
                                            {item.name}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography className={classes.parameter}>Qunatity:</Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography className={classes.value}>{item.amount}</Typography>
                                    </Grid>

                                    <Grid item xs={12} />
                                    
                                </Grid>

                                <Grid container item xs={3} alignItems="center">
                                    <Grid item xs={12}>
                                        <Typography className={classes.priceReduction} style={{textDecoration: 'line-through'}}>
                                            {item.price1 ? item.price1.lessThan <= item.amount ? `$${item.price1.price*item.amount/100}` : undefined : undefined}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>{console.log("Cart items 109: ", cartContext.cart)}
                                        <Typography className={classes.price}>
                                            ${
                                                item.price1 && item.price2 && item.price3 ? 
                                                item.amount > 0 && item.amount < item.price1.lessThan ?
                                                item.price1.price*item.amount/100:
                                                item.amount >= item.price1.lessThan && item.amount < item.price2.moreThan ?
                                                item.price2.price*item.amount/100:
                                                item.amount >= item.price2.moreThan ?
                                                item.price3.price*item.amount/100:
                                                undefined : undefined
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid container alignItems="flex-end" item xs={2}>
                                    <Grid item xs={12}>
                                        <Button onClick={removeItem(item)} className={classes.removeButton}>
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            })}
        </Grid>
    </>
}

