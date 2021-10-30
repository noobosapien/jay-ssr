import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Categories from './Categories';
import Grid from '@material-ui/core/Grid';
import Banner from './Banner';
import ProductCarousel from './ProductCarousel';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 1400,
        margin: 'auto',
        marginTop: theme.spacing(5),
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    categories: {
        marginTop: '4%',
        // background: 'linear-gradient(161deg, rgba(0,0,0,1) 36%, rgba(0,125,147,1) 100%)',
        color: theme.palette.common.gray,
        width: '20%',
        // borderRadius: '50% 20% / 10% 40%'
    },
    message: {
        marginTop: '2%',
        marginBottom: '2%',
        paddingLeft: '2%',
        // background: 'rgb(89,0,126)',
        background: 'linear-gradient(90deg, rgba(0,125,147,1) 0%, rgba(176,161,62,1) 96%)',
        color: theme.palette.common.white,
        borderRadius: '50% 20% / 10% 40%',
        animation: `$changeBorderRadius 3000ms ${theme.transitions.easing.easeInOut} infinite`
    },
    bannerItem: {
        [theme.breakpoints.down("sm")]: {
            marginTop: '3em'
        },
    },
    productCarousel: {
        // marginTop: '2%',
        // marginBottom: '2%',
    },
    "@keyframes changeBorderRadius": {
        "0%": {
            borderRadius: '10% 20% / 10% 40%'
        },
        "50%": {
            borderRadius: '10% 40% / 50% 20%'
        },
        "100%": {
            borderRadius: '10% 20% / 10% 40%'
        },
    },
}));

export default function Home(){
    const classes = useStyles();

    return (<>
    <Grid container justify='center'>
        <Grid item xs={12} className={classes.bannerItem}>
            <Banner />
        </Grid>

        <Grid item xs={12}>
            <Card className={classes.card}>
                <Slide direction="up" in mountOnEnter unmountOnExit
                timeout={{
                    enter: 500
                }}>
                    <SnackbarContent message="Browse a catalogue of 1000+ unique items!" className={classes.message} />
                </Slide>
                
                <CardContent>
                    <ProductCarousel />

                    <Typography className={classes.categories} variant="h5" component="h5">
                        Categories
                    </Typography>
                    <Categories/>
                </CardContent>
            </Card>
        </Grid>
    </Grid>    
    </>
    );
}