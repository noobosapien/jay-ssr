import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { getProduct } from '../products/api-products';
import { v4 as uuidv4 } from 'uuid';

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
        <Card>
            <Grid container justify='space-around'>
                <Grid item xs={2}>
                    {
                        item ? item.image ? 
                        <img className={classes.image} alt='order' src={item.image} /> :
                        undefined : undefined
                    }
                </Grid>
                <Grid item container xs={10}>
                    <Grid item xs={12}>
                    {
                        item ? item.name ? <Typography>{item.name}</Typography> : undefined : undefined
                    }
                    </Grid>
                    <Grid item xs={12}>
                    {
                        amount ? <Typography>{amount}</Typography> : undefined
                    }
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    </>
}