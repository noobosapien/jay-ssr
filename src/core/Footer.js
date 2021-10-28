import React from 'react';
import {makeStyles} from '@material-ui/styles';
import FooterAdornment from '../assets/images/FooterRect.svg';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {Link} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    footer: {
        backgroundColor: theme.palette.common.blue,
        width: '100%',
        zIndex: 1302,
        position: 'relative',
        [theme.breakpoints.down("sm")]: {
            height: "14em"
        },
    },
    adornment: {
        height: '20em',
        verticalAlign: 'bottom',
        [theme.breakpoints.down("md")]: {
            height: "15em"
        },
        [theme.breakpoints.down("sm")]: {
            height: "14em"
        },
    },
    about: {
        // position: 'absolute',
        left: '10%',
        color: theme.palette.common.white,
        fontSize: '1.75 rem',
        // fontWeight: 'bold',
        textDecoration: 'none'
    },
    payment: {
        marginTop: "2%",
        color: theme.palette.common.orange,
    },
    copyright: {
        color: theme.palette.common.white,
        marginTop: '10%'
    },
    medContent: {
        marginTop: '10%'
    }
}));

function large(classes){
    return <> 
    <Grid container spacing={0} direction="row" justify='center'>
        <Grid item xs={2}>
            {/* <img className={classes.adornment} src={FooterAdornment} alt='decorative slash'></img> */}
            <img className={classes.adornment} src={"https://jaytronics.s3.ap-southeast-2.amazonaws.com/other/FooterRect.svg"} alt='decorative slash'></img>
        </Grid>
        <Grid item container direction="column" xs={2} justify="center" spacing={1} alignItems="center">
            <Grid item >
                <Typography component={Link} to="/" variant="h6" className={classes.about}>Home</Typography>
            </Grid>
            <Grid item>
                <Typography component={Link} to="/contact" variant="h6" className={classes.about}>Contact us & Privacy policy</Typography>
            </Grid>
        </Grid>
        <Grid item xs={1} />
        <Grid className={classes.payment} item container xs={4} spacing={0} direction="row" alignItems="center" justify="center">
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Electronics" variant="h6" className={classes.about}>Electonics</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Electrical" variant="h6" className={classes.about}>Electrical</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Automotive" variant="h6" className={classes.about}>Automotive</Typography>
            </Grid>

            
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Meters" variant="h6" className={classes.about}>Meters</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Drones" variant="h6" className={classes.about}>Drones</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/HVAC" variant="h6" className={classes.about}>HVAC</Typography>
            </Grid>


            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Trade Equipment" variant="h6" className={classes.about}>Trade Equipment</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Cables" variant="h6" className={classes.about}>Cables</Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography component={Link} to="/cat/Hobbies" variant="h6" className={classes.about}>Hobbies</Typography>
            </Grid>
        </Grid>
        <Grid container item xs={2} justify='flex-end' alignItems="flex-end">
            <Grid item>
            <Typography variant="h6" className={classes.copyright}>
                © 2021 Jaytronics
            </Typography>
            </Grid>
        </Grid>
    </Grid></>
}

function medium(classes){
    return <> 
    <Grid container>
        <Grid item xs={2}>
            <img className={classes.adornment} src={FooterAdornment} alt='decorative slash'></img>
        </Grid>
        <Grid container item xs={6} direction="row" className={classes.medContent}>
            <Grid item xs={12}>
                <Typography component={Link} to="/" className={classes.about}>Home</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography component={Link} to="/about" className={classes.about}>About us</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography component={Link} to="/contact" className={classes.about}>Contact us & Privacy policy</Typography>
            </Grid>
        </Grid>
        <Grid item className={classes.copyright} xs={4}>
            <Typography variant="caption">© 2021 Jaytronics</Typography>
        </Grid>
    </Grid>
    </>
}

export default function Footer(props){
    const classes = useStyles();
    const below = useMediaQuery(theme => theme.breakpoints.down('sm'))

    return(
        <>
            <footer className={classes.footer}>
                {below ? medium(classes) : large(classes)}
            </footer>
        </>
    )
}