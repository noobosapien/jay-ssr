import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

import './Hot.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Typography from '@material-ui/core/Typography';

import { getHottest } from '../api-core';

export default function Hot(props){

    const [items, setItems] = useState([]);

    useEffect(() => {
        const getHottestProds = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const result = await getHottest(signal);
            console.log("Hot 19: ", result);

            if(result instanceof Array){
                setItems([...result]);
            }
        }

        getHottestProds();
    }, []);


    return <>
    <Typography style={{marginBottom: '10%'}} variant='h5'>Hottest items</Typography>

    <Carousel infiniteLoop autoPlay={true} className='carousel' dynamicHeight={true} showArrows={true}>
    {
        items instanceof Array ?
        items.map((item) => {
            return <div>
                <img alt='product' src={item.image} />
                <Typography component={Link} to={`/prod/${item._id}`} className="legend" classes={{root: 'link'}}>
                    {item.name}
                </Typography>
            </div>
        }) : undefined
        
    }
    </Carousel>
    </>
}