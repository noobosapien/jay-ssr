import React from 'react';
import {useState, useEffect, useContext} from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import TextField from '@material-ui/core/TextField';
import {isEmail} from './user-helper';
import Grow from '@material-ui/core/Grow';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import PWSI from './PWSI.js';

import { UserContext } from '../App';
import { read, update } from './api-user';
import { signin } from '../auth/api-auth';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
    heading: {
        paddingLeft: '5%',
        paddingTop: '2%',
        paddingBottom: '5%'
    },
    mainCard: {
        [theme.breakpoints.down('xs')]: {
            marginTop: '20%'
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: '10%'
        },
        [theme.breakpoints.down('xl')]: {
            marginTop: '5%'
        }
    },
    profile: {
        // paddingLeft: '35%',
        paddingBottom: '5%'
    },
    profileItem: {
        paddingTop: '4%',
    },
    passwordForm: {
        paddingBottom: '10%',
        margin: '10%',
        borderColor: theme.palette.common.purple,
        [theme.breakpoints.down('sm')]: {
            margin: '0'
        }
    },
    passwordGridItem: {
        paddingRight: '10%',
        paddingBottom: '10%'
    },
    passwordGridText: {
        paddingBottom: '10%',
        paddingLeft: '10%'
    },
    passwordIndicator: {
        marginTop: '2%',
        paddingBottom: '10%',
    },
    addresses: {
        // marginLeft: '20%'
    },
    address: {
        padding: '5%',
        minWidth: '20rem'
    },
    addressItem: {
        marginBottom: '5%',
    },
    justifyBetween: {
        gap: 1
    },
    section: {
        marginTop: '4%',
        marginBottom: '2%'
    },
    changePassword: {
        marginBottom: '4%',
        marginLeft: '4%'
    },
    triangle: {
        width: 0,
        height: 0,
        borderRight: '100px solid transparent',
        borderTop: `50px solid ${theme.palette.common.blue}`,
        marginBottom: '5%'
    }
}));


