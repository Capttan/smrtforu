const tesseract = require("node-tesseract-ocr");
const puppeteer = require('puppeteer');
const jimp = require('jimp');
const fs = require('fs');
const webpush = require('web-push');

// const config = require('../config');
const config = require('../config_prod');

const PUBLIC_VAPID =
    'BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg';

const PRIVATE_VAPID = config.pushnote.private;

fakeDatabase = [];
webpush.setVapidDetails('mailto:hktan@smrtforu.com', PUBLIC_VAPID, PRIVATE_VAPID)

const endptAccess = (req, resp, next) => {

    console.log('user: ', req.user);
  
    if (!req.user) {
        resp.status(403).json({ message: "Forbidden " });
        return;
    }
    next();
  }

  const contentNego = (req, resp, next) => {

    // console.log('contentNego');
    resp.format({
      'application/json': ()=>{
        return next();
      },
      'default': ()=>{
        resp.status(406).send("Not acceptable");
        return;
      }
    });
  
  }
  

module.exports = function (app, pool, mongoclient) {

    app.get('/tweet', endptAccess, (req, resp) => {

        (async () => {

            try{
            // Set up browser and page.
            const browser = await puppeteer.launch({ 
                'args' : [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                  ]
            });
            const page = await browser.newPage();

            await page.goto('https://twitter.com/smrt_singapore');

            await page.waitForSelector('p[class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text"]');

          
          
            const data = await page.evaluate(() => {
              

              const htmlTag = document.querySelector('a[class="tweet-timestamp js-permalink js-nav js-tooltip"]');
          
              const htmlString = htmlTag.innerHTML.toString().split(" ");
        
             const dateString = htmlString[6].split("=");

             const finalString = dateString[1].substring(0,dateString[1].length);

              
            // return finalString;

            const info = document.querySelector('p[class="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text"]');

            const infoValue = '<p>' + info.innerHTML + '</p>'; //.toString(); // keep the whole html

            dataObj = {
                // date: finalString, //string
                date: (new Date()).toString(),
                info: infoValue //string
            };

            return dataObj;
          
            });


            console.log('info:', data);
          
            await browser.close();

            // tweetsArray.push(data);

            resp.status(200).json({message: 'tweets received'});

            //TODO: update database

        }catch(err){

            console.log(err);

            data = {
                date: (new Date()).toString(),
                info: '<p>Error retrieving tweets<p>'
            }
            resp.json({ message: 'tweets err' });
        }
          
          })();

    })

    app.post('/subscription', (req, res) => {
        const subscription = req.body;
        console.log(subscription);

        let subbed = false;

        //check if subscription is already there
        if(!!fakeDatabase){
        for(let i=0;i<fakeDatabase.length;i++){
            if(fakeDatabase[i].keys.auth===subscription.keys.auth){
                subbed = true;
                break;
            }
        }
        }
    
        if(!subbed){
            fakeDatabase.push(subscription);
        }

        res.status(200).json({message: 'sub ok'});
    })

    app.post('/trainalert', (req, res) => {

        const notificationPayload = {
            notification: {
                title: 'Train Alert',
                body: 'Your train is coming in 2 mins.',
                icon: 'assets/icons/icon-512x512.png',
            },
        }
    
        //retrieve fakeDatabase from your actual database of subscribers
    
        const promises = []
    
    
        fakeDatabase.forEach(subscription => {
            console.log(subscription);
            // logger.info('message',{key: subscription});
            // winston.log(subscription);
            promises.push(
                webpush.sendNotification(
                    subscription,
                    JSON.stringify(notificationPayload)
                )
            )
        })
    
    
        Promise.all(promises)
        .then(() => res.status(200).json({message: 'ok'}))
        .catch((err)=>{res.status(500).json({message: err})});
    
    })

    app.get('/getsubs',contentNego,(req,resp)=>{
        console.log(fakeDatabase);

        // resp.json({database: fakeDatabase});
        resp.json({database: fakeDatabase});
    })

    app.post('/clearsubs',contentNego,(req, resp)=>{
        fakeDatabase = [];
        console.log(fakeDatabase);
        resp.json({message: 'database cleared'});
    })

    app.get('/getsub/:id',contentNego,(req, resp)=>{

        sub_id = req.params.id;
        console.log(sub_id);

        for(let i=0;i<fakeDatabase.length;i++){
            if(sub_id === fakeDatabase[i].keys.auth){
                resp.status(200).json({message: 'Authenticated'});
                return;
            }
        }
        resp.status(404).json({message: "Not found"});
    });

}