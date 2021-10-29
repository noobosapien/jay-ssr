import React from 'react';

import Latest from './Carousels/Latest';
import Hot from './Carousels/Hot';
import MostBrought from './Carousels/MostBrought';
import Grid from '@material-ui/core/Grid';

export default function ProductCarousel(props){


    return <>
    <Grid container justify='space-evenly'>
        <Grid item xs={5} md={2}>
            <Latest />
        </Grid>
        <Grid item xs={5} md={2}>
            <Hot />
        </Grid>
        <Grid item xs={8} md={2}>
            <MostBrought />
        </Grid>
    </Grid>
    </>
}