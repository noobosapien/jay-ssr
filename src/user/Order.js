import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { v4 as uuidv4 } from 'uuid';
import OrderItem from './OrderItem';

import { UserContext } from '../App';

import { getOrderDetails } from './api-user';

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
    image: {
        width: '50px'
    }
}));


export default function Order(props){
    const {id} = props;
    const userContext = useContext(UserContext);

    const classes = useStyles();

    const [orderData, setOrderData] = useState({});
    console.log("Order 38: ", id);
    useEffect(() => {
        const getOrder = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const result = await getOrderDetails({user: userContext.user}, id, signal);

            setOrderData(result.order);
        }

        getOrder();
    }, [id])
    
    return <> 
        <Card variant='outlined'>
            <Grid container justify='flex-end'>
                <Grid item xs={2}>
                    <Typography variant='h6'>{orderData ? orderData.created? orderData.created : undefined : undefined}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant='h6'>{orderData ? orderData.price? orderData.price : undefined : undefined}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography variant='h6'>{orderData ? orderData.status? orderData.status : undefined : undefined}</Typography>
                </Grid>
                {console.log("Order 63: ", orderData)}

                {
                    orderData && orderData.items instanceof Array ? 
                    orderData.items.map((item) => {
                        return <Grid item xs={12}>
                                <OrderItem 
                                pid={item.product._id}
                                amount={item.amount} />
                            </Grid>
                    }) : undefined
                }
            </Grid>
        </Card>
    </>
}