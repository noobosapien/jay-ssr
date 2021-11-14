import React, {useState, useEffect, useMemo, useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { CartContext } from '../App';

import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ArrowForward from '@material-ui/icons/ArrowForward';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    cardBG: {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.gray,
        color: theme.palette.primary.purple,
        boxShadow: "none"
    },
    card: {
        maxWidth: 1400,
        marginLeft: '20%',
        marginTop: theme.spacing(5),
        alignItems: 'center'
    },
    items: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        minHeight: '50em'
      },
    paperFront: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.gray,
        position: 'relative',
        marginLeft: '12%',
        marginRight: '12%',
        marginTop: '20%',
        // width: theme.spacing(32),
        minWidth: '280px',
        maxWidth: '280px',
        // height: theme.spacing(76),
        zIndex: 4,
        // "box-shadow": "2px 2px 20px 1px #007d93ff, -3px -3px 1px #4e0166"
        '&:hover, &$focusVisible': {
            "box-shadow": "2px 2px 20px 1px #007d93ff, -3px -3px 1px #4e0166"
        }
      },
    paperBelow: {
        position: 'relative',
        marginLeft: '12%',
        marginRight: '12%',
        paddingTop: '5%',
        height: '50px',
        minWidth: '270px',
        maxWidth: '270px',
        background: theme.palette.common.black,
        border: 'thick double #ff6f00',
        color: theme.palette.common.white
        // background: 'linear-gradient(90deg, rgba(38,124,0,1) 15%, rgba(21,175,59,1) 53%, rgba(0,255,55,1) 86%)'
    },
    minCatChip: {
        backgroundColor: theme.palette.common.gray,
        color: theme.palette.common.white,
        position: 'absolute'
    },
    resVals: {
        backgroundColor: theme.palette.common.white,
        borderColor: theme.palette.common.white,
        color: theme.palette.common.gray
    },
    addToCart: {
        marginTop: '10%',
        marginBottom: '10%',
        // background: '#ffffcc'
    },
    cardImage: {
        // "box-shadow": "2px 2px 10px 1px #ff6f00, -3px -3px 1px #fc031c",
        width: 275,
        height: 275,
    },
    cart: {
        color: theme.palette.common.blue,
        // borderColor: theme.palette.common.orange,
        // background: 'rgb(63,60,78)',
        // background: 'linear-gradient(90deg, rgba(63,60,78,1) 14%, rgba(57,74,83,1) 84%)',
    },
    disabledButton: {
        // background: 'linear-gradient(90deg, rgba(63,60,78,1) 14%, rgba(57,74,83,1) 84%)',
        color: theme.palette.common.red,
    },
    name: {
        // fontFamily: 'Lexend Exa',
        margin: '10px 10px 10px 10px',
        textDecoration: 'none !important',
        color: theme.palette.common.gray
    },
    moreInfoGrid: {
        marginTop: '20px'
    },
    moreInfo: {
        color: '#581b7d'
    },
    moreInfoLink: {
        textDecoration: 'none !important'
    },
    removeButton: {
        background: 'rgb(63,60,78)',
        color: 'white',
        // marginTop: '20%'
    },
    inCartHeading: {
        // fontFamily: 'Lexend Exa',
        fontSize: '0.8em',
        // marginTop: '10%'
    },
    inCartAmount: {
        // fontFamily: 'Lexend Exa',
        // marginTop: '10%'
    },
    watermark: {
        opacity: '0.2',
    },
    watermarkText: {
        position: 'absolute',
        color: theme.palette.common.red,
        transform: 'rotate(45deg)',
        top: '15%',
        left: '15%',
        fontSize: '2rem'
    }
}));

