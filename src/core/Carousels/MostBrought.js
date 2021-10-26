import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';

import './Mostbrought.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Typography from '@material-ui/core/Typography';

import { getMostBrought } from '../api-core';

export default function MostBrought(props){

    const [items, setItems] = useState([]);

    useEffect(() => {
        const getMBroughtProds = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const result = await getMostBrought(signal);

            if(result instanceof Array){
                setItems([...result]);
            }
        }

        getMBroughtProds();
    }, []);

    return <>
    <Typography variant='h5'>Most brought items</Typography>

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