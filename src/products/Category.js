import React, {useState, useEffect, useMemo} from 'react';
import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Drawer from '@material-ui/core/Drawer';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import Pagination from '@mui/material/Pagination';
import ProductCard from './ProductCard';
import Skeletons from './Skeletons';
import {getComponents, getMinorComponents, getItems} from './api-products';

const useStyles = makeStyles((theme) => ({
    categoryGrid: {
        marginTop: "6%",
        [theme.breakpoints.down("xs")]: {
            marginTop: "20%"
        }
    },
    category: {
        fontSize: "1.7rem",
        fontFamily: 'Inconsolata',
        background: theme.palette.common.blue,
        color: theme.palette.common.white,
        clipPath: 'polygon(0 0, 100% 0%, 80% 100%, 0% 100%)',
        width: '45%',
        [theme.breakpoints.down("md")]: {
            width: '60%',
            fontSize: "1.2rem",
        },
        [theme.breakpoints.down("xs")]: {
            width: '100%',
            fontSize: "1.2rem",
        },
        
    },
    card: {
        minHeight: 1400,
        // marginLeft: '10%',
        // [theme.breakpoints.down("xs")]: {
        //     marginLeft: "0%"
        // },
        // marginTop: theme.spacing(5),
        alignItems: 'center'

    },
    items: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        minHeight: '50em'
      },
      paperFront: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.gray,
        position: 'relative',
        margin: theme.spacing(0),
        marginLeft: '12%',
        marginRight: '12%',
        width: theme.spacing(32),
        height: theme.spacing(56),
        zIndex: 4
      },
      paperBack: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.gray,
        position: 'relative',
        marginLeft: theme.spacing(-5),
        marginTop: theme.spacing(5),
        marginRight: theme.spacing(-5),
        width: theme.spacing(24),
        height: theme.spacing(40),
    },
    formControl: {
        left: '80%',
        marginBottom: '2%'
    },
    componentHeader: {
        fontSize: '1.5rem'
    },
    componentHeaderGrid: {
        marginTop: '6%'
    },
    otherLink: {
        position: 'absolute',
        display: 'block',
        width: '10%',
        top: '50%'
    },
    buttonLeft: {
        position: 'absolute',
        top: '65%'
    },
    buttonRight: {
        position: 'absolute',
        top: '65%',
        left: '90%'
    },
    gridItem: {
        marginLeft: '4%'
    },
    minCatChip: {
        // backgroundColor: theme.palette.common.gray,
        // color: theme.palette.common.white,
        // borderRadius: 10,
        // marginRight: '1rem'
    },
    resVals: {
        backgroundColor: theme.palette.common.white,
        borderColor: theme.palette.common.white,
        color: theme.palette.common.gray
    },
    addToCart: {
        marginTop: '10%'
    },
    listItem: {
        color: theme.palette.common.gray,
    },
    listItemSelected: {
        color: theme.palette.common.blue,
    },
    drawerComponents: {
        width: 250,
    },
    pages: {
        marginTop: '5%',
        marginBottom: '20%'
    }
}));

