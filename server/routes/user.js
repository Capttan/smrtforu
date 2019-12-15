const tesseract = require("node-tesseract-ocr");
const puppeteer = require('puppeteer');
const jimp = require('jimp');
const fs = require('fs');
const dbutil = require('../dbutil');

const FIND_WALLET = 'select walletvalue from wallets where username = ?';
const CHECK_BALANCE = 'select bankvalue from wallets where username = ?';
const UPDATE_WALLET = 'update wallets set walletvalue = ? where userid = ?';
const UPDATE_BALANCE = 'update wallets set bankvalue = ? where userid = ?';
const FIND_FULL_WALLET = 'select * from wallets where userid = ?';

const endptAccess = (req, resp, next) => {

    console.log('user: ', req.user);
  
    if (!req.user) {
        resp.status(403).json({ message: "Forbidden" });
        return;
    }
    next();
  }

module.exports = function (app, pool, mongoclient) {

    const getWallet = dbutil.mkQuery(FIND_WALLET, pool);
    const checkBalance = dbutil.mkQuery(CHECK_BALANCE, pool);
    const checkFullWallet = dbutil.mkQueryNoPool(FIND_FULL_WALLET);
    const updateBank = dbutil.mkQueryNoPool(UPDATE_BALANCE);
    const updateWallet = dbutil.mkQueryNoPool(UPDATE_WALLET);
    // const topupWallet = dbutil.mkQuery(TOPUP_WALLET, pool);

    app.get('/timing', endptAccess, (req, resp) => {

        console.log(req.query.stn);

        const stnString = req.query.stn;

        // to disable scraping and replace with hardcoded value
        if (0) {
            (async () => {
                // Set up browser and page.
                const imgName = 'logo-screenshot.png';
                const browser = await puppeteer.launch({ 
                    'args' : [
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                      ]
                });
                const page = await browser.newPage();

                await page.goto('https://trainarrivalweb.smrt.com.sg');

                const enterCaptcha = async () => {

                    try {
                        await page.waitForSelector('#imgCaptcha');

                        // Select the #svg img element and save the screenshot.
                        const svgImage = await page.$('#imgCaptcha');
                        await svgImage.screenshot({
                            path: imgName,
                            omitBackground: true,
                        });

                        const writeStr = await jimp.read(imgName)
                            .then(img => {

                                let xArray = [];
                                let yArray = [];
                                let idxArray = [];

                                img.scan(1, 1, img.bitmap.width - 1, img.bitmap.height - 1, (x, y, idx) => {

                                    let leftPix = img.getPixelColor(x - 1, y);
                                    let rightPix = img.getPixelColor(x + 1, y);
                                    let downPix = img.getPixelColor(x, y - 1);
                                    let upPix = img.getPixelColor(x, y + 1);

                                    let sum = (leftPix > 0xC8000000) + (rightPix > 0xC8000000) + (downPix > 0xC8000000) + (upPix > 0xC8000000);

                                    if (sum >= 2) {
                                        xArray.push(x);
                                        yArray.push(y);
                                        idxArray.push(idx);
                                    }
                                })

                                console.log(xArray[0], xArray[1]);
                                console.log(yArray[0], yArray[1]);
                                console.log(idxArray[0], idxArray[1]);


                                let idxLocal = 0

                                img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {

                                    if (x === xArray[idxLocal] && y === yArray[idxLocal]) {
                                        img.setPixelColor(0x000000FF, x, y);
                                        idxLocal++;
                                    } else {
                                        img.setPixelColor(0xFFFFFFFF, x, y);
                                    }

                                })

                                img.write('img_write.png');

                                // tesseract
                                const config = {
                                    lang: "eng",
                                    oem: 1,
                                    psm: 3,
                                    tessedit_char_whitelist: "0123456789"
                                }


                                return tesseract.recognize("img_write.png", config)
                                    .then(text => {
                                        console.log("Result:", text)
                                        console.log(typeof (text));
                                        const inputStr = text.split("\r\n\f");
                                        console.log(inputStr);
                                        return inputStr[0];
                                    })
                                    .catch(error => {
                                        console.log(error.message);
                                        return 'Error';
                                    })

                            })
                            .catch(err => {
                                console.error(err);
                                return 'Error';
                            });

                        console.log(writeStr);

                        await page.type('input[name=txtCodeNumber]', writeStr);
                        await page.keyboard.press('Enter');
                    } catch (err) {
                        console.log('no input[name=txtCodeNumber]')
                    }

                }


                var passCaptcha = false;
                var iter = 0;
                //try 4 times max, we do not want to get ip-banned 
                do {
                    iter++;
                    try {
                        await page.waitForSelector('select#ddlStation', { timeout: 1000 });
                        console.log('The element appeared.');
                        passCaptcha = true;
                    } catch (err) {
                        console.log('The element did not appear.');
                        enterCaptcha();
                    }

                } while ((passCaptcha == false) && (iter < 4));





                try {
                    await page.select('select#ddlStation', stnString);
                    await page.waitForSelector('#gvTime');
                    console.log('gvTime appeared.');

                    const data = await page.evaluate(() => {

                        const headers = Array.from(document.querySelectorAll('.align-left'));
                        const ths = Array.from(document.querySelectorAll('#gvTime tr th'));
                        const tds = Array.from(document.querySelectorAll('#gvTime tr td'));

                        const headerValue = headers.map(header => header.innerHTML);
                        const thsValue = ths.map(th => th.innerHTML);
                        const tdsValue = tds.map(td => td.innerHTML);

                        return dataObj = {
                            header: headerValue,
                            ths: thsValue,
                            tds: tdsValue
                        };

                        //let's massage the data before returning

                    });

                    console.log(data);

                    await browser.close();

                    const newData = {
                        header: data.header,
                        ths: data.ths,
                        tds: []
                    }

                    for(let i=0;i<Math.floor(data.header.length/2);i++){
                        let innerArray = []
                        for(let j=0;j<4;j++){
                            innerArray.push(data.tds[j+i*4]);
                        }
                        newData.tds.push(innerArray);
                    }

                    console.log(newData);

                    resp.json({ message: newData });

                } catch (err) {
                    console.log('gvTime did not appear.');
                    resp.json({ message: 'timing err' });
                }


            })();
        } else {

            // data = {
            //     header: [
            //       '&nbsp; NSL in the direction of Jurong East<br><br>',
            //       '<a href="http://journey.smrt.com.sg/journey/station_info/ang mo kio/map/" target="_blank"><b>Click here</b></a> for first train/last train timings.',
            //       '&nbsp; NSL in the direction of Marina South Pier<br><br>',
            //       '<a href="http://journey.smrt.com.sg/journey/station_info/ang mo kio/map/" target="_blank"><b>Click here</b></a> for first train/last train timings.'
            //     ],
            //     ths: [ 'Next MRT', 'Subsequent MRT', 'Next MRT', 'Subsequent MRT' ],
            //     tds: [
            //       '3 min(s)',
            //       '5 min(s)',
            //       'Jurong East',
            //       'Jurong East',
            //       '2 min(s)',
            //       '6 min(s)',
            //       'Marina South Pier',
            //       'Marina South Pier'
            //     ]
            //   }

            data = {
                header: [
                    '&nbsp; EWL in the direction of Pasir Ris<br><br>',
                    '<a href="http://journey.smrt.com.sg/journey/station_info/ang mo kio/map/" target="_blank"><b>Click here</b></a> for first train/last train timings.',
                    '&nbsp; EWL in the direction of Joo Koon<br><br>',
                    '<a href="http://journey.smrt.com.sg/journey/station_info/ang mo kio/map/" target="_blank"><b>Click here</b></a> for first train/last train timings.'
                ],
                ths: ['Next MRT', 'Subsequent MRT', 'Next MRT', 'Subsequent MRT'],
                tds: [
                    [
                        '3 min(s)',
                        '5 min(s)',
                        'Pasir Ris',
                        'Pasir Ris'
                    ],
                    [
                        '2 min(s)',
                        '6 min(s)',
                        'Joo Koon',
                        'Joo Koon'
                    ]
                ]
            }

            resp.json({ message: data });
        }

    })



    app.post('/fare', endptAccess, (req, resp) => {

        if (1) {

            const startStr = req.body.start.toString();
            const endStr = req.body.end.toString();

            (async () => {

                try {
                    // Set up browser and page.
                    const imgName = 'logo-screenshot.png';
                    let writeStr = '';
                    const browser = await puppeteer.launch({ 
                        'args' : [
                            '--no-sandbox',
                            '--disable-setuid-sandbox'
                          ]
                    });
                    const page = await browser.newPage();
                    // page.setViewport({ width: 1280, height: 926 });

                    // Navigate to this blog post and wait a bit.
                    await page.goto('https://www.transitlink.com.sg/eservice/eguide/rail_idx.php');
                    // await page.type('input[name=txtCodeNumber]','abc');
                    await page.waitForSelector('form[name="formmrt"]');

                    await page.select('select[name="mrtcode_start"]', startStr);
                    await page.select('select[name="mrtcode_end"]', endStr);

                    await page.click('input[name="submit"]');

                    // await page.waitForNavigation();

                    await page.waitForSelector('section[class="eguide-table"]');

                    // await page.waitFor(2000);

                    const data = await page.evaluate(() => {
                        const info = Array.from(document.querySelectorAll('td'));

                        const infoValue = info.map(info => info.innerHTML);

                        return infoValue;


                    });

                    console.log('info:', data);

                    await browser.close();

                    //massage the data here


                    const procData = {
                        adult: data[11],
                        standard: data[12],
                        senior: data[15],
                        student: data[17],
                        WTCS: data[19],
                        estTime: data[13]
                    }

                    resp.json({ message: procData });

                } catch (err) {
                    console.log(err);
                    resp.json({ message: 'fare err' });
                }

            })();





        } else {

            //hardcoded values
            // [
            //     "<img src="../imgs/transitlink_logo_60.jpg">",
            //     "<img src="../imgs/title/eguide.png" alt="Electronic Guide">",
            //     "From",
            //     "To",
            //     "<span id="railColorNS">NS10</span>&nbsp;&nbsp;Admiralty",
            //     "<span id="railColorNE">NE9</span>&nbsp;&nbsp; Boon Keng",
            //     "* Fare Type",
            //     "* Card",
            //     "Standard Ticket",
            //     "^ Estimated Travel Time (min)",
            //     "Adult",
            //     "$1.84",
            //     "$2.50",
            //     "41",
            //     "Senior Citizen / PWD <span class="super">#</span>",
            //     "$0.88",
            //     "Student",
            //     "$0.59",
            //     "WTCS <span class="super">#</span>",
            //     "$1.46"
            // ]

            console.log(req.body);

            const procData = {
                adult: "$1.84",
                standard: "$2.50",
                senior: "$0.88",
                student: "$0.59",
                WTCS: "$1.46",
                estTime: "41"
            };




            resp.json({ message: procData });

        }



    })

    app.get('/tweets', endptAccess, (req, resp) => {
        mongoclient.db('issApp').collection('tweets')
            .find({})
            .limit(10)
            .sort({ date: -1 })
            .toArray()
            .then((result) => {
                console.log(result);
                resp.json({message: result});
            })
            .catch((err) => {
                console.log(err);
                resp.message({ message: 'checkDB err' });
            })
    })

    app.get('/wallet', endptAccess, (req, resp) => {
        //should call wallet according to login user
        if (!!(req.user)) {
            console.log(req.user[0].username);
            getWallet(req.user[0].username)
                .then((result) => {
                    console.log('result:', result);
                    resp.status(200).json({ output: result });
                })
                .catch((err) => {
                    console.log(err);
                    resp.json({ err: err });
                })
        } else {
            console.log('not logged in');
            resp.json({ message: 'forbidden' });
        }

    })

    // use transaction for wallet top-up
    // although they are in the same table and db in this case, the actual implementation will be split
    // where we have to check the user's actual bank account first before triggering wallet update
    // should be app.post but let's keep it as app.get during coding
    app.post('/wallet/topup', endptAccess, (req, resp) => {
        //should call wallet according to login user
        //const amount = req.body.amount;

        //hardcode amount first
        const amount = req.body.value;
        if (!!(req.user)) {
            const user = req.user[0];
            console.log(user.username);
            //check bank balance

            checkBalance(user.username)
                .then((result) => {
                    // balance = 100;
                    console.log('balance:', result);

                    if (amount > result[0].bankvalue) {
                        resp.json({ message: 'Insufficient funds' });
                        return;
                    }

                    // // start transaction here to transfer funds
                    // const newWalletValue = req.user.username
                    // getWallet(req.user[0].id)
                    //     .then((result) => {
                    //         console.log('result:', result);
                    //         resp.status(200).json({ output: result });
                    //     })
                    //     .catch((err) => {
                    //         console.log(err);
                    //         resp.json({ err: err });
                    //     })

                    // resp.send('start transaction');

                    pool.getConnection(
                        (err, conn) => {

                            if (err) {
                                resp.status(400).json({ error: "conn.error" });
                                return;
                            }

                            console.log('Continue running');

                            // Start transaction
                            // { connection, result, params, error }
                            dbutil.startTransaction(conn)
                                .then(status => {

                                    // before in reality we only have control over the wallet
                                    // and not the bank, so we need it to be at the start of the transaction
                                    // and then rollback if access to external bank account fails
                                    console.log('startTransPass');
                                    //status.connection
                                    console.log('user: ' + user.username + ' id:' + user.id);
                                    console.log('wallet: ' + user.walletvalue);


                                    const walletBalance = user.walletvalue + amount;
                                    const params = [walletBalance, user.id];
                                    return (
                                        updateWallet({
                                            connection: status.connection,
                                            params: params
                                        })

                                    )
                                })
                                // // .then(getNewOrderId) // (status) => { }
                                .then(status => {
                                    const bankBalance = result[0].bankvalue - amount;
                                    const params = [bankBalance, user.id];
                                    //deduct from user bank
                                    return (
                                        // checkWallet({
                                        //     connection: status.connection,
                                        //     params: params
                                        // })
                                        updateBank({
                                            connection: status.connection,
                                            params: params
                                        })

                                    )
                                })
                                .then(dbutil.commit, dbutil.rollback)
                                .then((status) => {

                                    const params = [user.id];
                                    return (
                                        checkFullWallet({
                                            connection: status.connection,
                                            params: params
                                        })

                                    )

                                })
                                // .then(
                                //     (status) => {
                                //         return new Promise((resolve, reject) => {

                                //             fs.unlink(req.file.path, () => {
                                //                 resp.status(201).json({ success: "status.connection" });
                                //             });

                                //             resolve({ connection: status.connection });
                                //         });
                                //     },
                                //     (status) => { resp.status(400).json({ error: "status.error" }); }
                                // )
                                .then((status) => {
                                    console.log(status.result);
                                    resp.status(200).json({ message: 'trans ok' });
                                    // resp.status(200).json({ message: status[0].walletvalue});

                                }, (status) => { resp.status(400).json({ message: 'trans error' }) })
                                .finally(() => { conn.release() })
                        } // getConnection
                    )




                })
                .catch((err) => {
                    console.log('err', err);
                    resp.json({ message: 'check balance error' });
                })



        } else {
            console.log('not logged in');
            resp.json({ message: 'forbidden' });
        }

    })



    app.post('/station', endptAccess, (req, resp) => {

        // const station = req.body.station; //hardcode now
        console.log(req.body);

        const userLat = req.body.lat;
        const userLon = req.body.lon;

        // need to query for the nearest station

        mongoclient.db('issApp').collection('station_details')
            .find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [userLon, userLat]
                        },
                    }
                }
            })
            .limit(1)
            .toArray()
            .then((result) => {
                console.log(result);
                resp.json(result);
            })
            .catch((err) => {
                console.log(err);
                resp.json({ message: 'station checkDB err' });
            })

        // resp.json({message: 'ok'});

    })

    // app.get('/station/old', endptAccess, (req, resp) => {

    //     // const station = req.body.station; //hardcode now
    //     console.log(req.body);

    //     const station = 'ADM';

    //     mongoclient.db('issApp').collection('station_details')
    //         .find({ id: station })
    //         .limit(1)
    //         .toArray()
    //         .then((result) => {
    //             console.log(result);
    //             resp.json(result);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             resp.json({ message: 'station checkDB err' });
    //         })

    // })
}