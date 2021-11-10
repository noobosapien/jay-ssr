import React, { useState, useEffect, useContext } from "react";

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { UserContext, CartContext } from '../App';
import ChooseAddress from "./ChooseAddress";
import CheckoutItems from "./CheckoutItems";
import ChooseBillingAddress from './ChooseBillingAddress';
import DeliveryNotes from './DeliveryNotes';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

import { forwardToPay } from "./api-checkout";
import LoginModal from "../core/MenuComps/LoginModal";
import { getShippingPrice } from './api-checkout';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  cardSection: {
    // marginBottom: '3%'
  },
  pay: {
    // marginTop: '100px',
    marginBottom: '100px',
    fontFamily: 'Lexend Exa',
    fontSize: '1em',
    // background: theme.palette.common.blue,
    color: theme.palette.common.blue
  },
  mainCard: {
    marginTop: '5%',
    [theme.breakpoints.down('md')]: {
      marginTop: '15%'
    }
  },
  space: {
    marginTop: '8%',
    [theme.breakpoints.down('md')]: {
      marginTop: '10%'
    }
  }

}));

export default function CheckoutForm() {
  const classes = useStyles();
  
  const cartContext = useContext(CartContext);
  const userContext = useContext(UserContext);

  const [delAddress, setDelAddress] = useState("");
  const [billAddress, setBillAddress] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState(600);
  const [rural, setRural] = useState(false);

  useEffect(() => {
    if(window){
      window.scrollTo(0, 0);
    }
    if(userContext && userContext.user === null){
      setOpenModal(true);
    }else{
      setOpenModal(false);
    }

    const getShippingCost = async(signal) => {
      if(userContext.user){
          const result = await getShippingPrice({user: userContext.user}, signal);
          if(result.shipping){
            setShipping(Number(result.shipping));

            if(Number(result.shipping === 1100)){
              setRural(true);
            }else{
              setRural(false);
            }
          }
      }
    }

    const abortController = new AbortController();
    const signal = abortController.signal;
    getShippingCost(signal);

  }, [userContext.user]);

  const handleContinue = async (event)=>{
    try{
      if(billAddress === undefined || delAddress === undefined || billAddress === "" || delAddress === ""){
        setMessage("Please add both the addresses");
        setOpenMessage(true);
        return;
      }

      if(userContext.user && cartContext.cart instanceof Array){
        const abortController = new AbortController();
        const signal = abortController.signal;
        var items = [];

        for(var i = 0; i < cartContext.cart.length; i++){
          var item = {_id: cartContext.cart[i]._id, amount: cartContext.cart[i].amount}
          items.push(item);
        }

        setLoading(true);
        const result = await forwardToPay({user: userContext.user}, items, shipping, signal);
        setLoading(false);
        window.location = result.url;

      }
    }catch(e){
      console.log(e);
    }
  }

  const handleMsgClose = (event) => {
    setOpenMessage(false);
}

  return <>
    <Snackbar open={openMessage} autoHideDuration={4000} onClose={handleMsgClose}>
        <Alert onClose={handleMsgClose} severity="error">
            {message}
        </Alert>
    </Snackbar>
    <LoginModal openModal={openModal} setOpenModal={setOpenModal} closable={false} />
    <Card className={classes.mainCard}>
      <Grid container justify='center'>
        <Grid item>
          <Typography variant='h4' className={classes.heading}>Checkout</Typography>
        </Grid>
        <Grid item xs={10} className={classes.space}/>

        <Grid item>
        <Card className={classes.itemCard}>
            <Grid container justify='space-around'  spacing='4'>
                <Grid className={classes.cardSection} item xs={10} lg={4}>
                  <ChooseAddress setDelAddress={setDelAddress} setShipping={setShipping} rural={rural} setRural={setRural} />
                </Grid>

                <Grid className={classes.cardSection} item xs={10} lg={4}>
                  <ChooseBillingAddress delAddress={delAddress} setBillAddress={setBillAddress} />
                </Grid>

                <Grid item xs={12} />
                
                <Grid className={classes.cardSection} item xs={10} lg={4}>
                  <CheckoutItems shipping={shipping} />
                </Grid>

                <Grid item xs={12} />

                <Grid item>
                  {
                    loading ? <CircularProgress /> :
                    <Button onClick={handleContinue} variant="outlined" size="large" className={classes.pay}>
                      Continue
                    </Button>
                  }
                </Grid>
            </Grid>
        </Card>
        </Grid>
      </Grid>
                    
    </Card>

    
  </>
}
