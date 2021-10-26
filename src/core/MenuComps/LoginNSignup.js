import React, {useState, useContext} from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';

import LoginModal from './LoginModal';


const useStyles = makeStyles(theme => ({
    button: {
        color: theme.palette.common.gray
    }
}));

export default function LoginNSignup(props){
    const classes = useStyles();

    const [openModal, setOpenModal] = useState(false);

    const handleModalOpen = async e => {
        setOpenModal(true);
    }

    return <> 
        <LoginModal openModal={openModal} setOpenModal={setOpenModal} closable={true} />

        <Button onClick={handleModalOpen} className={classes.button} startIcon={<AccountCircle />}>
            Login/Signup
        </Button>
    </>
}