export default function Category({match}){

    const theme = useTheme();
    const classes = useStyles();
    const [sort, setSort] = useState('Name');
    const [allItems, setAllItems] = useState([]);
    const [components, setComponents] = useState([]);
    const [selectedComp, setSelectedComp] = useState(null);
    const [minorCats, setMinorCats] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [minCatAnchor, setMinCatAnchor] = useState(null);
    const [loading, setLoading] = useState(true);
    const openMinCatMenu = Boolean(minCatAnchor);

    const minCatNames = useMemo(() => {
        return minorCats.map((mc) => {
            return {name: mc.name, _id: mc._id};
        });
    }, [selectedComp, minorCats]);

    const matches = useMediaQuery(theme.breakpoints.down('md'));

    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////

    //get components/categories in shop
    useEffect(() => {
        async function getComps(shop, signal){
            try{
                const response = await getComponents(shop, signal);

                var editted = response ? response.shop ? [...response.shop.categories] : [] : [];

                response && response.shop && setComponents([...editted]);
                response && response.shop && setSelectedComp(editted[0]);
                // response && response.shop && console.log("category 125: ", [...response.shop.categories]);

            }catch(e){
                console.log(e);
            }
            
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        getComps(match.params.shop, signal);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match.params.shop]);


    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    

    //get minor categories in components/categories
    useEffect(() => {
        async function getMinorComps(comp, signal){
            try{
                if(comp){
                    const response = await getMinorComponents(comp, match.params.shop, signal);
                    response && response.component && response.component.minorCategories.forEach((minCat, i) => {
                        return minCat.checked = true;
                    });
                    response && response.component && setMinorCats([...response.component.minorCategories]);
                }
                
            }catch(e){
                console.log(e);
            }
            
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        if(selectedComp)
            getMinorComps(selectedComp._id, signal);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComp]);

    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    

    //get the products in all selected minor categories 
    //for now all are selected

    useEffect(() => {
        async function getAllItems(minCats, sort, page, signal){
            try{
                if(minCats && selectedComp){
                    setLoading(true);
                    const response = await getItems(minCats, selectedComp._id, match.params.shop, sort, page, signal);
                    // response && response.minCats && console.log("Category 225: ", response.minCats);

                    let items = []
                    response.minCats.forEach((item) => {
                        items.push(...item.products);
                    });

                    setLoading(false)

                    setAllItems(items);

                    if(response.pages){
                        setPages(response.pages);
                    }

                }
                
            }catch(e){
                console.log(e);
            }
            
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        setAllItems([]);

        var selected = [];

        minorCats.forEach((minCat) => {
            if(minCat.checked){
                selected.push(minCat);
            }
        });

        getAllItems(selected, sort, page, signal);

        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComp, minorCats, sort, page]);

    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////

    useEffect(() => {
        if(page > pages){
            setPage(pages);
        }
    }, [pages, page]);

    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    
    const onSelect = (event) => {
        setSort(event.target.value);
    }

    const listItemSelect = (comp) => async event => {
        setSelectedComp(comp);
        setOpenDrawer(false);
    }

    const highlightSelection = comp => {
        if(comp && selectedComp && comp._id === selectedComp._id){
            return true;
        }
    }

    const handleMinCatDown = event => {
        setMinCatAnchor(event.currentTarget);
    }

    const closeMinCatDown = event => {
        setMinCatAnchor(null);
    }

    const onPageChange = (event, p) => {
        setPage(p);
    }

    const selectMinorCatsUp = <Grid item>
        <FormGroup row>
        {
            minorCats.map((minCat, i) => {
                return(
                    <FormControlLabel 
                        className={classes.minCatChip}
                        control={<Checkbox onChange={()=>{minCat.checked=!minCat.checked;setMinorCats([...minorCats])}}
                        name={minCat.name} 
                        checked={minCat.checked} />}
                        label={minCat.name}
                        key={i}
                    />
                )
            })
        }
        
        </FormGroup>
    </Grid>

    const selectMinorCatsDown = <>
        <Grid item xs={2}>
            <IconButton onClick={handleMinCatDown}><Typography>Types</Typography><ArrowDownwardIcon /></IconButton>
        </Grid>
        <Grid item xs={2}>
            <Menu open={openMinCatMenu} getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }} 
                anchorEl={minCatAnchor} keepMounted onClose={closeMinCatDown}>
            <FormGroup>
            {
                minorCats.map((minCat, i) => {
                    return(
                        <FormControlLabel 
                            className={classes.minCatChip}
                            control={<Checkbox onChange={()=>{minCat.checked=!minCat.checked;setMinorCats([...minorCats])}}
                            name={minCat.name} 
                            checked={minCat.checked} />}
                            label={minCat.name}
                            key={i}
                        />
                    )
                })
            }
            
            </FormGroup>
            </Menu>
        </Grid>
    </>

    const selectCategoriesUp = <>
    <Grid item className={classes.componentHeaderGrid} xs={12}>
        <Typography className={classes.componentHeader}>Components</Typography>
    </Grid>

    <Grid item xs={2}>
        <List className={classes.otherLink} component='nav'>
            {
            components.map((comp, i) => {
                return (
                <ListItem button selected={highlightSelection(comp)}
                onClick={listItemSelect(comp)} key={i} 
                classes={{
                        root: classes.listItem,
                        selected: classes.listItemSelected
                    }}>
                    <ListItemText primary={comp.name} />
                </ListItem>
                )
            })
            }

        </List>
    </Grid>
    </>

    const selectedCategoriesDown = <>
    <Grid item xs={2}>
        <IconButton onClick={e=>setOpenDrawer(true)}><ArrowBackIcon/> <Typography>Components</Typography></IconButton>
    </Grid>
    <Grid item xs={4}>
        <Drawer anchor='left' open={openDrawer} onClose={e=>setOpenDrawer(false)}>
            <List className={classes.drawerComponents} component='nav'>
                <ListItem>
                    <Typography variant='h5'>Components</Typography>
                </ListItem>
                {
                components.map((comp, i) => {
                    return (
                    <ListItem button selected={highlightSelection(comp)}
                    onClick={listItemSelect(comp)} key={i} 
                    classes={{
                            root: classes.listItem,
                            selected: classes.listItemSelected
                        }}>
                        <ListItemText primary={comp.name} />
                    </ListItem>
                    )
                })
                }

            </List>
        </Drawer>
    </Grid>
    </>

    return (
        <>
        <Grid container>
            <Grid xs={12} item className={classes.categoryGrid}>
                <Typography className={classes.category}>Products of {match.params.shop} category</Typography>
            </Grid>

            {matches ? selectedCategoriesDown : selectCategoriesUp}
            {matches ? selectMinorCatsDown : undefined}

            <Grid item xs={12} md={12} lg={10}>
                <Card className={classes.card} variant='outlined'>
                    <Grid justify="center" container>
                        
                        {matches ? undefined : selectMinorCatsUp}

                        <Grid item xs={12}>
                            <FormControl className={classes.formControl}>
                                <Typography>Sort By:</Typography>
                                <Select value={sort} onChange={onSelect}>
                                    <MenuItem value="Price">Price (low to high)</MenuItem>
                                    <MenuItem value="Price1">Price (high to low)</MenuItem>
                                    <MenuItem value="Name">Name</MenuItem>
                                    <MenuItem value="Popularity">Popularity</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={10} justify="center">
                                {loading ? <Skeletons width={280} height={500} /> : allItems.map((item, i) => {
                                    return <ProductCard item={item} minCatNames={minCatNames} />
                                })
                                }
                                </Grid>
                        </Grid>

                        <Grid item>
                            <Pagination 
                            className={classes.pages} 
                            page={page} 
                            onChange={onPageChange} 
                            count={pages} 
                            variant='outlined' 
                            color='secondary' 
                            size='large' />
                        </Grid>
                    </Grid>

                </Card>
            </Grid>
        </Grid>
            
            
            
        </>
    )
}
