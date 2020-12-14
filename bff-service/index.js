const express = require('express');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req,res) => {
    console.log('OriginalUrl', req.originalUrl);
    console.log('Method', req.method);

    const recipient = req.path.split('/')[1];
    const targetUrl = process.env[recipient];
    if (targetUrl) {
        const axiosConfig = {
            method: req.method,
            url: `${targetUrl}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        }
        const auth = req.headers.authorization;
        if (auth) {
            axiosConfig.headers = {
                authorization: auth
            }
        }

        axios(axiosConfig)
        .then(response => {
            res.json(response.data)
        }).catch(err => {
            const response = err.response;
            if (response) {
                res.status(response.status).json(response.json)
            } else {
                res.status(500).json({
                    message: err.message
                });
            }
        });
    } else {
        res.status(502).json({
            message: "Cannot process response"
        });
    }
});

app.listen(PORT,() => {
    console.log(`Application is listening ${PORT} port`);
});