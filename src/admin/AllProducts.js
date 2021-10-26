import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../App';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Products from './products/Products';
import MinorCategory from './products/MinorCategory';
import Category from './products/Category';
import Shop from './products/Shop';


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

export default function AllProducts(props) {

    const [selectedShop, setSelectedShop] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMinorCat, setSelectedMinorCat] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const userContext = useContext(UserContext);

    return <> 
        <Card>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='h4'>All Products</Typography>
                </Grid>
                <Grid item xs={12}>
                    {Shop(userContext, selectedShop, setSelectedShop)}
                </Grid>
                <Grid item xs={12}>
                    {Category(userContext, selectedShop, selectedCategory, setSelectedCategory)}
                </Grid>
                <Grid item xs={12}>
                    {MinorCategory(userContext, selectedCategory, selectedMinorCat, setSelectedMinorCat)}
                </Grid>
                <Grid item xs={12}>
                    {Products(userContext, selectedMinorCat, selectedProduct, setSelectedProduct)}
                </Grid>
            </Grid>
        </Card>
    </>;
}