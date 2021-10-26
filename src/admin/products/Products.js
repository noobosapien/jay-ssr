import React, { useState, useEffect, useRef, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';

import { v4 as uuidv4 } from 'uuid';
import {
    getProducts,
    getProduct,
    removeProduct
} from '../api-admin';

import ProductDisplay from './ProductDisplay';
import AddProduct from './AddProduct';
import Popup from './Popup';

const useStyles = makeStyles((theme) => ({
    image: {
        height: '200px',
        width: '200px'
    },
    selectMinCategory: {
        maxWidth: '360px',
        maxHeight: '360px',
        position: 'relative',
        overflow: 'auto',
        backgroundColor: theme.palette.common.white,
    },
    listSection: {
        backgroundColor: 'inherit'
    },
    ul: {
        backgroundColor: 'inherit'
    }
}));



function Products(user, minorCat, selecetedProduct, setSelectedProduct){
    const classes = useStyles();
    const [editProduct, setEditProduct] = useState(false);
    const [refresh, setRefresh] = useState(0);

    //Current Product
    const [allProducts, setAllProducts] = useState([]);
    const [activeProduct, setActiveProduct] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [acceptCall, setAcceptCall] = useState(()=>{});
    const [declineCall, setDeclineCall] = useState(()=>{});

    ////////////////////////////////////////////////////////////
    ////////////////CURRENT PRODUCT
    ////////////////////////////////////////////////////////////

    //set active prod for events
    const _eventSetActiveProd = (prod) => async(event) => {
        getActiveProduct(prod);
    }
    //set active product info
    const getActiveProduct = async (prod) => {
        try{
            if(prod){
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                const product = await getProduct(user, prod._id, signal);
    
                if(product && product.product){
                    setActiveProduct(product.product)
                }else{
                    setActiveProduct({});
                }
            }
            
        }catch(e){
            console.log(e);
        }
    }

    const removeProd = async event => {
        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            if(user.user && activeProduct && activeProduct._id){
                const result = await removeProduct(user, activeProduct._id, signal);
                console.log(result);
            }

            setSelectedProduct();//newProduct

        }catch(e){
            console.log(e);
        }
    }

    const setPopup = () => {
        setOpenPopup(true);
        setAcceptCall(() => () => {removeProd(); setOpenPopup(false); setRefresh(refresh + 1)});
        setDeclineCall(() => () => {setOpenPopup(false)});
    }

    //get all product names and id
    useEffect(()=>{
        async function setProducts(signal){
            try{
                if(user.user){
                    const result = await getProducts(user, minorCat, signal);

                    setAllProducts(result.products);
                    if(result.products){
                        getActiveProduct(result.products[0]);
                    }
                }
                
            }catch(e){
                console.log(e);
            }
            
        }
        const abortController = new AbortController();
        const signal = abortController.signal;

        setProducts(signal);

    }, [user, minorCat, editProduct, refresh]);

    useEffect(()=>{
        if(allProducts && allProducts.length !== 0){
            setActiveProduct(allProducts[0]);
        }else{
            setActiveProduct({});
        }
    }, [allProducts]);
    
    const showProducts = <Grid container>
    <Grid item xs={12}>
        <FormControl component="fieldset">
            <FormLabel component="legend">Products</FormLabel>
            <RadioGroup row aria-label="Products" name="Product" value={activeProduct?activeProduct._id:0}>
                {
                allProducts instanceof Array ? allProducts.map((prod) => {
                    return <FormControlLabel 
                    key={uuidv4()} 
                    value={prod._id} 
                    control={<Radio />} 
                    onChange={_eventSetActiveProd(prod)}
                    label={prod.name}/>
                }) : undefined
                }
            </RadioGroup>
            
            <Grid container>
            <Grid xs={3} />
            <Grid item xs={3}>
                <Button onClick={e=>{setEditProduct(true)}}>Add Product</Button>
            </Grid>
            <Grid item xs={3}>
                <Button onClick={setPopup}>Remove Product</Button>
            </Grid>
            <Grid xs={3} />
        </Grid>
        </FormControl>
    </Grid>
    <Grid item xs={12}>
        <ProductDisplay
        refresh={refresh}
        setRefresh={setRefresh} 
        user={user} 
        activeProduct={activeProduct} />
    </Grid>
    </Grid>

    return <>
        <Popup open={openPopup} name="Product" accept={acceptCall} decline={declineCall}/>

        {editProduct ? <AddProduct 
        minorCategory={minorCat} 
        user={user} 
        setEditProduct={setEditProduct} /> : showProducts}
    </>
}


export default Products;