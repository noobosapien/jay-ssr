
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../src/App';
import { StaticRouter } from "react-router";
import theme from '../src/theme';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';
import parser from 'ua-parser-js';
import mediaQuery from 'css-mediaquery';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const shopRoutes = require('./routes/shop-routes');
const paymentRoutes = require( './routes/payment-routes');
const adminRoutes = require('./routes/admin-routes');
const webhookRoutes = require('./routes/webhook-routes');
const path = require('path');
const fs = require('fs');

const app = express();

app.use('/', webhookRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
    res.set("Content-Security-Policy",
    "default-src 'self'; img-src *; script-src * 'unsafe-inline'; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem * 'unsafe-inline';");
    next();
});

app.use(express.static(path.join(__dirname, '../build')));
// app.use(express.static(path.join(__dirname, '../')));

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', shopRoutes);
app.use('/', paymentRoutes);
app.use('/', adminRoutes);

function handleRender(req, res, next){

    const context = {};
    const sheets = new ServerStyleSheets();

    const deviceType = parser(req.headers['user-agent']).device.type || 'desktop';
    const ssrMatchMedia = query => ({
        matches: mediaQuery.match(query, {
        width: deviceType === 'mobile' ? '0px' : '1024px',
        }),
    });

    const html = ReactDOMServer.renderToString(
        sheets.collect(
            <ThemeProvider theme={{
                ...theme, 
                props: {
                MuiUseMediaQuery: { ssrMatchMedia },
            }}}>
            <StaticRouter location={req.url} context={context}>
              <App />
            </StaticRouter>
            </ThemeProvider>,
        ),
        
    );

    const css = sheets.toString();

    res.send(renderFullPage(html, css));
}

function renderFullPage(html, css){
    var result = "";

    fs.readFile(
        path.resolve('../build/index.html'),
        'utf8',
        (err, data) => {
        if (err) {
            console.log(err);
        }
        try{
            result = data.replace(
            '<div id="root"></div>',
            `<div id="root">
                ${html}
            )}</div>`
            );

            // result = result.replace(
            //     '<style id="jss-server-side"></style>',
            //     `<style id="jss-server-side">
            //         ${css}
            //     )}</style>`
            // );

            // return result;

        }catch(e){
            console.log(e);
        }
        
        }
    );

    return result;

    // return `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="utf-8" />
    //     <meta name="viewport" content="width=device-width, initial-scale=1" />
    //     <meta
    //     name="Jaytronics"
    //     content="Electronics, Electrical and many other components"
    //     />
    //     <link rel="preconnect" href="https://fonts.googleapis.com">
    //     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    //     <link href="https://fonts.googleapis.com/css2?family=Inconsolata&family=Lexend+Exa:wght@600&family=Mate+SC&family=Unica+One&display=swap" rel="stylesheet">
    //     <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    //     <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    //     <title>Jaytronics</title>
    //     <style id="jss-server-side">${css}</style>
    // </head>
    // <body style='margin: 0'>
    //     <div id="root">${html}</div>

    //     <script async
    //     src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4jlpdKq0lxdSXb6zYUUIRWbY7yDmK90o&libraries=places&callback=initMap">
    // </script>
    // </body>
    // </html>

    // `
}

app.get('*', handleRender);

// app.get('*', (req, res) => {

    // const context = {};
    
    // fs.readFile(
    //     path.resolve('../build/index.html'),
    //     'utf8',
    //     (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(500).send('Internal Server Error');
    //     }
    //     try{
    //         return res.send(
    //             data.replace(
    //             '<div id="root"></div>',
    //             `<div id="root">${ReactDOMServer.renderToString(
    //                 <StaticRouter location={req.url} context={context}>
    //                     <App />
    //                 </StaticRouter>
    //             )}</div>`
    //             )
    //         );
    //     }catch(e){
    //         console.log(e);
    //     }
        
    //     }
    // );
// });

app.use((err, req, res, next) => {
    console.log(err);
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({"error" : err.name + ": " + err.message});
    }else if (err){
        res.status(400).json({"error" : err.name + ": " + err.message});
        console.log(err);
    }
});

module.exports = app;