import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';

export default function Popup(props){
    const {accept, decline, name, open} = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return <>
    <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="title"
      >
        <DialogTitle id="title">{"Remove permanantly"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Permanently delete {name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={decline} color="primary">
            Decline
          </Button>
          <Button onClick={accept} color="primary" autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
}