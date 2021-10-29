import React, {useState, useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getSearch } from './api-core';


const useStyles = makeStyles(theme => ({
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        paddingTop: `calc(0.7em)`,
        fontSize: '1.3em'
      },
      search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        [theme.breakpoints.up("lg")]: {
            top: '15%'
        },
        [theme.breakpoints.up("md")]: {
          height: "3em",
        },
        [theme.breakpoints.down("md")]: {
            height: "3em",
        }
      },
      autoComplete: {
        color: theme.palette.common.gray,
        fontSize: 16,
      },
      listBox: {
        fontSize: '1.2rem',
        color: theme.palette.common.gray,
        overflow: 'visible'
      }
}));

export default function SearchBar(props){

const classes = useStyles();
const history = useHistory();
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);

useEffect(() => {
  async function getSearchResults(input, signal){
    try{
      const abortController = new AbortController();
      const signal = abortController.signal;

      const response = await getSearch(input, signal);
      if(response && response.results){
        setSearchResults(response.results);
      }

    }catch(e){
      console.log(e);
    }
  }

  const abortController = new AbortController();
  const signal = abortController.signal;

  getSearchResults(searchTerm, signal);

}, [searchTerm]);

const handleChange = async (event, term) => {

  try{

    if(searchResults){
      if(searchResults instanceof Array){
        for(var i = 0; i < searchResults.length; i++){
          if(searchResults[i].name === term){
            history.push(`/prod/${searchResults[i]._id}`);
          }
        }
      }
    }

    setSearchTerm(term);

  }catch(e){
    console.log(e);
  }

}

return (
    <div className={classes.search}>
        <Autocomplete
        classes={{
          input: classes.autoComplete,
          root: classes.clearIndicator,
          listbox: classes.listBox
        }}
        freeSolo
        id="product-search"
        disableClearable
        options={searchResults && searchResults.length > 0 ? searchResults.map((result) => result.name) : []}
        onInputChange={handleChange}
        onClick={()=>console.log('clicked')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search a product..."
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
      />
    </div>
    
)
}