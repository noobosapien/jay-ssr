import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';


const useStyles = makeStyles(theme => ({
    notes: {
        width: '100%',
        marginBottom: '20%'
    }
  
}));

  export default function DeliveryNotes(props){

    const classes = useStyles();

    return <> 
        <TextField className={classes.notes} variant='outlined' multiline label="extra delivery info." rows={4}/>
    </>
  }