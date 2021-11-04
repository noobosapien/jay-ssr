import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { getProduct } from './api-products';
import { CartContext } from '../App';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Grow from '@material-ui/core/Grow';
import Link from '@material-ui/core/Link';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

function MyGallery(props){
    return <ImageGallery {...props} />;
}


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    mainCard: {
        // marginTop: '100px'
    },
    productGrid: {
        marginTop: "6%",
        [theme.breakpoints.down("xs")]: {
            marginTop: "20%"
        }
    },
    productHeader: {
        fontSize: "1.7rem",
        // fontFamily: 'Inconsolata'
    },
    prodImagePaper: {
        // margin: '20% 2% 2% 2%',
        // padding: '2% 2% 2% 2%',
        marginTop: '20%',
        // maxWidth: '250px',
        // minWidth: '250px'
    },
    infoPaper: {
        margin: '20% 0% 2% 0%',
        // marginTop: '5%',
        padding: '2% 2% 2% 2%',
        borderColor: theme.palette.common.blue
        // maxWidth: '650px',
        // minWidth: '350px'
    },
    infoName: {
        fontSize: "1.2rem",
        // fontFamily: 'Mate SC'
    },
    infoValue: {
        fontSize: "1.2rem",
        // fontFamily: 'Lexend Exa',
        color: theme.palette.common.gray
    },
    space: {
        marginTop: '70px'
    },
    addToCartDiv: {
        marginTop: '70px',
        width: '290px',
    },
    simItemsPaper: {
        margin: '10% 2% 2% 2%',
    },
    simItemsHeader: {
        fontSize: "1.2rem",
        // fontFamily: 'Mate SC'
    },
    simItemImg: {
        // height: '100px'
    },
    simItemsCard: {
        marginTop: '12%'
    },
    prodImg: {
        width: '250px'
    },
    cart: {
        color: theme.palette.common.blue,
        // background: 'rgb(63,60,78)',
        // background: 'linear-gradient(90deg, rgba(63,60,78,1) 14%, rgba(57,74,83,1) 84%)',
    },
    removeButton: {
        background: 'rgb(63,60,78)',
        color: 'white',
        // marginTop: '15%'
    },
    inCartHeading: {
        // fontFamily: 'Lexend Exa',
        // fontSize: '1.4em',
        // marginTop: '10%'
    },
    outOfStock: {
        marginTop: '10%'
    },
    inCartAmount: {
        // fontFamily: 'Lexend Exa',
        // marginTop: '10%',
        // fontSize: '0.7em',
    },
    paperBelow: {
        position: 'relative',
        // marginLeft: '12%',
        // marginRight: '12%',
        // height: '50px',
        // minWidth: '245px',
        // maxWidth: '245px',
        background: theme.palette.common.black,
        border: 'thick double #ff6f00',
        color: theme.palette.common.white
        // background: 'linear-gradient(90deg, rgba(38,124,0,1) 15%, rgba(21,175,59,1) 53%, rgba(0,255,55,1) 86%)'
    },
    paperOOS: {
        position: 'relative',
        // marginLeft: '12%',
        // marginRight: '12%',
        height: '50px',
        // minWidth: '245px',
        // maxWidth: '245px',
        background: theme.palette.common.red,
        border: 'thick #ff6f00',
        color: theme.palette.common.white
    },
    descName: {
        padding: '1%',
        [theme.breakpoints.down('sm')]: {
            padding: '5%',
        },
        borderRadius: 10,
        background: theme.palette.common.blue,
        color: theme.palette.common.white,
    },
    description: {
        fontSize: '1.2rem'
    },
    varParameter: {
        fontSize: '1.4rem',
        color: theme.palette.common.gray
    },
    varValue: {
        fontSize: '1.4rem'
    },
    pricesFor: {
        marginBottom: '5%',
        padding: '5%',
        borderRadius: 10,
        fontSize: '2.5rem',
        background: theme.palette.common.blue,
        color: theme.palette.common.white
    }
}));

