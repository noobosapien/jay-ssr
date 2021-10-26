import React from 'react';
import {useState, useEffect, useContext} from 'react';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {signin} from '../auth/api-auth';
import auth from '../auth/auth-helper';
import {UserContext} from '../App';


const useStyles = makeStyles(theme => ({

}));

export default function Login() {
    const classes = useStyles();
    const history = useHistory();
    const userContext = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        const response = await signin({email, password});
        auth.authenticate(response)
        userContext.setUser(auth.isAuthenticated());
        history.push('/');
    }

    return <> 
        <Card>
            <Grid container >
                <Grid className={classes.section} xs={12} md={5} item>
                    <Card>
                        <Typography className={classes.heading} variant='h4'>Login/Register</Typography>

                        <Card>
                        <Grid container justify='center' alignItems='center'>

                        <Grid item xs={1} sm={1}></Grid>
                        <Grid item xs={2} sm={1}>
                            <Typography>Email: </Typography>
                        </Grid>
                        <Grid item xs={1} sm={2}></Grid>
                        <Grid item xs={6} sm={6}>
                            <TextField onInput={(e) => setEmail(e.target.value)} />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                        </Grid>

                        <Grid item xs={1} sm={1}></Grid>
                        <Grid item xs={2} sm={2}>
                            <Typography>Password: </Typography>
                        </Grid>
                        <Grid item xs={1} sm={1}></Grid>
                        <Grid item xs={6} sm={6}>
                            <TextField onInput={(e) => setPassword(e.target.value)} />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                        </Grid>
                        <Grid item>
                            <Button onClick={login}>Login</Button>
                        </Grid>
                        </Grid>

                        </Card>
                    </Card>
                </Grid>
            </Grid>
        </Card>
    </>
}