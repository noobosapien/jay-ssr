import React, { useState, useEffect, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { v4 as uuidv4 } from 'uuid';
import {
    getCategories, 
    addCategory,
    removeCategory
} from '../api-admin';
import Popup from './Popup';

const useStyles = makeStyles(theme => ({
    radio: {
        marginLeft: '5%'
    },
    head: {
        marginTop: '4%'
    }
}));


function Category(user, shop, category, setCategory){
    const classes = useStyles();
    const [editCategory, setEditCategory] = useState(false);

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [refresh, setRefresh] = useState(0);

    const [openPopup, setOpenPopup] = useState(false);
    const [acceptCall, setAcceptCall] = useState(()=>{});
    const [declineCall, setDeclineCall] = useState(()=>{});

    const addCat = async (event) => {
        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            const cat = await addCategory(user, name, shop, signal);
            setEditCategory(false);
        }catch(e){
            console.log(e);
        }
    }
    
    const removeCat = async event => {
        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            if(user.user){
                await removeCategory(user, category, signal);
            }

            setRefresh(refresh + 1);

        }catch(e){
            console.log(e);
        }
    }

    const setPopup = () => {
        setOpenPopup(true);
        setAcceptCall(() => () => {removeCat(); setOpenPopup(false)});
        setDeclineCall(() => () => {setOpenPopup(false)});
    }

    //ask the api for all the categeries with their id and store in categories state
    useEffect(()=>{
        async function setCat(signal){
            try{
                if(user.user){
                    const result = await getCategories(user, shop, signal);
                    setCategories(result.categories);
                }
                
            }catch(e){
                console.log(e);
            }
            
        }
        const abortController = new AbortController();
        const signal = abortController.signal;

        setCat(signal);

    }, [user, shop, editCategory, refresh]);

    useEffect(()=>{
        if(categories && categories.length !== 0){
            // console.log(shops[0].name);
            setCategory(categories[0]._id);
        }else{
            setCategory(null);
        }
    }, [categories]);

    const showCategory = <FormControl component="fieldset" className={classes.head}>
        <FormLabel component="legend">Category</FormLabel>
        <RadioGroup row aria-label="Category" name="Categories" value={category}>
            {
                categories instanceof Array ? categories.map((cat) => {
                    return <FormControlLabel  className={classes.radio}
                    key={uuidv4()} 
                    value={cat._id} 
                    control={<Radio />} 
                    onChange={e=>{setCategory(cat._id)}} 
                    label={cat.name}/>
                }) : undefined
            }
        </RadioGroup>
        
        <Grid container>
            <Grid xs={3} />
            <Grid item xs={3}>
                <Button variant='contained' color='primary' onClick={e=>{setEditCategory(true)}}>Add Category</Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant='contained' color='primary' onClick={setPopup}>Remove Category</Button>
            </Grid>
            <Grid xs={3} />
        </Grid>
    </FormControl>

    const categoryAdd = <Grow in>
        <Paper>
            <Typography variant='h6'>Categories</Typography>
            <Grid container>
                <Grid item xs={12}>
                    <Typography>Name</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField onChange={e=>setName(e.target.value)} />
                </Grid>
                <Grid />
                <Grid item xs={2}>
                    <Button variant='contained' color='primary' onClick={addCat}>Add</Button>
                </Grid>
                <Grid item xs={2}>
                    <Button variant='contained' color='primary' onClick={e=>{setEditCategory(false)}}>Close</Button>
                </Grid>
            </Grid>
        </Paper>
    </Grow>

    return <>
        <Popup open={openPopup} name="Category" accept={acceptCall} decline={declineCall}/>
        {editCategory ? categoryAdd : showCategory} 
    </>
}

export default Category;