import React, { useRef, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const images = [
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/electronics.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/electronics+selected.png',
      title: 'Electronics',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/electrical.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/electrical+selected.png',
      title: 'Electrical',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/speaker.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/speaker+selected.png',
      title: 'Automotive',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/metering.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/metering+selected.png',
      title: 'Meters',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/drones.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/drones+selected.png',
      title: 'Drones',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/HVAC.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/HVAC+selected.png',
      title: 'HVAC',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/Trade.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/Trade+selected.png',
      title: 'Trade Equipment',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/Cable.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/Cable+selected.png',
      title: 'Cables',
      width: '100%',
      imgRef: null
    },
    {
      url: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/Hobbies+selected.png',
      urlSelected: 'https://jaytronics.s3.ap-southeast-2.amazonaws.com/categories/Hobbies.png',
      title: 'Hobbies',
      width: '100%',
      imgRef: null
    },
  ];
  
const useStyles = makeStyles((theme) => ({
    root: {
      // display: 'flex',
      flexWrap: 'wrap',
      minWidth: 300,
      width: '100%',
      alignItems: 'center'
    },
    image: {
      // position: 'relative',
      height: 200,
      [theme.breakpoints.down('xs')]: {
        width: '100% !important',
        // height: '100%',
      },
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0.0,
        },
        '& $imageMarked': {
          opacity: 0,
        },
        '& $imageTitle': {
          border: `4px solid currentColor`,
          color: theme.palette.common.blue,
          fontSize: '2rem',
          fontWeight: '1500',
        },
        animation: `$transparent 1000ms ${theme.transitions.easing.easeInOut}`,
        '-webkit-animation': `$transparent 1000ms ${theme.transitions.easing.easeInOut}`
      },
    },
    "@keyframes transparent": {
      "0%": {
        opacity: 0.3,
      },
      "100%": {
        opacity: 1,
      }
    },
    "@-webkit-keyframes transparent": {
      "0%": {
        opacity: 0
      },
      "100%": {
        opacity: 1
      }
    },
    focusVisible: {},
    imageButton: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.common.white,
    },
    imageSrc: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    imageBackdrop: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.white,
      opacity: 0.2,
      transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
      position: 'absolute',
      verticalAlign: 'top',
      display: 'inline-block',
      top: '100%',
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
      color: theme.palette.common.blue,
      fontSize: '2rem',
      fontWeight: '1500',
    },
    imageMarked: {
      height: 3,
      width: 18,
      backgroundColor: theme.palette.common.blue,
      position: 'absolute',
      bottom: -2,
      left: 'calc(50% - 9px)',
      transition: theme.transitions.create('opacity'),
      color: theme.palette.common.blue
    },
    categories: {
      // width: '33%',
      verticalAlign: 'top',
      display: 'inline-block',
      // flexGrow: 1,
      textAlign: 'center',
      marginTop: '4%',
      marginBottom: '10%',
      [theme.breakpoints.down('xs')]: {
        marginTop: '10%',
        marginBottom: '30%',
      }
    }
  }));
  
  
  export default function ButtonBases() {
    const classes = useStyles();
    images.map((element, i) => element.imgRef = createRef());

    return (
      <div className={classes.root}>
        <Grid container>
          {images.map((image, i) => (
            <Grid item key={i} xs={12} sm={6} lg={4} className={classes.categories}>
              <Link to={`/cat/${image.title}`}>
              <ButtonBase
              disableRipple
              key={image.title}
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              style={{
                width: image.width,
              }}
              onTouchStart={event=>image.imgRef.current.style.backgroundImage = `url(${image.urlSelected})`}
              onTouchEnd={event=>image.imgRef.current.style.backgroundImage = `url(${image.url})`}
              onMouseOver={event=>image.imgRef.current.style.backgroundImage = `url(${image.urlSelected})`}
              onMouseLeave={event => image.imgRef.current.style.backgroundImage = `url(${image.url})`}
            >
              <Grid container alignItems="center" justify="center">
                  <Grid item xs={12}>
                    <span
                      ref={image.imgRef}
                      className={`${classes.imageSrc}`}
                      style={{
                        backgroundImage: `url(${image.url})`,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <span className={classes.imageBackdrop} />
                  </Grid>
                  <Grid item xs={12}>
                    <span className={classes.imageButton}>
                      <Typography component="span" variant="subtitle1" color="inherit" className={classes.imageTitle} >
                        {image.title}
                        <span className={classes.imageMarked} />
                      </Typography>
                    </span>
                  </Grid>
                </Grid>
            </ButtonBase>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }