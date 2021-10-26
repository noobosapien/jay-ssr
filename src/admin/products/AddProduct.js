import React, { useState, useEffect, useRef, useContext } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';

import { 
        getMinorCatNamewithID, 
        getDownloadURL, 
        savePDFFromURL, 
        getImageURL, 
        saveImageFromURL,
        addProduct,
    } from '../api-admin';

const useStyles = makeStyles((theme) => ({
    image: {
        height: '200px',
        width: '200px'
    },
    selectMinCategory: {
        maxWidth: '360px',
        maxHeight: '360px',
        position: 'relative',
        overflow: 'auto',
        backgroundColor: theme.palette.common.white,
    },
    listSection: {
        backgroundColor: 'inherit'
    },
    ul: {
        backgroundColor: 'inherit'
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddProduct(props){
    const {setEditProduct, minorCategory, user} = props;

    const classes = useStyles();

    const [image, setImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]);
    const [name, setName] = useState("");
    const [uid, setUid] = useState("");
    const [description, setDescription] = useState("");
    const [minorCat, setMinorCat] = useState({});
    const [stock, setStock] = useState(0);
    const [variables, setVariables] = useState([]);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState("");

    const imageFile = useRef(null);
    const variableName = useRef(null);
    const variableValue = useRef(null);

    //////////////////////////////////////////////////////////////////////////
    //////Prices
    //////////////////////////////////////////////////////////////////////////

    const [price1, setPrice1] = useState({lessThan: 0, price: 0});
    const [price2, setPrice2] = useState({moreThan: 0, price: 0});
    const [price3, setPrice3] = useState({moreThan: 0, price: 0});

    const [editPrice, setEditPrice] = useState(false);

    //0-lessThan 1-moreThan 2-price
    const changePrice = (_price, setPrice, element) => event => {
        switch(element){
            case 0:
                setPrice({..._price, lessThan: event.target.value});
                break;
            case 1:
                setPrice({..._price, moreThan: event.target.value});
                break;
            case 2:
                setPrice({..._price, price: event.target.value});
                break;
            
            default:
                break;
        }
    }

    const dontSavePrices = event => {
        setPrice1({lessThan: 0, price: 0});
        setPrice2({moreThan: 0, price: 0});
        setPrice3({moreThan: 0, price: 0});
        setEditPrice(false);
    }

    const savePrices = event => {
        setEditPrice(false);
    }

    const showPrice = <Grid item container xs={10}>
        <Grid item xs={3}>
            <Typography>Price less than</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography>{(price1) ? price1.lessThan : 0}</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography>{(price1) ? price1.price : 0} cents</Typography>
        </Grid>
        <Grid item xs={12} />

        <Grid item xs={3}>
            <Typography>Price more than</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography>{(price2) ? price2.moreThan : 0}</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography>{(price2) ? price2.price : 0} cents</Typography>
        </Grid>
        <Grid item xs={12} />

        <Grid item xs={3}>
            <Typography>Price more than</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography>{(price3) ? price3.moreThan : 0}</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography>{(price3) ? price3.price : 0}  cents</Typography>
        </Grid>
        <Grid item xs={12} />

        <Grid item xs={3}>
                <Button onClick={e=>setEditPrice(true)}>Edit</Button>
        </Grid>
    </Grid>

    const editPriceForm = <Grid item container xs={10}>
        <Grid item xs={2}>
            <Typography>Price less than</Typography>
        </Grid>
        <Grid item xs={2}>
            <TextField
            onChange={changePrice(price1, setPrice1, 0)}
            type="Number"
            label={ "Less than"} />
        </Grid>
        <Grid item xs={2}>
            <TextField 
            onChange={changePrice(price1, setPrice1, 2)}
            type="Number"
            label={"Price (Cents)"} />
        </Grid>
        <Grid item xs={12} />

        <Grid item xs={3}>
            <Typography>Price more than</Typography>
        </Grid>
        <Grid item xs={2}>
            <TextField
            onChange={changePrice(price2, setPrice2, 1)}
            type="Number" 
            label={"More than" } />
        </Grid>
        <Grid item xs={2}>
            <TextField
            onChange={changePrice(price2, setPrice2, 2)}
            type="Number" 
            label={"Price (Cents)"} />
        </Grid>
        <Grid item xs={12} />

        <Grid item xs={3}>
            <Typography>Price more than</Typography>
        </Grid>
        <Grid item xs={2}>
            <TextField
            onChange={changePrice(price3, setPrice3, 1)}
            type="Number"  
            label={"More than"} />
        </Grid>
        <Grid item xs={2}>
            <TextField 
            onChange={changePrice(price3, setPrice3, 2)}
            type="Number"
            label={"Price (Cents)"} />
        </Grid>
        <Grid item xs={12} />

        
        <Grid item xs={2}>
                <Button onClick={savePrices}>Save</Button>
        </Grid>
        <Grid item xs={2}>
                <Button onClick={dontSavePrices}>Reset</Button>
        </Grid>
    </Grid>

    //////////////////////////////////////////////////////////////////////////
    //////Downloads
    //////////////////////////////////////////////////////////////////////////

    const [downloads, setDownloads] = useState([]);
    const [addingDownload, setAddingDownload] = useState(false);
    const [displayDownload, setDisplayDownload] = useState(false);

    useEffect(() => {

        if((downloads instanceof Array)){
            var adding = false;

            downloads.forEach((_download) => {
                if(_download.name === ""){
                    adding = true;
                }
            });

            setAddingDownload(adding);
        }else {
            setDownloads([]);
        }
        
    }, [downloads]);


    const addFile = (prod, _editted) => event => {
        if(!(downloads instanceof Array))
            return;
        
        const editted = {
            ...prod,
            ..._editted,
            file: event.target.files[0]
        }

        var i = 0;
        var edittedArray = downloads;

        for(i = 0; i < downloads.length ; i++){
            if(prod.name === downloads[i].name)
                edittedArray.splice(i, 1, editted);
        }

        setDownloads([...edittedArray]);
    }
    
    const setDownloadEditOff = prod => event => {

        if(!(downloads instanceof Array))
            return;
        
        const editted = {
            edit: false,
            name: prod.name,
            link: prod.link
        }

        var i = 0;
        var edittedArray = downloads;

        for(i = 0; i < downloads.length ; i++){
            if(prod.name === downloads[i].name)
                edittedArray.splice(i, 1, editted);
        }

        setDownloads([...edittedArray]);
    }
    
    const setDownloadEdit = prod => event => {

        if(!(downloads instanceof Array))
            return;
        
        const editted = {
            edit: true,
            name: prod.name,
            link: prod.link
        }

        var i = 0;
        var edittedArray = downloads;

        for(i = 0; i < downloads.length ; i++){
            if(prod.name === downloads[i].name)
                edittedArray.splice(i, 1, editted);
        }

        setDownloads([...edittedArray]);
    }
    
    const saveDownload = (prod, editted) => async (event) => {
        if(!(downloads instanceof Array)){
            return
        }

        for(var i = 0; i < downloads.length; i++){
            if(downloads[i].name === editted.name){
                return;
            }
        }

        let newDownloads = downloads;

        editted.edit = false;
        editted.name===undefined ? editted.name=prod.name : editted.name=editted.name;
        editted.link = prod.link;

        if(prod.file){
            //call the api with the file and get the link from the server after uploading and make the link that
            if(user.user && prod.file){
                const abortController = new AbortController();
                const signal = abortController.signal;

                const file = new FormData();
                file.append('file', prod.file);
    
                const result = await getDownloadURL(user, signal);
                await savePDFFromURL(file, result.url, signal);
                editted.link = result.objLink;
            }
            
        }

        for(let i = 0; i < downloads.length ; i++){
            if(prod.name === downloads[i].name){
                newDownloads.splice(i, 1, {name: editted.name, link: editted.link});
            }
        }

        setDownloads([...newDownloads]);
    }
    
    const downloadTyp = prod => <>
        <Grid item xs={3}>
            <Typography>{prod.name}</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography><a href={prod.link}>Link</a></Typography>
        </Grid>
        <Grid item xs={3}>
            <Button onClick={setDownloadEdit(prod)}>Edit</Button>
        </Grid>
    </>

    const downloadTF = prod =>{ 

        let editted = {};
    
        return <>
        <Grid item xs={3}>
            <TextField label={prod.name} value={editted.name} onChange={event=>{
                editted.name = event.target.value !== "" ? event.target.value : prod.name;
                }}/>
        </Grid>
        <Grid item xs={3}>
           <input placeholder="Download" onChange={addFile(prod, editted)} type="file" accept=".pdf"/>
        </Grid>
        <Grid item xs={2}>
            <Button onClick={saveDownload(prod, editted)}>Upload</Button>
        </Grid>
        <Grid item xs={2}>
            <Button onClick={setDownloadEditOff(prod)}>Close</Button>
        </Grid>
        </>
    }

    const addDownload = (event) => {
        if(!(downloads instanceof Array))
            return;
        
        const newDownload = {
            edit: true,
            name: "",
            link: ""
        }

        setAddingDownload(true);

        setDownloads([...downloads, newDownload]);
    }

    const removeDownload = prod => event => {
        if(!(downloads instanceof Array))
            return;
        
        var _downloads = downloads.filter((_download) => {
            return _download.name !== prod.name;
        });

        setDownloads(_downloads);
    }

    const _download = (downloads instanceof Array) ?
    downloads.map((prod) => {
        return <React.Fragment key={uuidv4()}>
            <Grid container item>
            {prod.edit ? downloadTF(prod) : downloadTyp(prod)}
            <Grid item xs={2}>
                <Button onClick={removeDownload(prod)}>Remove</Button>
            </Grid>
        </Grid>
        </React.Fragment>
    }) : undefined;

    

    const showDownloads = () => {

        return <>
        {_download}
        <Grid container item>
            <Grid item xs={12}>
                <Button disabled={addingDownload} onClick={addDownload}>Add Download</Button>
            </Grid>
            <Grid item xs={6}>
                <Button onClick={event=>setDisplayDownload(false)}>Close</Button>
            </Grid>
        </Grid>
        </>
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    
    useEffect(() => {

        const getMinCatByID = async (user,  minCategoryID, signal) => {
            const result = await getMinorCatNamewithID(user, minCategoryID, signal);
            setMinorCat({name: result.minorCatName, _id: minorCategory});
        }

        if(minorCategory && user.user){
            const abortController = new AbortController();
            const signal = abortController.signal;

            //ask the server for the name
            getMinCatByID(user, minorCategory,signal);
            
        }else{
            setMinorCat({name: "Please select a minor category", _id: 0});
        }
    }, [minorCategory]);

    const handleMsgClose = event => {
        setOpenMessage(false);
    }

    const addMultipleImages = async event => {
        try{
            var files = event.target.files

            if(files.length > 0){
                var imgArray = [];

                for(var i = 0; i < files.length ; i++){
                    if(user.user){
                        const abortController = new AbortController();
                        const signal = abortController.signal;

                        const result = await getImageURL(user, signal);
                        await saveImageFromURL(event.target.files[i], result.url, signal);
                        imgArray.push(result.objLink);
                    }
                }
                setOtherImages([...imgArray]);
            }
        }catch(e){
            console.log(e);
        }
    }

    const imageChanged = async event => {
        try{
            if(event.target.files[0]){
                const abortController = new AbortController();
                const signal = abortController.signal;
    
                if(user.user){
                    //ask for a s3 url from the server
                    const result = await getImageURL(user, signal);
                    //put the image for that url
                    await saveImageFromURL(event.target.files[0], result.url, signal);
                    //set the url as the image url
                    setImage(result.objLink);
                }
            }
        }catch(e){
            console.log("Error uploading the image");
        }
    }

    const acceptVariables = event => {
        if(variableName.current.value === undefined || variableName.current.value === ""){
            setMessage("Enter a variable name");
            return setOpenMessage(true);
        }

        if(variableValue.current.value === undefined || variableValue.current.value === ""){
            setMessage("Enter a variable value");
            return setOpenMessage(true);
        }

        for(var i = 0; i < variables.length; i++){
            if(variables[i].parameter === variableName.current.value){
                setMessage("Value already exist");
                return setOpenMessage(true);
            }
        }
        const variable = {parameter: variableName.current.value, value: variableValue.current.value};

        const array = [...variables, variable];
        setVariables(array);
        variableName.current.value = "";
        variableValue.current.value = "";
    }

    const removeVariables = _var => event => {
        var array = [...variables];
        for(var i = 0; i < array.length; i++){
            if(array[i].parameter === _var){
                array.splice(i, 1);
            }
        }

        setVariables(array);
    }

    const saveProduct = async event => {
        //set done to false
        if(!image || image===""){
            setMessage("Upload an image to continue.")
            return setOpenMessage(true);
        }
        if(!name || name===""){
            setMessage("Enter a name to continue.")
            return setOpenMessage(true);  
        }
        if(!uid || uid===""){
            setMessage("Enter an UID to continue.")
            return setOpenMessage(true);  
        }
        if(!minorCat || minorCat._id === 0){
            setMessage("Select a valid minor category to continue.")
            return setOpenMessage(true);
        }
        if(price1.lessThan <= 0 || price1.price <= 0){
            setMessage("Price 1 is invalid.")
            return setOpenMessage(true);
        }
        if(price2.lessThan <= 0 || price2.price <= 0){
            setMessage("Price 2 is invalid.")
            return setOpenMessage(true);
        }
        if(price3.lessThan <= 0 || price3.price <= 0){
            setMessage("Price 3 is invalid.")
            return setOpenMessage(true);
        }

        //send the data to the server and reset the values for default
        const product = {
            name,
            uid,
            description,
            image,
            otherImages,
            minorCat: minorCat._id,
            stock,
            price1,
            price2,
            price3,
            downloads,
            variables
        };

        if(user.user){
            const abortController = new AbortController();
            const signal = abortController.signal;

            const result = await addProduct(user, product, signal);
            
            if(result.message === 'Success'){
                setName("");
                setUid("");
                setDescription("");
                setImage("");
                setOtherImages([]);
                setMinorCat({});
                setStock(0);
                setVariables([]);
                setDownloads([]);
                setPrice1({lessThan: 0, price: 0});
                setPrice2({moreThan: 0, price: 0});
                setPrice3({moreThan: 0, price: 0});
            }else{
                console.log(result);
            }
        }

    }

    return <>
    <Snackbar open={openMessage} autoHideDuration={1000} onClose={handleMsgClose}>
        <Alert onClose={handleMsgClose} severity="error">
            {message}
        </Alert>
    </Snackbar>
    <Grow in>
        <Paper>
            <Typography variant='h6'>Product</Typography>
            <Grid container>
                <Grid item xs={12}>
                    <Typography>Image</Typography>
                </Grid>
                {
                    image!==null ?  <Grid item xs={4}>
                        <Card>
                            <CardActionArea>
                                <CardMedia className={classes.image}
                                image={image}
                                title="image of product" />
                            </CardActionArea>
                        </Card>
                    </Grid> : undefined
                }

                <Grid item xs={12}>
                    Other images
                </Grid>
                {
                    otherImages.map((img, i) => {
                        return <> 
                        <Grid item xs={4}>
                            <Card>
                                <CardActionArea>
                                    <CardMedia className={classes.image}
                                    image={img}
                                    title="image of product" />
                                </CardActionArea>
                            </Card>
                        </Grid>
                        </>
                    })
                }
                
                <Grid item xs={12}>
                    <input ref={imageFile} onChange={imageChanged} accept="image/png" type='file' />
                </Grid>
                <Grid item xs={12}>
                    <input ref={imageFile} onChange={addMultipleImages} accept="image/png" multiple type='file' />
                </Grid>
                <Grid item xs={12}>
                    <Typography>UID</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField value={uid} onChange={e=>setUid(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Name</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField value={name} onChange={e=>setName(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Description</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField rows={6} fullWidth multiline value={description} onChange={e=>setDescription(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <Typography>Minor category</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6'>{minorCat.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>Stock</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Input onChange={e=>setStock(e.target.value)} value={stock} type='number'/>
                </Grid>

                <Grid item xs={12}>
                    {editPrice ? editPriceForm : showPrice}
                </Grid>
                <Grid item xs={12}>
                    <Typography>Downloads</Typography>
                </Grid>
                <Grid item xs={12}>
                    {showDownloads()}
                </Grid>
                <Grid item xs={12}>
                    <Typography>Variables</Typography>
                </Grid>
                {
                    variables.map((variable) => {
                        return <> 
                            <Grid item xs={2}>
                                <Typography label="parameter">{variable.parameter}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography label="value">{variable.value}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton onClick={removeVariables(variable.parameter)}>
                                    <RemoveCircleOutlineIcon fontSize="large"/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} />
                        </>
                    })
                }
                <Grid item xs={2}>
                    <TextField inputRef={variableName} label="parameter"></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField inputRef={variableValue} label="value"></TextField>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={acceptVariables}>
                        <CheckCircleOutlineIcon fontSize="large"/>
                    </IconButton>
                </Grid>
                
                <Grid item xs={12}/>

                <Grid item xs={2}>
                    <Button onClick={saveProduct}>Done</Button>
                </Grid>
                <Grid item xs={2}>
                    <Button onClick={e=>{setEditProduct(false)}}>Close</Button>
                </Grid>
            </Grid>
        </Paper>
    </Grow>
    </>
}