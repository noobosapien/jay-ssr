import React from 'react';
import {useState, useEffect, useContext} from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


import { UserContext } from '../App';

const useStyles = makeStyles(theme => ({
    heading: {
        paddingLeft: '5%',
        paddingTop: '2%',
        paddingBottom: '5%'
    },
    mainCard: {
        [theme.breakpoints.down('xs')]: {
            marginTop: '20%'
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: '10%'
        },
        [theme.breakpoints.down('xl')]: {
            marginTop: '5%'
        }
    },
    addresses: {
        // marginLeft: '20%'
    },
    address: {
        padding: '5%',
        minWidth: '20rem'
    },
    addressItem: {
        marginBottom: '5%',
    },
    justifyBetween: {
        gap: 1
    },
    section: {
        marginTop: '4%',
        marginBottom: '2%'
    }
}));

export default function Addresses(props){
    const classes = useStyles();

    return <>
        <Card className={classes.mainCard} variant='outlined'>
        <Typography className={classes.heading} variant='h4'>Addresses</Typography>
        <Card>
            <Grid container justify='space-evenly' direction='column' alignItems="center" className={classes.addresses}>
                <Grid item xs={12} className={classes.addressItem}>
                    <Card className={classes.address}>
                        <Typography variant="inline">Delivery Address</Typography>
                        <Typography></Typography>
                        <Typography></Typography>
                        <Typography component={Link}>Edit</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} className={classes.addressItem}>
                    <Card className={classes.address}>
                        <Typography variant="inline">Billing Address</Typography>
                        <Typography></Typography>
                        <Typography></Typography>
                        <Typography component={Link}></Typography>
                    </Card>
                </Grid>
            </Grid>
        </Card>
        </Card>
    </>
}