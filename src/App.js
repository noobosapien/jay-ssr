import React, { useState, useEffect } from 'react';
import MainRouter from './MainRouter';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import auth from './auth/auth-helper';
import cartHelper from './payments/cart-helper';
import { getProduct } from './products/api-products';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export const UserContext = React.createContext(null);
export const CartContext = React.createContext([]);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUser(auth.isAuthenticated())
  }, []);

  useEffect(() => {
    const localCart = cartHelper.getCart();
    if(localCart){
      setCart(localCart)
    }
  }, []);

  useEffect(() => {
    const checkCart = async () => {
      var arr =[];
      const abortController = new AbortController();
      const signal = abortController.signal;

      for(var i =0; i < cart.length; i++){
        const prod = await getProduct(cart[i]._id, signal);

        if(prod.product.stock >= cart[i].amount){
          arr.push(cart[i]);
        }

      }

      if(cart.length !== arr.length){
        setMessage("Some items were removed from the cart because stock numbers of those items have decreased.");
        setOpenMessage(true);
        setCart([...arr]);
      }

    cartHelper.saveCart(cart);

    }
    
    checkCart();
  }, [cart]);

  //cart with server
  useEffect(() => {
    cartHelper.getCartFromUser({user}, cart, setCart);
  }, [user]);

  useEffect(() => {
    cartHelper.saveCartFromUser({user}, cart);
  }, [cart]);

  const handleMsgClose = (event) => {
    setOpenMessage(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{user, setUser}}>
        <CartContext.Provider value={{cart, setCart}}>
        <Snackbar open={openMessage} autoHideDuration={8000} onClose={handleMsgClose}>
            <Alert onClose={handleMsgClose} severity="error">
                {message}
            </Alert>
        </Snackbar>
        <BrowserRouter> {/*change this to force reset for product page change */}
        <MainRouter />
        </BrowserRouter>
        </CartContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
