import React from 'react';
import { useHistory } from "react-router-dom";
import { useEffect, useContext } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

import { CartContext } from '../App';

const promise = loadStripe("pk_test_51J5RibKsJOIyN6Wb2YjGgkEKBlc3OxyD2P0ffS7Q8Lj3AVZaGmrUp0SXxKd5TigYK7cne6QyBH2U3JzAioce3bWH00m1KB5jX5");

export default function Cart(props){
    const cartContext = useContext(CartContext);
    const history = useHistory();

    useEffect(() => {
      if(cartContext.cart.length === 0){
        history.push('/');
      }
    }, [cartContext.cart]);

    return (
        <div>
          <Elements stripe={promise}>
            <CheckoutForm />
          </Elements>
        </div>
      );
}
