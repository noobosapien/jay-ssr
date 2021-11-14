import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { v4 as uuidv4 } from 'uuid';
import OrderItem from './OrderItem';
import Chip from '@material-ui/core/Chip';
import LocalPostOfficeIcon from '@material-ui/icons/LocalPostOffice';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Skeleton from '@material-ui/lab/Skeleton';

import { UserContext } from '../App';

import { getOrderDetails } from './api-user';

const useStyles = makeStyles(theme => ({
    headingShipped: {
        background: theme.palette.common.blue,
        color: theme.palette.common.white,
        marginBottom: '5%',
        padding: '1%'
    },
    headingOther: {
        background: theme.palette.common.purple,
        color: theme.palette.common.white,
        marginBottom: '5%',
        padding: '1%'
    },
    orderRow: {
        '& > *': {
          borderBottom: 'unset',
        },
    },
    image: {
        width: '50px'
    },
    orderItem: {
        padding: '1%'
    },
    chipUID: {
        background: theme.palette.common.black,
        color: theme.palette.common.white
    },
    chipShipped: {
        background: theme.palette.common.green,
        color: theme.palette.common.white
    },
    chipOther: {
        background: theme.palette.common.orange,
        color: theme.palette.common.white
    },
    addresses: {
        padding: '4%',
        fontSize: '1.2rem'
    },
    skeletonBG: {
        background: theme.palette.common.aqua
    }
}));


export default function Order(props){
    const {id} = props;
    const userContext = useContext(UserContext);

    const classes = useStyles();

    const [orderData, setOrderData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getOrder = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            setLoading(true);
            const result = await getOrderDetails({user: userContext.user}, id, signal);
            setLoading(false);

            setOrderData(result.order);
        }

        getOrder();
    }, [id, userContext.user])
    
    return <> 
        <Card variant='outlined'>
            <Grid container justify='space-around'>
                {
                    loading ? <> 
                    <Grid item xs={12}>
                        <Skeleton variant="rect" width='1200px' height='170px' animation='pulse' classes={{rect: classes.skeletonBG}}/>
                    </Grid>
                    </> :
                    <> 
                        <Grid item xs={12}>
                        <Card className={orderData.status === 'Shipped' ? classes.headingShipped : classes.headingOther}>
                            <Grid container justify='space-around'>
                            
                            <Grid item>
                                <Chip
                                color='primary'
                                classes={{colorPrimary: classes.chipUID}}
                                label={`UID: 
                                ${orderData ? orderData.uid? 
                                orderData.uid : 
                                undefined : undefined}`} />
                            </Grid>

                            <Grid item>
                            <Typography className={classes.typ} variant='h6'>
                                {orderData ? orderData.created? 
                                new Date(orderData.created).toDateString() : 
                                undefined : undefined}
                            </Typography>
                            </Grid>

                            <Grid item>
                            <Typography className={classes.typ} variant='h6'>
                                {orderData ? orderData.created? 
                                new Date(orderData.created).toLocaleTimeString() : 
                                undefined : undefined}
                            </Typography>
                            </Grid>

                            <Grid item xs={4} lg='auto'>
                                <Typography variant='h6'>{orderData ? orderData.price? '$'+ orderData.price/100 : undefined : undefined}</Typography>
                            </Grid>
                            <Grid item>
                            <Chip
                                color='primary'
                                classes={
                                    orderData ? orderData.status? orderData.status === 'Shipped' ? 
                                    {colorPrimary: classes.chipShipped} : 
                                    {colorPrimary: classes.chipOther} :
                                    {colorPrimary: classes.chipOther} :
                                    {colorPrimary: classes.chipOther}
                                }
                                label={`${orderData ? orderData.status? orderData.status : undefined : undefined}`} />
                            </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                    <Accordion>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        >
                        <Typography variant='h6' className={classes.accordianHead}>Addresses</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Grid container justify='center'>
                        <Grid item xs={12} lg={10}>
                            <Card variant='outlined' className={classes.addresses}>
                            <Typography style={{fontSize: '1.1rem'}}><LocalPostOfficeIcon/>&nbsp;&nbsp;&nbsp;{orderData.address}</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={10}>
                            <Card variant='outlined' className={classes.addresses}>
                            <Typography style={{fontSize: '1.1rem'}}><ReceiptIcon/>&nbsp;&nbsp;&nbsp;{orderData.billingAddress}</Typography>
                            </Card>
                        </Grid>
                        </Grid>
                        </AccordionDetails>
                    </Accordion>
                    </Grid>

                    <Grid item xs={12}>
                    <Accordion>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        >
                        <Typography variant='h6' className={classes.accordianHead}>Items</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Grid container justify='center'>
                        {
                            orderData && orderData.items instanceof Array ? 
                            orderData.items.map((item) => {
                                return <>
                                <Grid item xs={10} key={uuidv4()} className={classes.orderItem}>
                                    <OrderItem 
                                    pid={item.product._id}
                                    amount={item.amount} />
                                </Grid>
                                <Grid item xs={12} />
                                </>
                            }) : undefined
                        }
                        </Grid>
                        </AccordionDetails>
                    </Accordion>
                    </Grid>
                    </>
                }
            </Grid>
        </Card>
    </>
}