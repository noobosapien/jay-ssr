import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';

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
      privacy: {
          marginBottom: '3%'
      },
      privacyCard: {
        color: theme.palette.common.gray
    }
}));

export default function Contact(props){
    const classes = useStyles();
    
    return <>
    <Card>
        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <Typography variant='h4' className={classes.heading}>Contact us & Privacy policy</Typography>
                    <Card>
                        <Grid container justify='center' spacing={4}>
                            <Grid item>
                                <Card variant='outlined'>
                                    <CardContent>
                                        <Typography variant='h5'>Email:</Typography>
                                        <Typography variant='h6'>info@jaytronicc.co.nz</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} />
                            <Grid item className={classes.privacy}>
                                <Card variant='outlined' className={classes.privacyCard}>
                                    <CardContent>
                                    <Typography variant='h3'>
                                        Privacy policy
                                    </Typography>
                                    <Typography variant='h5'>
                                        We collect personal information from you, including information about your:
                                    </Typography>
                                    <ul>
                                        <li>name</li>
                                        <li>contact information </li>
                                        <li>billing or purchase information</li>
                                    </ul>

                                    <Typography variant='h5'>We collect your personal information in order to:</Typography>
                                    <ul>
                                        <li>send the products for our customers</li>
                                    </ul>

                                    <Typography variant='h5'>Besides our staff, we share this information with:</Typography>
                                    <ul>
                                        <li>no one in order to to keep the information safe.</li>
                                    </ul>

                                    <Typography variant='h6'>
                                        Providing some information is optional. 
                                        If you choose not to enter adress or email, we'll be unable to provide our services.
                                    </Typography>

                                    <Typography variant='h6'>
                                        We keep your information safe by encrypting passwords and only allowing certain staff to access it.
                                    </Typography>

                                    <Typography variant='h6'>
                                        We keep your information safe by encrypting passwords and only allowing certain staff to access it.
                                    </Typography>

                                    <Typography variant='h6'>
                                        You have the right to ask for a copy of any personal information we hold about you, 
                                        and to ask for it to be corrected if you think it is wrong. 
                                        
                                    </Typography>

                                    <Typography variant='h6'>
                                        If you’d like to ask for a copy of your information, 
                                        or to have it corrected.
                                    </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Card>
                </Card>
            </Grid>
        </Grid>
    </Card>
    </>
}