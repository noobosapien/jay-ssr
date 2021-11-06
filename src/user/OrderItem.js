import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { getProduct } from '../products/api-products';
// import { v4 as uuidv4 } from 'uuid';

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
        height: '50px'
    },
    itemName: {
        fontSize: '0.85rem'
    },
    itemQuantity: {
        color: theme.palette.common.gray,
        fontSize: '0.5rem'
    }
}));


export default function OrderItem(props){
    const classes = useStyles();
    const {pid, amount} = props;

    const [item, setItem] = useState({});

    useEffect(() => {
        const getTheItem = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                const result = await getProduct(pid, signal);
                setItem(result.product);
            }catch(e){
                console.log(e);
            }
        }

        getTheItem();
    }, [pid])
    
    return <> 
        <Card variant='outlined' style={{padding: '2%'}}>
            <Grid container justify='space-between' alignItems='center' spacing={1}>
                <Grid item >
                    {
                        item ? item.image ? 
                        <img className={classes.image} alt='order' src={item.image} /> :
                        undefined : undefined
                    }
                </Grid>
                <Grid item container justify='space-around' xs={6} md={8}>
                    <Grid item>
                    {
                        item ? item.name ? <Typography className={classes.itemName}>{item.name}</Typography> : undefined : undefined
                    }
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item>
                    {
                        amount ? <Typography className={classes.itemQuantity}>Quantity:&nbsp;&nbsp;&nbsp;{amount}</Typography> : undefined
                    }
                    </Grid>
                </Grid>

                <Grid item xs={12} />
            </Grid>
        </Card>
    </>
}