const express = require('express');
module.exports = () => {
    const router = express.Router();

    router.get('/secret', 
        (req, resp) => {
            console.log('hello world');
            resp.status(200).type('text/html').send('this is top secret');
        }
    )

    return (router);
}