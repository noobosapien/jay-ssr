import React, {useState, useEffect} from 'react';
import zxcvbn from 'zxcvbn';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {hasEightCharacters, hasACapital, hasANumber} from './user-helper';

const useStyles = makeStyles(theme => ({
    pwTyp: {
        marginBottom: '2%'
    },
    pwMustContain: {
        marginTop: '2%'
    }
}));

const styledBy = (property, mapping) => (props) => mapping[props[property]];

const styles = {
    root: {
      color: styledBy('color', {
        green: '#05a100',
        red: '#f5425d',
      }),
    },
  };

const StyledTypography = withStyles(styles)(({ classes, color, ...other}) => (
    <Typography className={classes.root} {...other} />
));

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.gray,
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
    noMatch:{
        color: theme.palette.common.red
    },
    match: {
        color: theme.palette.common.orange
    }
  }))(LinearProgress);

export default function PWSI(props){
    const classes = useStyles();

    const [char8, setChar8] = useState("red");
    const [capitalLetter, setCapitalLetter] = useState("red");
    const [number1, setNumber1] = useState("red");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const score = zxcvbn(props.password).score;
        setProgress(score * 25);

        hasEightCharacters(props.password) ? setChar8("green") : setChar8("red");
        hasACapital(props.password) ? setCapitalLetter("green") : setCapitalLetter("red");
        hasANumber(props.password) ? setNumber1("green") : setNumber1("red");

        char8==="green"&&capitalLetter==="green"&&number1==="green" ? props.setIsValid(true) : props.setIsValid(false); 
    }, [props, char8, capitalLetter, number1]);

    return <Grid container>
        <Grid item className={classes.pwTyp}>
            <Typography variant="subtitle2">Password strength:</Typography>
        </Grid>
        <Grid item xs={12}>
            <BorderLinearProgress variant="determinate" value={progress} />
        </Grid>
        <Grid item xs={12} className={classes.pwMustContain}>
            <Typography variant="caption">Password must contain:</Typography>
        </Grid>
        <Grid item xs={12}>
            <StyledTypography color={char8} variant="caption">8 characters or more</StyledTypography>
        </Grid>
        <Grid item xs={12}>
            <StyledTypography color={capitalLetter} variant="caption">1 capital letter or more</StyledTypography>
        </Grid>
        <Grid item xs={12}>
            <StyledTypography color={number1} variant="caption">1 number or more</StyledTypography>
        </Grid>
    </Grid>
}