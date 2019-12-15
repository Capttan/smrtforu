
const rp = require('request-promise-native');
const fs = require('fs');

// const config = require('../config');
const config = require('../config_prod');

const endptAccess = (req, resp, next) => {

    console.log('user: ', req.user);
  
    if (!req.user) {
        resp.status(403).json({ message: "Forbidden" });
        return;
    }
    next();
  }


module.exports = function (app, pool, mongoclient) {


    const getNearestMiddleware = (req,resp,next)=>{
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
                req.body['stnCoord'] = result[0].location.coordinates; //[0]:lon,[1]:lat
                next();
                // resp.json(result);
            })
            .catch((err) => {
                console.log('getNearest err', err);
                resp.json({message: 'getNearest err'});
                return;
            })
            // .finally(()=>{
            //     next();
            // })
    }
    
    
    const getRouteMiddleware = (req, resp, next) => {
    
    
        const startLat = req.body.lat;
        const startLong = req.body.lon;
    
        const endLat = req.body.stnCoord[1];
        const endLong = req.body.stnCoord[0];
    
        startString = startLat + ',' + startLong;
        endString = endLat + ',' + endLong;
    
        options = {
            uri: 'https://maps.googleapis.com/maps/api/directions/json',
            qs: {
                origin: startString,
                destination: endString,
                alternatives: 'false',  //keep to just 1 route (set to true for additional alternative routes)
                mode: 'walking',
                key: config.gdest.apikey
            }
        };
    
        if(1){
        rp(options)
            .then((result) => {
                const data = JSON.parse(result);
                console.log('data:', data);
                // resp.status(200).json(data);
                // return;
                req.body['routes'] = data.routes;
                next();
            })
            .catch((err) => {
                console.log('getRoute err', err);
                resp.json({message: 'getRoute err'});
                return;
            })
            // .finally(() => {
            //     next();
            // });
        }else{
            const hardcodeRoutes = {};
            req.body['routes'] = hardcodeRoutes;
            next();
        }
    };


    // app.get('/getroute', endptAccess, (req, resp) => {


    //     getRoute()
    //         .then((result) => {
    //             // console.log(result);
    //             const data = JSON.parse(result);
    //             console.log(data.routes.length);
    //             resp.status(200).json(data);

    //         })
    //         .catch((err) => {
    //             resp.status(500).json({ message: err.toString() });
    //         });
    // })

    app.post('/getmap', [endptAccess, getNearestMiddleware, getRouteMiddleware], (req, resp) => {

        //hardcode for testing to reduce api calls
        if(1){
        if (!req.body['routes']) {
            resp.send('Cannot find req.body.routes');
            return;
        }

        const routeData = req.body.routes[0];

        console.log(routeData);



        const midLat = (routeData.bounds.northeast.lat + routeData.bounds.southwest.lat) / 2.0;
        const midLong = (routeData.bounds.northeast.lng + routeData.bounds.southwest.lng) / 2.0;

        const startLat = routeData.legs[0].start_location.lat;
        const startLng = routeData.legs[0].start_location.lng;

        const endLat = routeData.legs[0].end_location.lat;
        const endLng = routeData.legs[0].end_location.lng;

        const distText = routeData.legs[0].distance.text;
        const durText = routeData.legs[0].duration.text;

        const routeStr = routeData.overview_polyline.points;



        options = {
            uri: 'https://maps.googleapis.com/maps/api/staticmap',
            encoding: null,
            qsStringifyOptions: { arrayFormat: 'repeat' },
            qs: {
                center: midLat + ',' + midLong,
                zoom: '16',
                path: 'weight:3|color:red|enc:' + routeStr,
                markers: [
                    'size:large|color:red|label:S|' + startLat + ',' + startLng,
                    'size:large|color:red|label:E|' + endLat + ',' + endLng
                ],
                size: '640x640',
                key: config.gmap.apikey
            }
        };

        console.log(options);

        rp(options)
            .then((result) => {
                console.log(result);

                fs.writeFile('map.png', result, null, (err) => {
                    if (err)
                        throw err
                    console.log('File saved.');

                    fs.readFile('map.png', 'base64', (err, imgFile) => {
                        if (err)
                            throw err
                        console.log('File read.');
            
                        // console.log('imgFile: ', imgFile);
            
                        // resp.status(200).type('image/png').send(imgFile);
            
                        // resp.status(200).type('text/html').send(`<img src="data:image/png;base64,${imgFile}">`); //this works :)
    
                        //massage data
    
                        const dataObj = {
                            distance: distText,
                            duration: durText,
                            img: imgFile
                        }
    
                        resp.status(200).json({message: dataObj});
            
                    });

                });



                

                // resp.status(200).type('image/png').send(result);
                // resp.status(200).json({message: result});

                // resp.status(200).render('index',result);

            })
            .catch((err) => {
                resp.status(500).json({ message: err });
            });
        }else{
            fs.readFile('map.png', 'base64', (err, imgFile) => {
                if (err)
                    throw err
                console.log('File read.');
    
                // console.log('imgFile: ', imgFile);
    
                // resp.status(200).type('image/png').send(imgFile);
    
                // resp.status(200).type('text/html').send(`<img src="data:image/png;base64,${imgFile}">`); //this works :)

                //massage data

                const dataObj = {
                    distance: 'Too far',
                    duration: 'Too long',
                    img: imgFile
                }

                resp.status(200).json({message: dataObj});
    
            });
        }

    })


    app.get('/dispmap', endptAccess, (req, resp) => {

        fs.readFile('map.png', 'base64', (err, imgFile) => {
            if (err)
                throw err
            console.log('File read.');

            console.log('imgFile: ', imgFile);

            // resp.status(200).type('image/png').send(imgFile);

            resp.status(200).type('text/html').send(`<img src="data:image/png;base64,${imgFile}">`); //this works :)

        });



    })

}




