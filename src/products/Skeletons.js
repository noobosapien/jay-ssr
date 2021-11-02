import React from 'react';
import Grid from '@material-ui/core/Grid';

import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles((theme) => ({
    skel: {
        position: 'relative',
        marginLeft: '12%',
        marginRight: '12%',
        marginTop: '20%',
    }
}));

export default function Skeletons(props){
    const { height, width } = props;
    const classes = useStyles();

    return <> 
    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel}/>
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>

    <Grid item xs={12} sm={6} lg={4} xl={3}>
        <Skeleton animation='wave' variant='rect' width={width} height={height} className={classes.skel} />
    </Grid>
    </>
}