export default function ProductCard(props){
    const classes = useStyles();
    const {minCatNames, item} = props;
    const [inCart, setInCart] = useState(false);
    const [amount, setAmount] = useState(0);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState("");

    const inputRef = useRef(null);

    const cartContext = useContext(CartContext);

    useEffect(()=>{
        if(cartContext.cart instanceof Array){
            for(var i = 0; i < cartContext.cart.length; i++){
                if(cartContext.cart[i]._id === item._id){
                    setInCart(true);
                    setAmount(cartContext.cart[i].amount);
                    break;
                }else{
                    setInCart(false);
                }
            }
        }
    }, [cartContext.cart]);

    const addToCartClick = (product) => async event => {
        var cart = cartContext.cart instanceof Array ? [...cartContext.cart] : [];

        //check whether the item is already there in the cart before adding the new object
        const value = inputRef.current ? inputRef.current.value : 1;

        if(value < 1){
            setMessage("Please enter a value more than 0");
            return setOpenMessage(true);
        }

        if(value > product.stock){
            setMessage("Please enter a value less than what is in stock");
            return setOpenMessage(true);
        }
        
        var prod = {...product, amount: value ? Number(value) : 1};

        for(var i = 0; i < cart.length ; i++){
            if(cart[i]._id === product._id){
                cart[i].amount = value ? Number(value) : 1;
                return cartContext.setCart(cart);
            }
        }

        cart.push(prod);
        cartContext.setCart(cart);
    }

    const removeFromCart = event => {
        if(!(cartContext.cart instanceof Array))
            return;
    
        var newCart = cartContext.cart.filter((product) => {
            return item._id !== product._id;
        });

        cartContext.setCart(newCart);
        setInCart(false);
    }

    const handleMsgClose = (event) => {
        setOpenMessage(false);
    }

    return<>
    <Snackbar open={openMessage} autoHideDuration={4000} onClose={handleMsgClose}>
        <Alert onClose={handleMsgClose} severity="error">
        {message}
        </Alert>
    </Snackbar>
    <Grid container item spacing={0} xs={12} sm={6} lg={4} xl={3} key={(uuidv4())}>
        <Grid item xs={12}>
        <Card className={classes.paperFront} elevation={3} >
            <Grid container justify="center" alignItems="baseline" direction="column">
                <Grid item>
                    <Chip size="small" className={classes.minCatChip} 
                    label={minCatNames.filter((mcn) => {
                        return item.minorCat === mcn._id;
                    }).length > 0 ? minCatNames.filter((mcn) => {
                        return item.minorCat === mcn._id;
                    })[0].name : "" }
                    />
                </Grid>
                <Grid item xs={12}>
                    {
                        item.stock > 0 ?
                        <img className={classes.cardImage} alt={item.name} src={item.image}/> :
                        <div className={classes.watermark}>
                            <h3 className={classes.watermarkText}>Out of stock!</h3>
                            <img className={classes.cardImage} alt={item.name} src={item.image}/>
                        </div>
                    }
                </Grid>
                <Grid item xs={12} />

                <Grid item xs={1} />
                <Grid item xs={10}>
                    <Typography component={Link} to={`/prod/${item._id}`} variant="h6" className={classes.name}>
                        {item.name}
                    </Typography>
                </Grid>
                <Grid item xs={1} />

                <Grid item xs={12}>
                    <Box border={1} borderRadius={16} className={classes.resVals}>
                        <List >
                            <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="h6">Price: </Typography>
                                </Grid>
                                <Grid item xs={1} />
                                <Grid item xs={4}>
                                    <Typography variant="h6">${item.price1.price/100}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="h6">Stock: </Typography>
                                </Grid>
                                <Grid item xs={1} />
                                <Grid item xs={4}>
                                    <Typography variant="h6">{item.stock}</Typography>
                                </Grid>

                                <Grid xs={4}/>
                                <Grid className={classes.moreInfoGrid} item xs={8}>
                                    <Link className={classes.moreInfoLink} to={`/prod/${item._id}`}>
                                    <Button className={classes.moreInfoLink} endIcon={<ArrowForwardIcon />} >
                                        More info
                                    </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
                <Grid container item className={classes.addToCart} xs={12}>
                    <Grid item xs={1} />
                    <Grid item xs={3}>
                        <TextField 
                        inputRef={inputRef}
                        size="small" type="number" 
                        inputProps={{min: 1, max: item.stock}} 
                        variant="outlined" placeholder="Qty" />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <Button classes={{disabled: classes.disabledButton}}
                        variant='outlined' disabled={!item.stock} className={classes.cart} onClick={addToCartClick(item)}>
                            Add to cart
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
        </Grid>
        <Grid item xs={12}>
            <Grow in={inCart}>
            <Card className={classes.paperBelow}>
                <Grid container alignItems="center" justifyContent="space-around">
                    {/* <Grid item xs={1} /> */}
                    <Grid item>
                        <Typography className={classes.inCartHeading}>In Cart:</Typography>
                    </Grid>

                    {/* <Grid item xs={1} /> */}
                    <Grid item>
                        <Typography className={classes.inCartAmount}>{amount}</Typography>
                    </Grid>

                    {/* <Grid item xs={1} /> */}
                    <Grid item>
                        <Button className={classes.removeButton} onClick={removeFromCart}>Remove</Button>
                    </Grid>
                </Grid>
            </Card>
            </Grow>
        </Grid>
    </Grid>
    </>
}