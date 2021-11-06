import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Profile from './Profile';
import Orders from './Orders';
import Addresses from './Addresses';

import { getIsAdmin } from './api-user';

import { UserContext } from '../App';

const useStyles = makeStyles(theme => ({
    heading: {
        paddingLeft: '5%',
        paddingTop: '2%',
        paddingBottom: '5%'
    },
    profile: {
        // paddingLeft: '35%',
        paddingBottom: '5%'
    },
    profileItem: {
        paddingTop: '4%',
    },
    passwordForm: {
        width: '50%',
        paddingTop: '2%',
        paddingLeft: '2%',
        paddingBottom: '2%'
    },
    passwordGridItem: {
        paddingBottom: '10%',
    },
    passwordIndicator: {
        marginTop: '2%',
        paddingBottom: '10%',
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

export default function Account(props){
    const classes = useStyles();
    const history = useHistory();
    const userContext = useContext(UserContext);

    const [showAdmin, setShowAdmin] = useState(false);

    useEffect(() => {
        if(userContext.user === null){
            history.push('/');
        }
    });

    useEffect(() => {
        const getAdmin = async () => {

            if(userContext.user){
                const abortController = new AbortController();
                const signal = abortController.signal;

                const result = await getIsAdmin({user: userContext.user}, signal);

                if(result && result.admin){
                    setShowAdmin(true);
                }
            }
    
        }

        getAdmin();
    }, [userContext.user]);

    const toAdmin = e => {
        history.push('/admin');
    }

    return <>
        <Card>
            <Grid container justify='center'>
                
                <Grid className={classes.section} xs={12} md={5} item>
                    <Profile />
                </Grid>

                <Grid item xs={12} />
                <Grid item>
                    
                    {
                        showAdmin ?
                        <Button onClick={toAdmin}>Admin Panel</Button> :
                        undefined
                    }
                    
                </Grid>
                <Grid item xs={12} />
                
                {/* <Grid className={classes.section} item xs={12} md={5}>
                    <Addresses />
                </Grid> */}
                        
                <Grid className={classes.section} item>
                    <Orders />
                </Grid>
                        
            </Grid>
        </Card>
    </>
}