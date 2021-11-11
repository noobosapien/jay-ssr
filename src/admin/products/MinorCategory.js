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
    getMinorCategories, 
    addMinorCategory, 
    removeMinorCategory,
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

function MinorCategory(user, category, minorCategory, setMinorCategory){
    const classes = useStyles();

    const [editMinCategory, setEditMinCategory] = useState(false);

    const [minorCategories, setMinorCategories] = useState([]);
    const [name, setName] = useState("");
    const [refresh, setRefresh] = useState(0);

    const [openPopup, setOpenPopup] = useState(false);
    const [acceptCall, setAcceptCall] = useState(()=>{});
    const [declineCall, setDeclineCall] = useState(()=>{});

    const addMinCat = async (event) => {
        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            const cat = await addMinorCategory(user, name, category, signal);
            setEditMinCategory(false);
        }catch(e){
            console.log(e);
        }
    }

    const removeMinCat = async event => {
        try{
            const abortController = new AbortController();
            const signal = abortController.signal;

            if(user.user){
                const result = await removeMinorCategory(user, minorCategory, signal);
                console.log(result);
            }

            //after removing the minor category close the popup
            setRefresh(refresh + 1);

        }catch(e){

        }
    }

    const setPopup = () => {
        setOpenPopup(true);
        setAcceptCall(() => () => {removeMinCat(); setOpenPopup(false)});
        setDeclineCall(() => () => {setOpenPopup(false)});
    }

    //ask the api for all the categeries with their id and store in categories state
    useEffect(()=>{
        async function setMinCat(signal){
            try{
                if(user.user){
                    const result = await getMinorCategories(user, category, signal);
                    setMinorCategories(result.minorCategories);
                }
                
            }catch(e){
                console.log(e);
            }
            
        }
        const abortController = new AbortController();
        const signal = abortController.signal;

        setMinCat(signal);

    }, [user, category, editMinCategory, refresh]);
    

    useEffect(()=>{
        if(minorCategories && minorCategories.length !== 0){
            setMinorCategory(minorCategories[0]._id);
        }else{
            setMinorCategory(null);
        }
    }, [minorCategories]);

    const showMinCategory = <FormControl component="fieldset" className={classes.head}>
        <FormLabel component="legend">Minor Category</FormLabel>
        <RadioGroup row aria-label="Minor Category" name="Minor Categories" value={minorCategory}>
        {
                minorCategories instanceof Array ? minorCategories.map((minCat) => {
                    return <FormControlLabel className={classes.radio}
                    key={uuidv4()} 
                    value={minCat._id} 
                    control={<Radio />} 
                    onChange={e=>{setMinorCategory(minCat._id)}} 
                    label={minCat.name}/>
                }) : undefined
        }
        </RadioGroup>
        
        <Grid container>
            <Grid xs={3} />
            <Grid item xs={3}>
                <Button variant='contained' color='primary' onClick={e=>{setEditMinCategory(true)}}>Add Minor Category</Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant='contained' color='primary' onClick={setPopup}>Remove Minor Category</Button>
            </Grid>
            <Grid xs={3} />
        </Grid>
    </FormControl>

    const addMinCategory = <Grow in>
        <Paper className={classes.head}>
            <Typography variant='h6'>Minor Categories</Typography>
            <Grid container>
                <Grid item xs={12}>
                    <Typography>Name</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField onChange={e=>{setName(e.target.value)}} />
                </Grid>
                <Grid />
                <Grid item xs={2}>
                    <Button variant='contained' color='primary' onClick={addMinCat}>Add</Button>
                </Grid>
                <Grid item xs={2}>
                    <Button variant='contained' color='primary' onClick={e=>{setEditMinCategory(false)}}>Close</Button>
                </Grid>
            </Grid>
        </Paper>
    </Grow>
    return <>
        <Popup open={openPopup} name="Minor Category" accept={acceptCall} decline={declineCall}/>
        {editMinCategory ? addMinCategory : showMinCategory}
    </>
}

export default MinorCategory;