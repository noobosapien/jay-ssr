import React, { useState, useEffect, useRef, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { v4 as uuidv4 } from 'uuid';

import { getMinorCatNames, 
    getDownloadURL, 
    savePDFFromURL, 
    getImageURL, 
    saveImageFromURL, 
    updateProduct } from '../api-admin';

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


function ProductDisplay(props){

    const classes = useStyles();

    const { activeProduct, user, refresh, setRefresh } = props;

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Image
    //////////////////////////////////////////////////////////////////////////////////////

    const [image, setImage] = useState("");

    const saveImage = async event => {
        try{
            const abortController = new AbortController();
            const signal = abortController.signal;
    
            if(user.user){
                //ask server for an img url
                const result = await getImageURL(user, signal);
                //save it to that url
                await saveImageFromURL(event.target.files[0], result.url, signal);
                //setImage to the new link
                setImage(result.objLink);
            }
        }catch(e){
            console.log(e);
        }
    }

    const resetImage = event => {
        setImage(activeProduct.image);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    /////////////// otherImages
    //////////////////////////////////////////////////////////////////////////////////////

    const [otherImages, setOtherImages] = useState([]);

    const saveOtherImages = async event => {
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
                setOtherImages([...otherImages, ...imgArray]);
            }
        }catch(e){
            console.log(e);
        }
    }

    const removeOtherImage = image => event => {
        const edittedArray = otherImages.filter((img) => img !== image);
        setOtherImages([...edittedArray]);
    }

    const resetOtherImages = event => {
        if(activeProduct && activeProduct.otherImages)
            setOtherImages([...activeProduct.otherImages]);
        else
            setOtherImages([]);
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Name
    //////////////////////////////////////////////////////////////////////////////////////

    const [name, setName] = useState("");
    const [editName, setEditName] = useState(false);

    const saveName = (event) => {
        setEditName(false);
    }

    const dontSaveName = (event) => {
        setEditName(false);
        activeProduct ? setName(activeProduct.name) : setName(name);
    }

    const editNameButton = (event) => {
        setEditName(true);
    }

    const editNameText = (event) => {
        setName(event.target.value);
    }

    const showName = <Grid item container xs={10}>
        <Grid item xs={6}>
            <Typography>{name}</Typography>
        </Grid>
        
        <Grid item xs={6}>
                <Button onClick={editNameButton}>Edit</Button>
        </Grid>
    </Grid>

    const editNameForm = <Grid container item xs={10}>
        <Grid item xs={4}>
            <TextField value={name} onChange={editNameText} />
        </Grid>
        <Grid item xs={4}>
            <Button onClick={saveName}>Save</Button>
        </Grid>
        <Grid item xs={4}>
            <Button onClick={dontSaveName}>Reset</Button>
        </Grid>
    </Grid>

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////UID
    //////////////////////////////////////////////////////////////////////////////////////

    const [uid, setUid] = useState("");
    const [editUid, setEditUid] = useState(false);

    const saveUid = (event) => {
        setEditUid(false);
    }

    const dontSaveUid = (event) => {
        setEditUid(false);
        activeProduct ? setUid(activeProduct.uid) : setUid(uid);
    }

    const editUidButton = (event) => {
        setEditUid(true);
    }

    const editUidText = (event) => {
        setUid(event.target.value);
    }

    const showUid = <Grid item container xs={10}>
        <Grid item xs={6}>
            <Typography>{uid}</Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Button onClick={editUidButton}>Edit</Button>
        </Grid>
    </Grid>

    const editUidForm = <Grid container item xs={10}>
        <Grid item xs={4}>
            <TextField value={uid} onChange={editUidText} />
        </Grid>
        <Grid item xs={4}>
            <Button onClick={saveUid}>Save</Button>
        </Grid>
        <Grid item xs={4}>
            <Button onClick={dontSaveUid}>Reset</Button>
        </Grid>
    </Grid>

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Description
    //////////////////////////////////////////////////////////////////////////////////////

    const [description, setDescription] = useState("");
    const [editDescription, setEditDescription] = useState(false);

    const saveDescription = (event) => {
        setEditDescription(false);
    }

    const dontSaveDescription = (event) => {
        setEditDescription(false);
        activeProduct ? setDescription(activeProduct.description) : setDescription(description);
    }

    const editDescriptionButton = (event) => {
        setEditDescription(true);
    }

    const editDescriptionText = (event) => {
        setDescription(event.target.value);
    }

    const showDescription = <Grid item container xs={10}>
        <Grid item xs={6}>
            <Typography>{description}</Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Button onClick={editDescriptionButton}>Edit</Button>
        </Grid>
    </Grid>

    const editDescriptionForm = <Grid container item xs={10}>
        <Grid item xs={4}>
            <TextField multiline rows={6} fullwidth value={description} onChange={editDescriptionText} />
        </Grid>
        <Grid item xs={4}>
            <Button onClick={saveDescription}>Save</Button>
        </Grid>
        <Grid item xs={4}>
            <Button onClick={dontSaveDescription}>Reset</Button>
        </Grid>
    </Grid>


    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Minor Categories
    //////////////////////////////////////////////////////////////////////////////////////

    const [minCategory, setMinCategory] = useState({});
    const [editMinCategory, setEditMinCategory] = useState(false);
    const [allMinCats, setAllMinCats] = useState([]);

    useEffect(() => {
        async function setMinCatNames(signal){
            try{
                if(user.user){
                    const result = await getMinorCatNames(user, activeProduct.minorCat, signal);

                    if(result.minorCatNames instanceof Array && result.minorCatNames.length > 0){
                        setAllMinCats(result.minorCatNames);
                    }else{
                        setAllMinCats([]);
                    }
                }
                
            }catch(e){
                console.log(e);
            }
            
        }
        const abortController = new AbortController();
        const signal = abortController.signal;

        setMinCatNames(signal);

    }, [activeProduct]);

    useEffect(()=>{
        const mc = allMinCats.filter((mc) => mc._id===activeProduct.minorCat);
        if(mc instanceof Array && mc.length > 0)
            setMinCategory(mc[0]);
    }, [allMinCats]);

    const saveMinCategory = (event) => {
        setEditMinCategory(false);
    }

    const dontSaveMinCategory = (event) => {
        setEditMinCategory(false);
        const mc = allMinCats.filter((mc) => mc._id===activeProduct.minorCat);
        setMinCategory(mc[0]);
    }

    const editMinCategoryButton = (event) => {
        setEditMinCategory(true);
    }

    const selectMinorCategory = (event) => {
        const mc = allMinCats.filter((mc) => mc._id===event.target.value);
        
        setMinCategory(mc[0]);
    }

    const showMinCategory = <Grid item container xs={10}>
        <Grid item xs={6}>
            <Typography>{minCategory ? minCategory.name : undefined}</Typography>
        </Grid>
        
        <Grid item xs={6}>
            <Button onClick={editMinCategoryButton}>Edit</Button>
        </Grid>
    </Grid>

    const editMinCategoryForm = <Grid container item xs={10}>
        <Grid item xs={4}>
            <FormControl className={classes.formControl}>
                <Select
                value={minCategory ? minCategory._id : undefined}
                onChange={selectMinorCategory}
                inputProps={{
                    name: 'minor category',
                    id: 'minorcategory',
                }}
                >
                    {
                        allMinCats instanceof Array ? 
                        allMinCats.map((mincat) => {
                            return <option key={uuidv4()} value={mincat._id}>{mincat.name}</option>
                        }) : undefined
                    }
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={4}>
            <Button onClick={saveMinCategory}>Save</Button>
        </Grid>
        <Grid item xs={4}>
            <Button onClick={dontSaveMinCategory}>Reset</Button>
        </Grid>
    </Grid>


    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Stock
    //////////////////////////////////////////////////////////////////////////////////////

    const [stock, setStock] = useState(0);
    const [editStock, setEditStock] = useState(false);

    const saveStock = (event) => {
        setEditStock(false);
    }

    const dontSaveStock = (event) => {
        setEditStock(false);
        activeProduct ? setStock(activeProduct.stock) : setStock(stock);
    }

    const editStockButton = (event) => {
        setEditStock(true);
    }

    const editStockText = (event) => {
        setStock(event.target.value);
    }

    const showStock = <Grid item container xs={10}>
        <Grid item xs={6}>
            <Typography>{stock}</Typography>
        </Grid>
        
        <Grid item xs={6}>
                <Button onClick={editStockButton}>Edit</Button>
        </Grid>
    </Grid>

    const editStockForm = <Grid container item xs={10}>
        <Grid item xs={4}>
            <TextField value={stock} type="Number" onChange={editStockText} />
        </Grid>
        <Grid item xs={4}>
            <Button onClick={saveStock}>Save</Button>
        </Grid>
        <Grid item xs={4}>
            <Button onClick={dontSaveStock}>Reset</Button>
        </Grid>
    </Grid>

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Price
    //////////////////////////////////////////////////////////////////////////////////////

    const [price1, setPrice1] = useState({});
    const [price2, setPrice2] = useState({});
    const [price3, setPrice3] = useState({});

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
        setPrice1(activeProduct.price1);
        setPrice2(activeProduct.price2);
        setPrice3(activeProduct.price3);
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


    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Variables
    //////////////////////////////////////////////////////////////////////////////////////

    const [_variables, _SetVariables] = useState([]);
    const [addingVar, setAddingVar] = useState(false);
    const [displayVar, setDisplayVar] = useState(false);

    useEffect(() => {

        if((_variables instanceof Array)){
            var adding = false;

            _variables.forEach((_var) => {
                if(_var.parameter === "" || _var.value === ""){
                    adding = true;
                }
            });

            setAddingVar(adding);
        }else{
            _SetVariables([]);
        }
        
    }, [_variables]);

    useEffect(() => {
        const variables = activeProduct ?  activeProduct.variables instanceof Array ?
        activeProduct.variables.map(prod => {return {
            edit: false,
            value: prod.value,
            parameter: prod.parameter
        }}) : undefined : undefined

        _SetVariables(variables);

    }, [activeProduct]);

    
    const saveVariable = (prod, editted) => (event) => {
        if(!(_variables instanceof Array)){
            return
        }

        for(var i = 0; i < _variables.length; i++){
            if(_variables[i].parameter === editted.parameter){
                return;
            }
        }

        let newVariables = _variables;

        editted.edit = false;
        editted.parameter===undefined ? editted.parameter=prod.parameter : editted.parameter=editted.parameter;
        editted.value===undefined ? editted.value=prod.value : editted.value=editted.value;

        for(let i = 0; i < _variables.length ; i++){
            if(prod.parameter === _variables[i].parameter){
                newVariables.splice(i, 1, editted);
            }
        }

        _SetVariables([...newVariables]);
    }

    const varTyp = prod => <>
        <Grid item xs={3}>
            <Typography>{prod.parameter}</Typography>
        </Grid>
        <Grid item xs={3}>
            <Typography>{prod.value}</Typography>
        </Grid>
        <Grid item xs={3}>
            <Button onClick={setEdit(prod)}>Edit</Button>
        </Grid>
        </>
    
    const varTF = prod =>{ 

        let editted = {}
    
        return <>
        <Grid item xs={3}>
            <TextField label={prod.parameter} value={editted.parameter} onChange={event=>{
                editted.parameter = event.target.value !== "" ? event.target.value : prod.parameter;
                }}/>
        </Grid>
        <Grid item xs={3}>
            <TextField label={prod.value} value={editted.value} onChange={event=>{
                editted.value = event.target.value !== "" ? event.target.value : prod.value;
                }}/>
        </Grid>
        <Grid item xs={2}>
            <Button onClick={saveVariable(prod, editted)}>Save</Button>
        </Grid>
        <Grid item xs={2}>
            <Button onClick={setEditOff(prod)}>Close</Button>
        </Grid>
        </>
    }

    const setEditOff = prod => event => {

        if(!(_variables instanceof Array))
            return;
        
        const editted = {
            edit: false,
            value: prod.value,
            parameter: prod.parameter
        }

        var i = 0;
        var edittedArray = _variables;

        for(i = 0; i < _variables.length ; i++){
            if(prod.parameter === _variables[i].parameter)
                edittedArray.splice(i, 1, editted);
        }

        _SetVariables([...edittedArray]);
    }
    
    const setEdit = prod => event => {

        if(!(_variables instanceof Array))
            return;
        
        const editted = {
            edit: true,
            value: prod.value,
            parameter: prod.parameter
        }

        var i = 0;
        var edittedArray = _variables;

        for(i = 0; i < _variables.length ; i++){
            if(prod.parameter === _variables[i].parameter)
                edittedArray.splice(i, 1, editted);
        }

        _SetVariables([...edittedArray]);
    }

    const addVariable = (event) => {
        if(!(_variables instanceof Array))
            return;
                    
        const newVar = {
            edit: true,
            value: "",
            parameter: ""
        }

        setAddingVar(true);

        _SetVariables([..._variables, newVar]);
    }

    const removeVariable = prod => event => {
        if(!(_variables instanceof Array))
            return;
        
        var variables = _variables.filter((_var) => {
            return _var.parameter !== prod.parameter;
        });

        _SetVariables(variables);
    }

    const _product = (_variables instanceof Array) ?
    _variables.map((prod) => {
        return <React.Fragment key={uuidv4()}>
            <Grid container item>
            {prod.edit ? varTF(prod) : varTyp(prod)}
            <Grid item xs={2}>
                <Button onClick={removeVariable(prod)}>Remove</Button>
            </Grid>
        </Grid>
        </React.Fragment>
    }) : undefined

    const showVariables = () => {
        return <>
        {_product}
        <Grid container item>
            <Grid item xs={12}>
                <Button disabled={addingVar} onClick={addVariable}>Add Variable</Button>
            </Grid>
            <Grid item xs={6}>
                <Button onClick={event=>setDisplayVar(false)}>Close</Button>
            </Grid>
        </Grid>
        </>
        
            
    }

    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////Downloads
    //////////////////////////////////////////////////////////////////////////////////////

    const [_downloads, _SetDownloads] = useState([]);
    const [addingDownload, setAddingDownload] = useState(false);
    const [displayDownload, setDisplayDownload] = useState(false);

    useEffect(() => {

        if((_downloads instanceof Array)){
            var adding = false;

            _downloads.forEach((_download) => {
                if(_download.name === ""){
                    adding = true;
                }
            });

            setAddingDownload(adding);
        }else {
            _SetDownloads([]);
        }
        
    }, [_downloads]);

    useEffect(() => {
        const downloads = activeProduct ?  activeProduct.downloads instanceof Array ?
        activeProduct.downloads.map(prod => {return {
            edit: false,
            name: prod.name,
            link: prod.link
        }}) : undefined : undefined

        _SetDownloads(downloads);

    }, [activeProduct]);

    const addFile = (prod, _editted) => event => {
        if(!(_downloads instanceof Array))
            return;
        
        const editted = {
            ...prod,
            ..._editted,
            file: event.target.files[0]
        }

        var i = 0;
        var edittedArray = _downloads;

        for(i = 0; i < _downloads.length ; i++){
            if(prod.name === _downloads[i].name)
                edittedArray.splice(i, 1, editted);
        }

        _SetDownloads([...edittedArray]);
    }
    
    const setDownloadEditOff = prod => event => {

        if(!(_downloads instanceof Array))
            return;
        
        const editted = {
            edit: false,
            name: prod.name,
            link: prod.link
        }

        var i = 0;
        var edittedArray = _downloads;

        for(i = 0; i < _downloads.length ; i++){
            if(prod.name === _downloads[i].name)
                edittedArray.splice(i, 1, editted);
        }

        _SetDownloads([...edittedArray]);
    }
    
    const setDownloadEdit = prod => event => {

        if(!(_downloads instanceof Array))
            return;
        
        const editted = {
            edit: true,
            name: prod.name,
            link: prod.link
        }

        var i = 0;
        var edittedArray = _downloads;

        for(i = 0; i < _downloads.length ; i++){
            if(prod.name === _downloads[i].name)
                edittedArray.splice(i, 1, editted);
        }

        _SetDownloads([...edittedArray]);
    }
    
    const saveDownload = (prod, editted) => async (event) => {
        if(!(_downloads instanceof Array)){
            return
        }

        for(var i = 0; i < _downloads.length; i++){
            if(_downloads[i].name === editted.name){
                return;
            }
        }

        let newDownloads = _downloads;

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

        for(let i = 0; i < _downloads.length ; i++){
            if(prod.name === _downloads[i].name){
                newDownloads.splice(i, 1, {name: editted.name, link: editted.link});
            }
        }

        _SetDownloads([...newDownloads]);
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
        if(!(_downloads instanceof Array))
            return;
        
        const newDownload = {
            edit: true,
            name: "",
            link: ""
        }

        setAddingDownload(true);

        _SetDownloads([..._downloads, newDownload]);
    }

    const removeDownload = prod => event => {
        if(!(_downloads instanceof Array))
            return;
        
        var downloads = _downloads.filter((_download) => {
            return _download.name !== prod.name;
        });

        _SetDownloads(downloads);
    }

    const _download = (_downloads instanceof Array) ?
    _downloads.map((prod) => {
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


    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////


    useEffect(() => {
        if(activeProduct){
            setImage(activeProduct.image);

            if(activeProduct && activeProduct.otherImages instanceof Array)
                setOtherImages(activeProduct.otherImages);
            else
                setOtherImages([]);

            setName(activeProduct.name);
            setUid(activeProduct.uid);
            setDescription(activeProduct.description);
            setMinCategory(activeProduct.minCategory);
            setStock(activeProduct.stock);
            setPrice1(activeProduct.price1);
            setPrice2(activeProduct.price3);
            setPrice3(activeProduct.price2);
            _SetVariables(activeProduct.variables);
            _SetDownloads(activeProduct.downloads);
        }
    }, [activeProduct]);

    const saveProduct = async event => {
        try{
            if(user.user){
                const abortController = new AbortController();
                const signal = abortController.signal;

                const product = {
                    _id: activeProduct ? activeProduct._id : 0,
                    newUid: uid,
                    newName: name,
                    newDescription: description,
                    newImage: image,
                    newOtherImages: otherImages,
                    newMinorCat: minCategory ? minCategory._id : 0,
                    newStock: stock,
                    newPrice1: price1,
                    newPrice2: price2,
                    newPrice3: price3,
                    newVariables: _variables,
                    newDownloads: _downloads
                };

                await updateProduct(user, JSON.stringify(product), signal);
                setRefresh(refresh+1);
            }
            
        }catch(e){
            console.log(e);
        }

    }

    const resetAll = (event) => {
        if(activeProduct){
            setImage(activeProduct.image);
            setUid(activeProduct.uid);

            if(activeProduct && activeProduct.otherImages instanceof Array)
                setOtherImages(activeProduct.otherImages);
            else
                setOtherImages([]);
            
            setDescription(activeProduct.description);
            setName(activeProduct.name);
            setMinCategory(activeProduct.minCategory);

            const mc = allMinCats.filter((mc) => mc._id===activeProduct.minorCat);
            if(mc instanceof Array && mc.length > 0)
                setMinCategory(mc[0]);
            
            setStock(activeProduct.stock);
            setPrice1(activeProduct.price1);
            setPrice2(activeProduct.price3);
            setPrice3(activeProduct.price2);
            _SetVariables(activeProduct.variables);
            _SetDownloads(activeProduct.downloads);
        }
    }

    return <Card>
        <Grid container>        
            <Grid item xs={12}>
                <Typography>Image:</Typography>
            </Grid>
            <Grid item>
                <Card>
                    <CardActionArea>
                        <CardMedia className={classes.image}
                        image={image}
                        title="image of product" />
                    </CardActionArea>
                    <CardActions>
                        <input type="file" onChange={saveImage} accept="image/png" placeholder="Edit" />
                        <Button onClick={resetImage}>Reset</Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12}>
                <Typography>Other Images:</Typography>
            </Grid>
            <Grid item xs={12}>
                <input type="file" onChange={saveOtherImages} accept="image/png" multiple placeholder="Edit" />
            </Grid>
            {
                otherImages.map((im) => {
                    return <> 
                    <Grid item>
                        <Card>
                            <CardActionArea>
                                <CardMedia className={classes.image}
                                image={im}
                                title="image of product" />
                            </CardActionArea>
                            <CardActions>
                                <Button onClick={removeOtherImage(im)}>Remove</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    </>
                })
            }
            <Grid item xs={12} />

            <Grid item>
                <Button onClick={resetOtherImages}>Reset other images</Button>
            </Grid>
            <Grid item xs={12} />
                

            <Grid item xs={2}>
                <Typography>UID: </Typography>
            </Grid>
            {editUid ? editUidForm : showUid}
            <Grid item xs={12} />

            <Grid item xs={2}>
                <Typography>Name: </Typography>
            </Grid>
            {editName ? editNameForm : showName}
            <Grid item xs={12} />

            <Grid item xs={2}>
                <Typography>Description: </Typography>
            </Grid>
            {editDescription ? editDescriptionForm : showDescription}
            <Grid item xs={12} />

            <Grid item xs={2}>
                <Typography>Minor Category:</Typography>
            </Grid>
            {editMinCategory ? editMinCategoryForm : showMinCategory}
            <Grid item xs={12} />

            <Grid item xs={2}>
                <Typography>Stock:</Typography>
            </Grid>
            {editStock ? editStockForm : showStock}
            <Grid item xs={12} />

            {editPrice ? editPriceForm : showPrice}
            <Grid item xs={12} />

            <Grid item xs={2}>
                <Typography>Variables:</Typography>
            </Grid>
            {
                displayVar ? showVariables() : 
                <Grid item xs={2}>
                    <Button onClick={event=>setDisplayVar(true)}>Show</Button>
                </Grid>
            }
            
            <Grid item xs={12} />

            <Grid item xs={2}>
                <Typography>Downloads:</Typography>
            </Grid>
            {
                displayDownload ? showDownloads() : 
                <Grid item xs={2}>
                    <Button onClick={event=>setDisplayDownload(true)}>Show</Button>
                </Grid>
            }
            <Grid item xs={12} />
            <Grid item xs={6}>
                <Button onClick={resetAll}>Reset all</Button>
            </Grid>
            <Grid item xs={6}>
                <Button onClick={saveProduct}>Save</Button>
            </Grid>
        </Grid>
    </Card>
}


export default ProductDisplay; 