
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../src/App';
import { StaticRouter } from "react-router";
import theme from '../src/theme';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles';

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
const fs = require('fs/promises');

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

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', shopRoutes);
app.use('/', paymentRoutes);
app.use('/', adminRoutes);

async function handleRender(req, res, next){

    const context = {};
    const sheets = new ServerStyleSheets();

    const html = ReactDOMServer.renderToString(
        sheets.collect(
            <ThemeProvider theme={theme}>
            <StaticRouter location={req.url} context={context}>
              <App />
            </StaticRouter>
            </ThemeProvider>,
        ),
        
    );

    const css = sheets.toString();

    const fullHtml = await renderFullPage(html, css);
    res.send(fullHtml);
}

async function renderFullPage(html, css){

    try{
        const data = await fs.readFile(path.resolve('../build/_index.html'), 'utf8');
        
        await data.replace(
        '<div id="root"></div>',
        `<div id="root">
            ${html}
        )}</div>`);

        await data.replace(
        '<style id="jss-server-side"></style>',
        `<style id="jss-server-side">
            ${css}
        )}</style>`);

        return data;
    }catch(e){
        return e;
    }

}

app.get('*', handleRender);

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