export default function Profile(props){
    const classes = useStyles();
    const userContext = useContext(UserContext);

    const [message, setMessage] = useState("");
    const [openMessage, setOpenMessage] = useState(false);

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////             Email          //////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    const [email, setEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [editEmail, setEditEmail] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailHelperText, setEmailHelperText] = useState("");

    const handleEmailChange = (event) => {
        if(!isEmail(event.target.value)){
            setEmailError(true);
            setEmailHelperText("Please enter a valid email");
        }else{
            setEmailError(false);
            setEmailHelperText("");
        }
        setNewEmail(event.target.value);
    }

    const handleEmailSave = async (event) => {
        if(userContext.user){
            const abortController = new AbortController();
            const signal = abortController.signal;

            setEmailLoading(true);
            const result = await update({user: userContext.user}, {email: newEmail}, signal);
            setEmailLoading(false);
            console.log('Profile 108: ', result);
            if(result && result.error === false){
                setEmail(newEmail);
            }else{
                setMessage("This email cannot be used");
                setOpenMessage(true);
            }

        }
        
        setEditEmail(false);
    }

    const emailTyp = <Typography>{email}</Typography>
    const emailSelect = <TextField 
                            type="email" 
                            error={emailError} 
                            helperText={emailHelperText} 
                            value={newEmail} 
                            onChange={handleEmailChange} />
    const emailEdit = <Button onClick={()=>{setEditEmail(true)}} size="small" variant="outlined">Edit</Button>
    const emailSave = <>
    {
        emailLoading ? <> <CircularProgress /> </> : <>
        <IconButton 
            onClick={handleEmailSave} 
            size="small" 
            variant="outlined" 
            disabled={(emailError) || (newEmail===email)  || newEmail===""} 
            color="primary">
                <DoneIcon/>
        </IconButton>
        <IconButton 
            onClick={() => {setNewEmail(email); setEditEmail(false);}} 
            size="small" 
            variant="outlined" 
            color="secondary">
                <ClearRoundedIcon/>
        </IconButton>
        </>
    }
    </>

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////             First name           /////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    const [FName, setFName] = useState("");
    const [newFName, setNewFName] = useState("");
    const [editFName, setEditFName] = useState(false);
    const [FNameLoading, setFNameLoading] = useState(false);

    const handleFNameChange = (event) => {
        setNewFName(event.target.value);
    }

    const handleFNameSave = async (event) => {
        if(userContext.user){
            const abortController = new AbortController();
            const signal = abortController.signal;

            setFNameLoading(true);
            const result = await update({user: userContext.user}, {firstName: newFName}, signal);
            setFNameLoading(false);

            if(result && result.error === false){
                setFName(newFName);
            }

        }

        setEditFName(false);

    }

    const FNameTyp = <Typography>{FName}</Typography>
    const FNameSelect = <TextField value={newFName} onChange={handleFNameChange}/>
    const FNameEdit = <Button onClick={()=>{setEditFName(true)}} size="small" variant="outlined">Edit</Button>
    const FNameSave = <>
    {
        FNameLoading ? <> <CircularProgress /> </> : <> 
        <IconButton 
            onClick={handleFNameSave} 
            size="small" 
            variant="outlined" 
            disabled={newFName===FName || newFName===""} 
            color="primary">
                <DoneIcon/>
        </IconButton>
        <IconButton 
            onClick={() => {setNewFName(FName); setEditFName(false);}} 
            size="small" 
            variant="outlined" 
            color="secondary">
                <ClearRoundedIcon/>
        </IconButton>
        </>
    }
        
    </>


    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////             Last name           /////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    const [LName, setLName] = useState("");
    const [newLName, setNewLName] = useState("");
    const [editLName, setEditLName] = useState(false);
    const [LNameLoading, setLNameLoading] = useState(false);

    const handleLNameChange = (event) => {
        setNewLName(event.target.value);
    }

    const handleLNameSave = async (event) => {
        if(userContext.user){
            const abortController = new AbortController();
            const signal = abortController.signal;

            setLNameLoading(true);
            const result = await update({user: userContext.user}, {lastName: newLName}, signal);
            setLNameLoading(false);

            if(result && result.error === false){
                setLName(newLName);
            }
        }

        setEditLName(false);
    }

    const LNameTyp = <Typography>{LName}</Typography>
    const LNameSelect = <TextField value={newLName} onChange={handleLNameChange}/>
    const LNameEdit = <Button onClick={()=>{setEditLName(true)}} size="small" variant="outlined">Edit</Button>
    const LNameSave = <>
    {
        LNameLoading ? <><CircularProgress /></> : <> 
        <IconButton 
            onClick={handleLNameSave} 
            size="small" 
            variant="outlined" 
            disabled={newLName===LName || newLName===""} 
            color="primary">
                <DoneIcon/>
        </IconButton>
        <IconButton 
            onClick={() => {setNewLName(LName); setEditLName(false);}} 
            size="small" 
            variant="outlined" 
            color="secondary">
                <ClearRoundedIcon/>
        </IconButton>
        </>
    }
        
    </>

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////             Password           ///////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showPWSI, setShowPWSI] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(true);
    const [isValid, setIsValid] = useState(true);
    const [loadingPassword, setLoadingPassword] = useState(false);
    
    const handleOldPasswordChanged = (event) => {
        setOldPassword(event.target.value);
    }

    const handleNewPasswordChanged = (event) => {
        setNewPassword(event.target.value);
    }

    const handleRetypedPasswordChanged = (event) => {
        setRetypedPassword(event.target.value);
    }

    const cancelPasswordReset = () => {
        setShowPasswordForm(false);
        setOldPassword("");
        setNewPassword("");
        setRetypedPassword("");
        setShowPWSI(false);
        setPasswordInvalid(false);
        setIsValid(false);
    }

    const handlePasswordSave = async e => {
        setLoadingPassword(true);
        const result = await signin({email, password: oldPassword});
        setLoadingPassword(false);

        if(result && Boolean(result.error)){
            setMessage("Old password is incorrect.");
            return setOpenMessage(true);
        }

        const abortController = new AbortController();
        const signal = abortController.signal;

        const pwResult = await update({user: userContext.user}, {password: newPassword}, signal);
        
        if(!pwResult.error){
            setShowPasswordForm(false);
            setShowPWSI(false);
            setNewPassword("");
        }

    }

    useEffect(() => {
        const valid = ((oldPassword.length > 0) && (newPassword.length > 0) &&
        (isValid) && (newPassword === retypedPassword));

        valid ? setPasswordInvalid(false) : setPasswordInvalid(true);        
    }, [oldPassword, newPassword, isValid, retypedPassword]);
    
    const changePassword = <Typography className={classes.changePassword} component={Button} onClick={()=>{setShowPasswordForm(true)}}>Change password</Typography>;
    const passwordForm = <Collapse in>
        <Paper variant='outlined' className={classes.passwordForm}>
            <Grid container justify='space-evenly' alignItems='space-evenly'>
                <Grid item xs={12}>
                    <div className={classes.triangle} />
                </Grid>
                <Grid item xs={12} />
                <Grid item xs={4} className={classes.passwordGridText}>
                    <Typography>Old password: </Typography>
                </Grid>
                <Grid item xs={8} className={classes.passwordGridItem}>
                    <TextField fullWidth variant='outlined' size='small' type="password" onInput={handleOldPasswordChanged}/>
                </Grid>

                <Grid item xs={12} />
                <Grid item xs={4}  className={classes.passwordGridText}>
                    <Typography>New password: </Typography>
                </Grid>
                <Grid item xs={8} className={classes.passwordGridItem}>
                    <TextField fullWidth variant='outlined' size='small' type="password" onInput={handleNewPasswordChanged} onSelect={()=>{setShowPWSI(true)}}/>
                </Grid>
                <Grid item xs={10} className={classes.passwordIndicator}>
                    <Collapse in={showPWSI}>
                        <PWSI setIsValid={setIsValid} password={newPassword}/>
                    </Collapse>
                </Grid>

                <Grid item xs={4}  className={classes.passwordGridText}>
                    <Typography>Retype new password: </Typography>
                </Grid>
                <Grid item xs={8} className={classes.passwordGridItem}>
                    <TextField fullWidth variant='outlined' size='small' type="password" onInput={handleRetypedPasswordChanged}/>
                </Grid>
                <Grid item >
                    <Button onClick={handlePasswordSave} disabled={passwordInvalid} variant="outlined">Done</Button>
                </Grid>
                <Grid item >
                    <Button onClick={cancelPasswordReset} variant="outlined">Cancel</Button>
                </Grid>
            </Grid>
        </Paper>
        </Collapse>

    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {

        const getInfo = async () => {
            if(userContext.user){
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                const result = await read({user: userContext.user}, signal);
                console.log("Profile 296: ", result);
                if(result && result.firstName && result.lastName && result.email){
                    setFName(result.firstName);
                    setLName(result.lastName);
                    setEmail(result.email);
                }
            }
        }

        getInfo();
    }, [userContext.user]);

    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////


    const handleMsgClose = (event) => {
        setOpenMessage(false);
    }

    return <>
    <Snackbar open={openMessage} autoHideDuration={4000} onClose={handleMsgClose}>
        <Alert onClose={handleMsgClose} severity="error">
            {message}
        </Alert>
    </Snackbar>
    <Card variant='outlined' className={classes.mainCard}>
    <Typography className={classes.heading} variant='h4'>Profile</Typography>
    <Card>
        <Grid container justifyContent='space-around' alignItems='center'>

            <Grid item xs={1} sm={1}></Grid>
            <Grid item className={classes.profileItem} xs={2} sm={1}>
                <Typography>Email: </Typography>
            </Grid>
            <Grid item xs={1} sm={2}></Grid>
            <Grid item xs={6} sm={6} className={classes.profileItem}>
                {editEmail ? emailSelect : emailTyp}
            </Grid>
            <Grid item xs={2} sm={2} className={classes.profileItem}>
                {editEmail ? emailSave : emailEdit}
            </Grid>

            <Grid item xs={1} sm={1}></Grid>
            <Grid item className={classes.profileItem} xs={2} sm={2}>
                <Typography>First name: </Typography>
            </Grid>
            <Grid item xs={1} sm={1}></Grid>
            <Grid item xs={6} sm={6} className={classes.profileItem}>
                {editFName ? FNameSelect : FNameTyp}
            </Grid>
            <Grid item xs={2} sm={2} className={classes.profileItem}>
                {editFName ? FNameSave : FNameEdit}
            </Grid>

            <Grid item xs={1} sm={1}></Grid>
            <Grid item className={classes.profileItem} xs={2} sm={2}>
                <Typography>Last name: </Typography>
            </Grid>
            <Grid item xs={1} sm={1}></Grid>
            <Grid item xs={6} sm={6} className={classes.profileItem}>
                {editLName ? LNameSelect : LNameTyp}
            </Grid>
            <Grid item xs={2} sm={2} className={classes.profileItem}>
                {editLName ? LNameSave : LNameEdit}
            </Grid>

            <Grid item xs={12} />
            <Grid item xs={12} className={classes.profileItem}>
                {showPasswordForm ? passwordForm : changePassword}
            </Grid>
        </Grid>
    </Card>
    </Card>
    </>
}