
import 'regenerator-runtime/runtime';
import path from 'path';
import express from 'express';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../src/App';

const app = express();

app.use(express.static(path.resolve(__dirname, '../build')));

app.get('/', (req, res) => {
    console.log(path.resolve());
    fs.readFile(
        path.resolve('../build/index.html'),
        'utf8',
        (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
        return res.send(
            data.replace(
            '<div id="root"></div>',
            `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
            )
        );
        }
    );
})

app.use(express.static(path.resolve(__dirname, '../build')));

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));