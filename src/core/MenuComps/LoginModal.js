import React, {useState, useContext, useRef} from 'react';
import { makeStyles } from '@material-ui/styles';
import { UserContext } from '../../App';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Cancel from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DoubleArrow from '@material-ui/icons/DoubleArrow';
import Assignment from '@material-ui/icons/Assignment';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Collapse from '@material-ui/core/Collapse';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

import PWSI from '../../user/PWSI';

import {registerUser} from '../api-core';
import {signin} from '../../auth/api-auth';
import auth from '../../auth/auth-helper';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
    mainCard: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '350px'
    }
}));

export default function LoginModal(props){
    const classes = useStyles();
    const {openModal, setOpenModal, closable} = props;

    const userContext = useContext(UserContext);

    const [registerState, setRegisterState] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isValid, setIsValid] = useState(false);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confPasswordError, setConfPasswordError] = useState(false);

    const [message, setMessage] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const closeClicked = e => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setIsValid(false);
        setOpenModal(false);
    }

    const onRegisterClick = e => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setIsValid(false);
        setEmailError(false);
        setPasswordError(false);

        emailRef.current.value = "";
        passwordRef.current.value = "";

        setRegisterState(true);
    }

    const onPasswordChange = e => {
        setPassword(e.target.value);
    }

    const backToLogin = e => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setIsValid(false);
        setEmailError(false);
        setPasswordError(false);
        setFirstNameError(false);
        setLastNameError(false);
        setConfPasswordError(false);

        emailRef.current.value = "";
        passwordRef.current.value = "";

        setRegisterState(false);
    }

    const registerDone = async e => {
        try{
            firstNameRef.current.value === "" ? setFirstNameError(true) : setFirstNameError(false);
            lastNameRef.current.value === "" ? setLastNameError(true) : setLastNameError(false);
            emailRef.current.value === "" ? setEmailError(true) : setEmailError(false);
            passwordRef.current.value === "" ? setPasswordError(true) : setPasswordError(false);
            confirmPasswordRef.current.value === "" ? setConfPasswordError(true) : setConfPasswordError(false);
    
            if(firstNameRef.current.value === "" ||
            lastNameRef.current.value === "" || 
            emailRef.current.value === "" ||
            passwordRef.current.value === "" ||
            confirmPasswordRef.current.value === ""){
                setMessage("Please complete all the fields.");
                return setOpenMessage(true);
            }
    
            if(!isValid){
                setPasswordError(true);
                setMessage("Please enter a valid password.");
                return setOpenMessage(true);
            }else{
                setPasswordError(false);
            }
    
            if(passwordRef.current.value !== confirmPasswordRef.current.value){
                setPasswordError(true);
                setConfPasswordError(true);
                setMessage("Passwords do not match");
                return setOpenMessage(true);
            }else{
                setPasswordError(false);
                setConfPasswordError(false);
            }

            if(!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.exec(email)){
                setMessage("Please enter a valid email");
                setOpenMessage(true);
                setEmailError(true);
                return;
            }
    
            setLoading(true);
            const user = {
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value
            };
    
            const abortController = new AbortController();
            const signal = abortController.signal;
            const result = await registerUser(user, signal);
            setLoading(false);
    
            if(result && result.error){
                setMessage("Email already exists please try logging in!");
                setOpenMessage(true);
                setEmailError(true);
                return;
            }
    
            const signedUser = await signin({email, password});
    
            auth.authenticate(signedUser)
            userContext.setUser(auth.isAuthenticated());
        }catch(e){
            console.log(e);
        }
        
    }

    const signinUser = async e => {
        try{
            if(email === "" || password === ""){
                setMessage("Please complete the fields email and password");
                setEmailError(true);
                setPasswordError(true);
                return setOpenMessage(true);
            }
            setLoading(true);
            const signedUser = await signin({email, password});
            setLoading(false);
    
            if(signedUser && signedUser.error){
                setMessage("Email and password do not match");
                setEmailError(true);
                setPasswordError(true);
                return setOpenMessage(true);
            }
    
            auth.authenticate(signedUser)
            userContext.setUser(auth.isAuthenticated());
        }catch(e){
            console.log(e);
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
        <Modal open={openModal}>
            <Card className={classes.mainCard}>
                <Grid container justify='center'>
                    
                {
                    closable ? <>
                    <Grid item xs={10} />
                    <Grid item xs={2}> 
                        <IconButton onClick={closeClicked}>
                            <Cancel />
                        </IconButton>
                    </Grid>
                    </> : <Typography>Please Login/Register to continue</Typography>

                }

                {
                    registerState ? <> 
                    <Grid item xs={6}>
                        <Button onClick={backToLogin} startIcon={<ArrowBack />}>Back to login</Button>
                    </Grid>
                    <Grid item xs={6} />
                    </> : undefined
                }
                

                <Grid item xs={12} />
                <Grid item>
                    {
                        registerState ? 
                        <Typography variant='h5'>Register</Typography> :
                        <Typography variant='h5'>Login</Typography>
                    }
                    
                </Grid>
                <Grid item xs={12} />

                {
                    registerState ? <>
                    <Grid item xs={3}>
                        <Typography>First Name: </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField 
                        inputRef={firstNameRef}
                        error={firstNameError} 
                        onChange={e=>setFirstName(e.target.value)}
                        fullWidth 
                        size='small' 
                        variant='outlined'/>
                    </Grid>
                    <Grid item xs={12} />

                    <Grid item xs={3}>
                        <Typography>Last Name: </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                        inputRef={lastNameRef}
                        error={lastNameError}
                        onChange={e=>setLastName(e.target.value)}
                        fullWidth 
                        size='small' 
                        variant='outlined'/>
                    </Grid>
                    <Grid item xs={12} />
                    </> : undefined
                }
                
                
                <Grid item xs={3}>
                    <Typography type='email'>Email: </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField 
                    inputRef={emailRef}
                    error={emailError} 
                    onChange={e=>setEmail(e.target.value)}
                    fullWidth 
                    size='small' 
                    variant='outlined'/>
                </Grid>
                <Grid item xs={12} />

                <Grid item xs={3}>
                    <Typography>Password: </Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                    inputRef={passwordRef}
                    error={passwordError} 
                    onChange={onPasswordChange} 
                    fullWidth 
                    type='password' 
                    size='small' 
                    variant='outlined'/>
                </Grid>
                <Grid item xs={10}>
                    <Collapse in={registerState}>
                        <PWSI setIsValid={setIsValid} password={password}/>
                    </Collapse>
                </Grid>
                <Grid item xs={12} />

                {
                    registerState ? <>
                    <Grid item xs={3}>
                        <Typography>Confirm Password: </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField 
                        inputRef={confirmPasswordRef}
                        error={confPasswordError} 
                        onChange={e=>setConfirmPassword(e.target.value)}
                        fullWidth 
                        type='password' 
                        size='small' 
                        variant='outlined'/>
                    </Grid>
                    <Grid item xs={12} />
                    </> : undefined
                }
                
                {
                    registerState ? <>
                    {
                        loading ? <CircularProgress color='primary' /> :
                        <Grid item>
                            <Button onClick={registerDone} startIcon={<CheckCircleOutline />}>Done</Button>
                        </Grid>
                    }
                    
                    </> : <> 
                    {
                        loading ? <CircularProgress color='primary' /> : <>
                        <Grid item>
                            <Button endIcon={<DoubleArrow />} onClick={signinUser}>Signin</Button>
                        </Grid>

                        <Grid item>
                            <Button endIcon={<Assignment />} onClick={onRegisterClick}>Register</Button>
                        </Grid>
                    </>
                    }
                    </>
                }

                </Grid>
            </Card>
        </Modal>
    </>
}