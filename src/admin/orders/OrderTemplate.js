import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import StatusPopup from './StatusPopup';

import { setOrderToShipping } from '../api-admin';
import { UserContext } from '../../App';

const useStyles = makeStyles((theme) => ({
    image: {
        height: '100px'
    },
    orderHeading: {
        backgroundColor: 'aqua',
        color: 'purple'
    },
    eachItem: {
        marginTop: '5%'
    },
    name: {
        marginTop: '10%',
        marginBottom: '10%'
    }
}));

export default function OrderTemplate(props){

    const { order, update, setUpdate } = props;
    const classes = useStyles();

    const userContext = useContext(UserContext);

    const [openPopup, setOpenPopup] = useState(false);
    const [acceptCall, setAcceptCall] = useState(()=>{});
    const [declineCall, setDeclineCall] = useState(()=>{});
    const [loading, setLoading] = useState(false);

    const setToShipping = async () => {

        if(userContext.user){
            const abortController = new AbortController();
            const signal = abortController.signal;
    
            const result = await setOrderToShipping({user: userContext.user}, order, signal);
            if(result.error){
                console.log("Order update error: ", result);
            }
            setUpdate(update+1);
        }
        
    }


    const setPopup = () => {
        setOpenPopup(true);
        setAcceptCall(() => async () => {
            setLoading(true);
            await setToShipping();
            setOpenPopup(false);
            setLoading(false);
        });
        setDeclineCall(() => () => {setOpenPopup(false)});
    }

    return <>
        <StatusPopup open={openPopup} loading={loading} name="order" accept={acceptCall} decline={declineCall}/>

        <Card>
            <Grid container justify='center'>
                <Grid item xs={12}>
                    <Card className={classes.orderHeading}>
                        <Grid container justify='space-evenly'>
                            <Grid item>
                            {order ? <Typography>{new Date(order.created).toString()}</Typography> : undefined}
                            </Grid>
                            <Grid item>
                            {order ? <Typography>${order.price/100}</Typography> : undefined}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {
                    order ? order.items instanceof Array ? 
                    order.items.map((item) => {
                    return <React.Fragment>
                    <Grid item xs={4} className={classes.eachItem}>
                            <img className={classes.image} alt='order item' src={`${item ? item.product ? item.product.image : undefined : undefined}`} />
                    </Grid>

                    <Grid container item xs={4} className={classes.eachItem}>
                        <Grid item xs={12}>
                            <Typography>{item ? item.product ? item.product.name : undefined : undefined}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{item ? item.product ? item.product.uid: undefined : undefined}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>Amount: {item.amount} <br/> Stock: {item ? 
                            item.product ? 
                            item.product.stock : 
                            undefined : 
                            undefined}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} /></React.Fragment>
                    }) : undefined : undefined
                }
                

            </Grid>
        </Card>
        <Card>
            <Grid container justify='space-evenly'>
                <Grid container justify='space-evenly' item xs={10}>
                    <Grid item className={classes.name}>
                        <Typography>Name: Migara</Typography>
                    </Grid>
                    <Grid item xs={12} />

                    <Grid container item xs={3}>

                        <Grid item xs={12}>
                            <Typography>Delivery Address:</Typography>
                        </Grid>
                        <Grid item>
                            {order ? order.address ? <Typography>{order.address}</Typography> : undefined : undefined}
                        </Grid>
                        
                    </Grid>

                    <Grid container item xs={3}>
                        <Grid item xs={12}>
                            <Typography>Billing Address:</Typography>
                        </Grid>
                        <Grid item>
                            {order ? order.billingAddress ? <Typography>{order.billingAddress}</Typography> : undefined : undefined}
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12} />
                    <Button variant='outlined' onClick={setPopup}>Done</Button>
                <Grid item>

                </Grid>
            </Grid>
        </Card>
    </>
}