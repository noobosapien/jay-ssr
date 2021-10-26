import React, { useState, useEffect, useRef, useContext } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { v4 as uuidv4 } from 'uuid';
import { 
    getShops, 
} from '../api-admin';

function Shop(user, shop, setShop){
    
    const [shops, setShops] = useState([]);

    //ask the api for all the shops with their id and store in shops state
    useEffect(()=>{
        async function setSh(signal){
            try{
                if(user.user){
                    const result = await getShops(user, signal);
                    setShops(result.shops);
                }
                
            }catch(e){
                console.log(e);
            }
            
        }
        const abortController = new AbortController();
        const signal = abortController.signal;

        setSh(signal);

    }, [user]);

    useEffect(()=>{
        if(shops && shops.length !== 0){
            // console.log(shops[0].name);
            setShop(shops[0]._id);
        }
    }, [shops]);

    return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Shop</FormLabel>
          <RadioGroup row aria-label="shop" name="Shops" value={shop}>
              
              {
                  shops instanceof Array ? shops.map((sh) => {
                    return <FormControlLabel 
                    key={uuidv4()} 
                    onChange={e=>{setShop(sh._id)}} 
                    value={sh._id} 
                    control={<Radio />} 
                    label={sh.name} />
                  }) : undefined
              }
          </RadioGroup>
        </FormControl>
      );
}

export default Shop;