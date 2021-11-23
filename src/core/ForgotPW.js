import React, { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { getFPValid, sendNewPassword } from './api-core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    mainCard: {
        marginTop: '10%'
    }
}));

export default function ForgotPW(props){
    const classes = useStyles();

    const { fp } = useParams();

    const [code, setCode] = useState(null);
    const [passwordError, setPasswordError] = useState(false);

    const passwordRef = useRef(null);
    const retypeRef = useRef(null);

    useEffect(() => {
        const getValid = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                const result = await getFPValid(fp, signal);
                console.log("FPW 14:", result);
    
                if(result && result.isValid){
                    setCode(result.code);
                }
            }catch(e){

            }
        }

        getValid();
    }, [fp]);

    const confirmPassword = async e => {

        try{
            if(!code)
                return;
            if(!passwordRef.current || !retypeRef.current){
                return console.log("FPW 47:");
            }

            if(passwordRef.current.value !== retypeRef.current.value){
                console.log("FPW 51:");
                return setPasswordError(true);
            }

            const abortController = new AbortController();
            const signal = abortController.signal;

            const result = await sendNewPassword(code, passwordRef.current.value, retypeRef.current.value, signal);
            console.log("FPW 58:", result);
        }catch(e){

        }
        
    }

    return <>
    <Card className={classes.mainCard}>
        <Grid container justify='center'>
            <Grid item>
                <TextField variant='outlined' inputRef={passwordRef} placeholder='Password' />
            </Grid>
            <Grid item xs={12} />
            <Grid item>
                <TextField variant='outlined' inputRef={retypeRef} placeholder='Retype Password' />
            </Grid>
            <Grid item xs={12} />
            <Grid item>
                <Button onClick={confirmPassword}> Confirm </Button>
            </Grid>
        </Grid>
    </Card></>
}