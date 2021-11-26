import React, { useRef, useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from "react-router-dom";
import { getFPValid, sendNewPassword } from './api-core';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Collapse from '@material-ui/core/Collapse';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import PWSI from '../user/PWSI';
import { UserContext } from '../App';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    mainCard: {
        marginTop: '10%',
        marginBottom: '10%',
        marginLeft: '10%',
        marginRight: '10%',
        paddingTop: '5%',
        paddingBottom: '5%',
    },
    space1: {
        marginBottom: '5%'
    },
    space2: {
        marginBottom: '8%'
    }
}));

export default function ForgotPW(props){
    const classes = useStyles();

    const userContext = useContext(UserContext);
    const history = useHistory();

    const { fp } = useParams();

    const [code, setCode] = useState(null);
    const [passwordError, setPasswordError] = useState(false);
    const [loading, setLoading] = useState(true);
    // const [valid, setValid] = useState(true);
    const [valid, setValid] = useState(false);
    const [complete, setComplete] = useState(false);
    const [PWValid, setPWValid] = useState(false);
    const [password, setPassword] = useState('');
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');

    const passwordRef = useRef(null);
    const retypeRef = useRef(null);

    useEffect(() => {
        if(userContext.user){
            history.push('/');
        }
    }, [userContext]);

    useEffect(() => {
        const getValid = async () => {
            try{
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                setLoading(true);
                const result = await getFPValid(fp, signal);
                setLoading(false);

                if(result && result.isValid){
                    setCode(result.code);
                    setValid(true);
                }else{
                    setValid(false);
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
                return;
            }

            if(!PWValid){
                setMessage('Please enter a valid password.');
                setOpenMessage(true);
                return setPasswordError(true);
            }else{
                setPasswordError(false);
            }

            if(passwordRef.current.value !== retypeRef.current.value){
                setMessage('Both the passwords should be equal.');
                setOpenMessage(true);
                return setPasswordError(true);
            }else{
                setPasswordError(false);
            }

            const abortController = new AbortController();
            const signal = abortController.signal;

            const result = await sendNewPassword(code, passwordRef.current.value, retypeRef.current.value, signal);
            if(result.done){
                setComplete(true);
            }
        }catch(e){

        }
        
    }

    const handleMsgClose = e => {
        setOpenMessage(false);
    }

    return <>
    <Snackbar open={openMessage} autoHideDuration={3000} onClose={handleMsgClose}>
        <Alert onClose={handleMsgClose} severity="warning">
            {message}
        </Alert>
    </Snackbar>
    {
        loading ? <>
            <Skeleton />
        </> : 
        complete ? <>
        <Card className={classes.mainCard} variant='outlined'>
            <Grid container justifyContent='center'>
                <Grid item>
                    <Typography variant='h4'>Password changed succesfully, please try logging in again.</Typography>
                </Grid>
            </Grid>
        </Card>
        </> :
        valid ? 
        <>
        <Card className={classes.mainCard} variant='outlined'>
            <Grid container justify='center'>
                <Grid item xs={4}>
                    <TextField type='password' error={passwordError} fullWidth onChange={
                        e => setPassword(e.target.value)
                    } variant='outlined' inputRef={passwordRef} placeholder='Password' />
                </Grid>
                <Grid item xs={12} className={classes.space1} />
                <Grid item> 
                <Collapse in>
                        <PWSI setIsValid={setPWValid} password={password}/>
                </Collapse>
                </Grid>
                <Grid item xs={12}  className={classes.space2} />
                <Grid item xs={4}>
                    <TextField 
                    error={passwordError} 
                    fullWidth 
                    variant='outlined' 
                    inputRef={retypeRef} 
                    placeholder='Retype Password' 
                    type='password'
                    />
                </Grid>
                <Grid item xs={12}  className={classes.space1} />
                <Grid item>
                    <Button color='primary' variant='outlined' className={classes.button} onClick={confirmPassword}> 
                        Confirm 
                    </Button>
                </Grid>
            </Grid>
        </Card>
        </> :
        <>
        <Card className={classes.mainCard} variant='outlined'>
            <Grid container justifyContent='center'>
                <Grid item>
                    <Typography variant='h4'>Please get another code to change the password.</Typography>
                </Grid>
            </Grid>
        </Card>
        </>
    }
    </>
}