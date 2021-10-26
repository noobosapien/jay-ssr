import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { UserContext } from '../../App';
import UserTemplate from './UserTemplate';
import { getAllUsers } from '../api-admin';


const useStyles = makeStyles((theme) => ({
    order: {
        marginTop: '5%'
    }
}));

export default function Users(props){

    const userContext = useContext(UserContext);

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                if(userContext.user){
                    const result = await getAllUsers({user: userContext.user}, signal);

                    if(result.customers){
                        setCustomers([...result.customers]);
                    }
                }
    
            }catch(e){
                console.log(e);
            }
        }

        getUsers();
    }, []);

    return <> 
    <Grid container spacing={4} justify='center' direction='column'>
        {
            customers instanceof Array ? customers.map((customer) => {
                return <>
                <Grid item> 
                    <UserTemplate customer={customer} />
                </Grid>
                </>
            }) : undefined
        }
    </Grid>
    </>
}