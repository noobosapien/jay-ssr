import React, { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';

import PlacesAutocomplete, {
    geocodeByAddress,
  } from 'react-places-autocomplete';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

import { UserContext, CartContext } from '../App';
import { getUserBillingAddress, saveBillAddress } from "./api-checkout";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
    address: {
        marginTop: '10%',
        marginBottom: '10%'
    },
    addressText: {
        // marginTop: '8%',
        marginBottom: '8%',
        fontFamily: 'Inconsolata'
    },
    addressDesc: {
        // marginTop: '8%',
        marginBottom: '8%',
    },
    bEditAddress: {
        marginTop: '2rem'
    },
    sameAs: {
        marginTop: '8%',
    },
    countryTyp: {
        marginBottom: '1rem',
        marginTop: '2rem'
    }
  
  }));
export default function ChooseBillingAddress(props){

    const {delAddress, setBillAddress} = props;
    const classes = useStyles();

    const userContext = useContext(UserContext);

    const [address, setAddress] = useState("");
    const [editAddress, setEditAddress] = useState(false);

    const [streetError, setStreetError] = useState(false);

    const [message, setMessage] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const streetRef = useRef(null);

    useEffect(() => {
        const setUserAddress = async () => {
            if(userContext.user && userContext.user.user){
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                const result = await getUserBillingAddress({user: userContext.user}, signal);
                setAddress(result.address);
                setBillAddress(result.address);
            }
        }

        setUserAddress();
    }, [userContext.user]);

    useEffect(() => {
        if(address === undefined){
            setEditAddress(true);
        }else{
            setEditAddress(false);
        }
    }, [address]);

    const handleEdit = e => {
        setEditAddress(true);
        // setBillAddress("");
    }

    const handleMsgClose = (event) => {
        setOpenMessage(false);
    }
    
    const addressValid = () => {
        if(streetRef.current.value === ""){
            setStreetError(true)

            setMessage("Please complete the billing address");
            setOpenMessage(true);
            return false;

        }

        setStreetError(false);
        return true;
    }

    const handleEditClose = async e => {
        if(addressValid()){
            const edittedAddress = streetRef.current.value;
    
            if(userContext.user && userContext.user.user){
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                setLoading(true);
                const result = await saveBillAddress({user: userContext.user}, {address: edittedAddress}, signal);
                setAddress(result.address.billingAddress);
                setBillAddress(result.address.billingAddress);
                setLoading(false);
                setEditAddress(false);
            }
        }
    }

    const handleSameDelAddress = async e => {
        if(delAddress === undefined || delAddress === ""){
                setMessage("Delivery address incomplete");
                setOpenMessage(true);
                return
            }

        streetRef.current.value = delAddress;

        if(addressValid()){
            const edittedAddress =  streetRef.current.value;
    
            if(userContext.user && userContext.user.user){
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                setLoading(true);
                const result = await saveBillAddress({user: userContext.user}, {address: edittedAddress}, signal);
                setAddress(result.address.billingAddress);
                setBillAddress(result.address.billingAddress);
                setLoading(false);
                setEditAddress(false);
            }
        }
    }

    const showAddress = <>
    <Grow in={!editAddress} timeout={{enter: 1000, exit: 2000}}>
    <Grid container className={classes.address} alignItems="center" justify="center">
    <Grid container item xs={12}>
            <Grid item>
                <Typography variant='h6' className={classes.addressDesc}>Address:</Typography>
            </Grid>
            <Grid item xs={1}/>
            <Grid item>
                <Typography className={classes.addressText} variant='h6'>
                    {address}
                </Typography>
            </Grid>
            
        </Grid>
        <Grid item xs={2}>
            <Button onClick={handleEdit} variant="outlined">Edit</Button>
        </Grid>
    </Grid>
    </Grow>
    </>

    const [goog, setGoog] = useState("");
    const handleSelect = async (value) => {
        const result = await geocodeByAddress(value);
        setGoog(value);
        console.log("CA 213: ", result);
    }

    var searchOptions = {
        componentRestrictions: {country: "nz"}
    };

    const addressChange = <>
        <Grow in={editAddress} >
        <Grid container className={classes.address} alignItems="center" justify="center">
            <Grid container justify="center" item xs={10}>
                <Grid item xs={12}>
                <PlacesAutocomplete searchOptions={searchOptions} value={goog} onChange={setGoog} onSelect={handleSelect}>
                    {
                        ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (<>
                        <TextField size='small' inputRef={streetRef} inputProps={{...getInputProps({})}} error={streetError} margin="normal" fullWidth label="Address" variant="outlined" />
                            <div>
                                {loading ? <div>loading</div> : null}
                                {suggestions.map((suggestion) => {
                                    const style = {
                                        backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                                        marginBottom: '10px',
                                        fontFamily: 'Roboto'
                                    }

                                    return <div {...getSuggestionItemProps(suggestion, { style })}>
                                        {suggestion.description}
                                    </div>
                                })}
                            </div>
                        </>)
                    }
                    </PlacesAutocomplete>
                </Grid>
                
                <Grid item>
                    {
                        loading ?
                        <CircularProgress className={classes.bEditAddress} /> :
                        <Button onClick={handleEditClose} variant="outlined" className={classes.bEditAddress}>
                            Save
                        </Button>
                    }
                </Grid>

                <Grid item xs={12}>  
                    <Button onClick={handleSameDelAddress} className={classes.sameAs} startIcon={<ArrowBack />} >
                        same as delivery address
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        </Grow>
    </>

    return <>
    <Snackbar open={openMessage} autoHideDuration={4000} onClose={handleMsgClose}>
        <Alert onClose={handleMsgClose} severity="error">
            {message}
        </Alert>
    </Snackbar>
        <Card variant="outlined">
        <Grid container justify='space-around'>
            <Grid item xs={10}>
                <Typography variant='h5'>Billing Address:</Typography>
            </Grid>
            <Grid item xs={10}>
                {editAddress ? addressChange : showAddress}
            </Grid>
        </Grid>
        </Card>
  </>
}