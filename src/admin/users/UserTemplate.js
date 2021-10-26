import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { UserContext } from '../../App';
import { getUserInfo } from '../api-admin';

const useStyles = makeStyles((theme) => ({
    admin: {
        color: '#0077a6'
    }
}));

export default function UserTemplate(props){

    const { customer } = props;
    const userContext = useContext(UserContext);
    const classes = useStyles();

    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const getUser = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;

                if(userContext.user){
                    const result = await getUserInfo({user: userContext.user}, customer._id, signal);

                    if(result.customer){
                        setUserInfo({...result.customer});
                    }
                }
    
            }catch(e){
                console.log(e);
            }
        }

        getUser();
    }, []);

    return <>{console.log("UT 58:", userInfo)}
        <Card>
            <Grid container justify='center' spacing={3}>
                <Grid item>
                    {userInfo.firstName ? <Typography>{userInfo.firstName}</Typography> : undefined }
                </Grid>

                <Grid item>
                    {userInfo.lastName ? <Typography>{userInfo.lastName}</Typography> : undefined }
                </Grid>

                <Grid item>
                    {userInfo.admin ? <Typography className={classes.admin} variant='h6'>Admin</Typography> : undefined }
                </Grid>
                <Grid item xs={12} />

                <Grid item>
                    <Typography>Email:</Typography>
                </Grid>
                <Grid item>
                    {userInfo.email ? <Typography>{userInfo.email}</Typography> : undefined }
                </Grid>
                <Grid item xs={12} />

                <Grid item container justify='center'>
                {
                    userInfo.address ? <> 
                        <Grid item>
                        <Typography variant='h6'>Delivery Address</Typography>
                        </Grid>
                        <Grid item xs={12} />

                        <Grid item>
                        <Typography>{userInfo.address}</Typography>
                        </Grid>
                        <Grid item xs={12} />
                        
                    </> : undefined
                }

                </Grid>
                <Grid item container justify='center'>
                {
                    userInfo.billingAddress ? <> 
                        <Grid item>
                        <Typography variant='h6'>Billing Address</Typography>
                        </Grid>
                        <Grid item xs={12} />

                        <Grid item>
                        <Typography>{userInfo.billingAddress}</Typography>
                        </Grid>
                        <Grid item xs={12} />
                        
                    </> : undefined
                }    
                </Grid>
            </Grid>
        </Card>
    </>
}