export default function ProductPage({match}){
    const classes = useStyles();
    const [product, setProduct] = useState({});
    const [allImages, setAllImages] = useState([]);
    const [prodCart, setProdCart] = useState(0);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [inCart, setInCart] = useState(false);
    const [amount, setAmount] = useState(0);
    
    const cartContext = useContext(CartContext);

    useEffect(() => {
        var arr = [];

        if(product && product.image){
            const origImg = {
                original: product.image,
                thumbnail: product.image
            }
    
            arr.push(origImg);
        }

        if(product && product.otherImages instanceof Array){

            product.otherImages.forEach((img) => {
                const obj = {
                    original: img,
                    thumbnail: img
                };
                arr.push(obj);
            });

        }

        setAllImages([...arr]);

    }, [product])

    useEffect(()=>{
        if(cartContext.cart instanceof Array){
            for(var i = 0; i < cartContext.cart.length; i++){
                if(cartContext.cart[i]._id === product._id){
                    setInCart(true);
                    setAmount(cartContext.cart[i].amount);
                    break;
                }else{
                    setInCart(false);
                }
            }
        }
    }, [cartContext.cart, product]);

    const removeFromCart = event => {
        if(!(cartContext.cart instanceof Array))
            return;
    
        var newCart = cartContext.cart.filter((item) => {
            return item._id !== product._id;
        });

        cartContext.setCart(newCart);
        setInCart(false);
    }

    const addToCartClick = (product) => async event => {
        var cart = cartContext.cart instanceof Array ? [...cartContext.cart] : [];

        //check whether the item is already there in the cart before adding the new object
        
        if(prodCart < 1){
            setMessage("Please enter a value more than 0");
            return setOpenMessage(true);
        }

        if(prodCart > product.stock){
            setMessage("Please enter a value less than what is in stock");
            return setOpenMessage(true);
        }

        var prod = {...product, amount: prodCart ? Number(prodCart) : 1};

        for(var i = 0; i < cart.length ; i++){
            if(cart[i]._id === product._id){
                cart[i].amount = prodCart ? Number(prodCart) : 1;
                return cartContext.setCart(cart);
            }
        }

        cart.push(prod);
        cartContext.setCart(cart);
    }

    const setCartAmount = event => {

        if(event.target.value > 0){
            setProdCart(event.target.value);
        }else{
            // setMessage("Please enter a value more than 0");
            // return setOpenMessage(true);
            setProdCart("");

        }
    }

    const handleMsgClose = (event) => {
        setOpenMessage(false);
    }

    useEffect(() => {

        const _getProduct = async (prod, signal) => {
            try{
                const result = await getProduct(prod, signal);
                setProduct(result.product);

            }catch(e){
                console.log(e);
            }
        }

        const abortController = new AbortController();
        const signal = abortController.signal;

        _getProduct(match.params.prod, signal);
    }, [match]);

    const prodImage = <> 
    <Paper variant="outlined" className={classes.prodImagePaper}>
        <MyGallery showPlayButton={false} thumbnailPosition='right' showFullscreenButton={false} showNav items={allImages} />
    </Paper>

    <Paper className={classes.prodImagePaper}>
        <Grid container>
            <Grid item>
                <Typography>In stock:</Typography>
            </Grid>
            <Grid item>
                <Typography>{product.stock}</Typography>
            </Grid>
        </Grid>
    </Paper>
    </>

    const prodPrices = <>
        <Card variant='outlined' className={classes.infoPaper}>
            <Grid container justify='space-evenly'>
                <Grid item xs={12} className={classes.pricesFor}>
                    <Typography variant='h6'>Prices for: </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography  className={classes.infoName}>1 - {product ? product.price1 ? product.price1.lessThan - 1 : null : null}: </Typography>
                </Grid>
                <Grid item>
                    <Typography  className={classes.infoValue}>${product ? product.price1 ? product.price1.price/100 : null : null}</Typography>
                </Grid>
                <Grid xs={12} item className={classes.space}/>

                <Grid item xs={4}>
                    <Typography  className={classes.infoName}>{product ? product.price1 ? product.price1.lessThan : null : null}
                    - {product ? product.price2 ? product.price2.moreThan - 1 : null : null}: </Typography>
                </Grid>
                <Grid item>
                    <Typography  className={classes.infoValue}>${product ? product.price2 ? product.price2.price/100 : null : null}</Typography>
                </Grid>
                <Grid xs={12} item className={classes.space}/>

                <Grid item xs={4}>
                    <Typography  className={classes.infoName}>{product ? product.price2 ? product.price2.moreThan : null : null}+: </Typography>
                </Grid>
                <Grid item>
                    <Typography  className={classes.infoValue}>${product ? product.price3 ? product.price3.price/100 : null : null}</Typography>
                </Grid>
                <Grid xs={12} item className={classes.space}/>
            </Grid>
        </Card>

        {
        <Grow in={!product.stock}>
            <Card className={classes.paperOOS}>
                <Grid container alignItems="center" justify="center">
                    <Grid item>
                        <Typography variant='h6' className={classes.outOfStock}>Out of stock!</Typography>
                    </Grid>
                </Grid>
            </Card>
        </Grow>
    }

    <Grow in={inCart}>
        <Card className={classes.paperBelow}>
            <Grid container alignItems="center" justify="space-evenly">
                {/* <Grid item xs={1} /> */}
                <Grid item xs={3}>
                    <Typography variant='h6' className={classes.inCartHeading}>In Cart:</Typography>
                </Grid>

                {/* <Grid item xs={1} /> */}
                <Grid item xs={2}>
                    <Typography variant='h6' className={classes.inCartAmount}>{amount}</Typography>
                </Grid>

                {/* <Grid item xs={1} /> */}
                <Grid item>
                    <Button className={classes.removeButton} onClick={removeFromCart}>Remove</Button>
                </Grid>
            </Grid>
        </Card>
    </Grow>

    <div className={classes.addToCartDiv}>
        <Grid container justify="center" spacing={10}>
            <Grid item xs={5}>
                <TextField size="small" type="number" value={prodCart}
                inputProps={{max: product.stock, min: 1}} 
                variant="outlined" placeholder="0" onChange={setCartAmount} />
            </Grid>
            <Grid item xs={7}>
                <Button disabled={!product.stock} className={classes.cart} onClick={addToCartClick(product)}>Add to cart</Button>
            </Grid>
        </Grid>
    </div>
    </>

    return <> 
    <Snackbar open={openMessage} autoHideDuration={4000} onClose={handleMsgClose}>
        <Alert onClose={handleMsgClose} severity="error">
            {message}
        </Alert>
    </Snackbar>

    <Grid container justify='space-evenly'>
        <Grid item className={classes.productGrid}>
            <Typography className={classes.productHeader}>Product {product.name}</Typography>
        </Grid>
        <Grid item xs={10} />
        <Grid item xs={12} />

        <Grid item xs={10} md={6} lg={4}>
            {product ? product.image ? prodImage : null : null}
        </Grid>

        <Grid item xs={10} md={6} lg={4}>
            {product ? product.price1 ? prodPrices : null : null}
        </Grid>
        <Grid item xs={12} />

        <Grid item xs={10}>
            <Card style={{marginTop: '5%', marginBottom: '5%', padding: '5%'}} variant='outlined'>
                <Grid container justify='space-evenly'>
                    <Grid item xs={12}>
                        <Typography variant='h6' className={classes.descName}>{product.name}</Typography>
                    </Grid>

                    <Grid item style={{marginTop: '5%'}}>
                        <Typography className={classes.description}>
                            {product.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: '5%'}} />

                    {
                        product && product.variables && product.variables.length > 0 ? product.variables.map((prod) => {
                            return <Grid container spacing={3}>
                            <Grid item>
                                <Typography className={classes.varParameter}>{prod.parameter}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className={classes.varValue}>{prod.value}</Typography>
                            </Grid>
                            </Grid>
                        }) : undefined
                    }

                    <Grid item xs={12} />

                    {
                        product && product.downloads && product.downloads.length > 0 ? product.downloads.map((down) => {
                            return <Grid container spacing={3}>
                            <Grid item>
                                <Typography className={classes.varParameter}>{down.name}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography component={Link}
                                href={down.link} className={classes.varValue}>
                                    Link
                                </Typography>
                            </Grid>
                            </Grid>
                        }) : undefined
                    }
                </Grid>
            </Card>
        </Grid>
    </Grid>
    </>
}