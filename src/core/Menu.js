import React, {useState, useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import auth from './../auth/auth-helper';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { mdiAccountCircle, mdiCartOutline, mdiLogout } from '@mdi/js';
import Icon from '@mdi/react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { UserContext } from '../App';
import SearchBar from './SearchBar';
import LoginNSignup from './MenuComps/LoginNSignup';

import logo from "../assets/images/logo.svg"

const useStyles = makeStyles(theme => ({
    appBar: {
      backgroundColor: "rgba(0, 0, 0, 0.0)"
    },
    toolbarMargin: {
        ...theme.mixins.toolbar,
        marginBottom: "3em"
    },
    logo: {
        padding: 0,
        order: 0,
        [theme.breakpoints.up("md")]: {
          height: "7em",
        },
        [theme.breakpoints.down("md")]: {
          height: "5em",
        },
        [theme.breakpoints.down("sm")]: {
          height: "4em",
        },
    },
    logoContainer: {
        padding: 0,
        "&:hover": {
            backgroundColor: 'transparent'
        },
    },
    link: {
      underlineNone: true
    },
    searchCat: {
      width: '100px',
      fontSize: '0.6rem',
      marginLeft: '0%',
      // marginTop: '-10px',
      position: 'relative',
      color: theme.palette.common.white,
      backgroundColor: theme.palette.common.orange,
      padding: 0,
    },
    searchForm: {
      margin: theme.spacing(1),
      backgroundColor: 'secondary',
    },
    searchText: {
      backgroundColor: theme.palette.common.blue,
      fontSize: '0.7rem'
    },
    icons: {
        marginLeft: '8%'
    },
    iconLot: {
      [theme.breakpoints.up("md")]: {
        order: 3
      },
      [theme.breakpoints.down("md")]: {
        order: 1
      },
      marginTop: '1.7%'
    },
    searchSpace: {
      order: 4
    },
    gridLogo: {
      order: 0
    },
    gridSearch: {
      [theme.breakpoints.up("md")]: {
        order: 1
      },
      [theme.breakpoints.down("md")]: {
          order: 3
      }
    },
    wrapper: {
      display: 'flex',
      flexFlow: 'row wrap'
    },
    spaceSearchAccount: {
      [theme.breakpoints.up("sm")]: {
        order: 2
      },
      [theme.breakpoints.down("sm")]: {
        order: 2
      },
    }
}));

const StyledMenu = withStyles({
  paper: {
      border: '1px solid #d3d4d5',
  },
  })((props) => (
  <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
      }}
      transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
      }}
      {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
      '&:focus': {
      backgroundColor: theme.palette.common.white,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.gray,
      },
      },
  },
}))(MenuItem);

const loggedInItems = [
  {name: 'Account', path: '/user/account', icon: <AccountCircleIcon />},
  {name: 'Cart', path: '/cart', icon: <ShoppingCartIcon />},
  {name: 'Logout', onClick: auth.clearJWT, icon: <ExitToAppIcon />}
];
const loggedOutItems = [
  {name: 'Cart', path: '/cart', icon: <ShoppingCartIcon />}
];

