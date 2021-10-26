import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

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
}));

export default function About(props){
    const classes = useStyles();
    
    return <>
    <Card>
        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <Typography variant='h4' className={classes.heading}>About</Typography>
                    <Card>
                        <Grid container>
                            <Grid item>
                            </Grid>
                        </Grid>
                    </Card>
                </Card>
            </Grid>
        </Grid>
    </Card>
    </>
}