const Header = withRouter(({history}) => {

    const userContext = useContext(UserContext);

    const classes = useStyles();
    const downSm = useMediaQuery('(max-width:600px)');

    const [profileMenu, setProfileMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);


    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
      setProfileMenu(true);
      console.log(auth.isAuthenticated());
    }

    const handleClose = (e) => {
      setAnchorEl(null);
      setProfileMenu(false);
    }

    const logout = (e) => {
      auth.clearJWT();
      userContext.setUser(null);
      history.push('/');
    }

    const loggedIn = <> 
    <Grid container alignItems='center' justify='center'>
      <Grid item xs={4}>
        <Button component={Link} to='/user/account' disableRipple>
        <Grid container justify='center' alignItems='center' alignContent='center'>
          <Grid item xs={4} />
          <Grid item xs={6}>
            <Icon className={classes.icon} path={mdiAccountCircle} title="User" size={1.0}
                color="#2a2b2b"
            />
          </Grid>
          <Grid item xs={2} />

          <Grid item xs={2} />
          <Grid item xs={6}>
            <Typography variant='caption'>Account</Typography>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </Button>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={logout}>
          <Grid container>
            <Grid item xs={3} />
            <Grid item xs={6} lg={6}>
            <Icon className={classes.icon} path={mdiLogout} title="Logout" size={1.0}
                color="#2a2b2b"
            />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={2} />
            <Grid item xs={12} lg={6}>
              <Typography variant='caption'>Logout</Typography>
            </Grid>
            <Grid item xs={3} />
          </Grid>
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button disableRipple component={Link} to='/cart'>
        <Grid container>
            <Grid item xs={3} />
            <Grid item xs={12} lg={6}>
            <Icon className={classes.icon} path={mdiCartOutline} title="Cart" size={1.0}
                color="#2a2b2b"
            />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={3} />
            <Grid item xs={12} lg={2}>
              {/* <Typography variant='caption'>Cart</Typography> */}
            </Grid>
            <Grid item xs={3} />
          </Grid>
      </Button> 
      </Grid>
    </Grid>
    </>

    const loggedOut = <> 
    <Grid container alignItems='center' justify='center'>
      <Grid item xs={6}>
        <LoginNSignup />
      </Grid>
      <Grid item xs={6}>
          <Button component={Link} to='/cart' disableRipple>
          <Grid container justify='center' alignItems='center'>
            <Grid item sm={3} />
            <Grid item xs={6} lg={3}>
              <Icon className={classes.icon} path={mdiCartOutline} title="User" size={1.0}
                  color="#2a2b2b"
              />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={3} />
            <Grid item xs={12} lg={6}>
              {/* <Typography variant='caption'>Cart</Typography> */}
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </Button>
      </Grid>
    </Grid>
    </>

    const mobileLoggedout = [
      <LoginNSignup />,
      loggedOutItems.map((item, i) => {
        return (
        <StyledMenuItem key={i} label={item.name} component={Link} to={item.path}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </StyledMenuItem>
        )
      })
    ]

    return (
      <AppBar position="static" color="primary" classes={{root: classes.appBar}} elevation={0}>
          <Toolbar disableGutters>
            <Grid container spacing={1} justify='flex-start'>
              <Grid item xs={10} sm={8} md={9} lg={4} className={classes.gridLogo}>
                <Button disableRipple component={Link} to='/' className={classes.logoContainer}>
                    <img className={classes.logo} alt="logo" src={logo}/>
                </Button>
              </Grid>
                
                <Grid item xs={8} sm={6} lg={4} className={classes.gridSearch}>
                  <SearchBar />
                </Grid>
                <Grid item xs={false} sm={3} lg={1} className={classes.spaceSearchAccount}/>

                {downSm ? <>
                <Grid item xs={2}>
                  <IconButton size='medium' onClick={handleClick}>
                    <MenuIcon fontSize='large'/>
                  </IconButton>
                </Grid>
                <Grid xs={2} sm={false}/>
                </> : <>
                <Grid item xs={3} sm={4} md={3} lg={3} className={classes.iconLot}>
                  {userContext.user ? loggedIn : loggedOut}
                </Grid>
                </>}
            </Grid>

            <StyledMenu keepMounted style={{zIndex: 10}} anchorEl={anchorEl} open={profileMenu} MenuListProps={{onMouseLeave: handleClose}} onClose={handleClose}>
                {
                userContext.user ?

                loggedInItems.map((item, i) => {
                  return (
                    item.name === 'Logout' ? 
                  <StyledMenuItem key={i} label={item.name} component={Button} onClick={logout}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </StyledMenuItem> 
                  : 
                  <StyledMenuItem key={i} label={item.name} component={Link} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </StyledMenuItem> 
                  )
                })
                :loggedOutItems.map((item, i) => {
                  return (
                    <>
                    <LoginNSignup />
                  <StyledMenuItem key={i} label={item.name} component={Link} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </StyledMenuItem>
                  </>
                  )
                })
              }
                  
            </StyledMenu>
          </Toolbar>
      </AppBar>
      );
});

export default Header;