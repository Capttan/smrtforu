
const protected = require('./protected');
// const config = require('../config');
const config = require('../config_prod');
const dbutil = require('../dbutil');
const ac = require('accesscontrol');


// add express-session
const session = require('express-session');
// load Passport
const passport = require('passport');

// load one or more strategies
const LocalStrategy = require('passport-local').Strategy;

const FIND_USER = 'select count(*) as user_count from users where username = ? and password = sha2(?, 256)';
const GET_USER_DETAILS = 'select u.username,r.role,w.walletvalue,u.id from users as u join roles as r on u.id = r.userid join wallets as w on u.id= w.userid where u.username = ?';



const acFunction = (req, resp, next) => {

    const grants = [{ role: 'user', resource: '/profile', action: 'read:own' }];
    req.accessControl = new ac(grants);

    console.log('user: ', req.user);
    console.log('url: ', req.originalUrl);
    req.role = 'user';

    const permission = req.accessControl.can(req.role).readOwn(req.originalUrl); //granted
    // const permission = req.accessControl.can(req.role).readAny(req.originalUrl); //forbidden

    if (!permission.granted) {
        resp.status(403).json({ message: "Forbidden" });
        return;
    }

    next();
}




module.exports = function (app, pool) {

    const findUser = dbutil.mkQuery(FIND_USER, pool); //creates a query function which uses query "FIND_USER" and connection "pool"
    const getUserDetails = dbutil.mkQuery(GET_USER_DETAILS, pool);


    const authenticateUser = (param) => {
        return (
            findUser(param)
                .then(result => (result.length && result[0].user_count > 0))
        )
    }


    // Configure passport to use LocalStrategy
    passport.use(new LocalStrategy(
        {
            usernameField: 'username',
            // in the post body there is a key with name 'username', this is the username of authenticator
            passwordField: 'password',
            // in the post body there is a key with name 'password', this is the password of authenticator
            passReqToCallback: true
        },
        // authenticate - callback
        (req, user, pass, done) => {
            console.info(`user: ${user}, pass: ${pass}`);
            authenticateUser([user, pass])
                .then(result => {
                    console.info('after authentication: ', result)
                    req.authenticated = result;
                    if (result) {
                        req.loginAt = new Date();
                        // authenticated
                        return done(null, user)
                    }
                    // incorrect username/password
                    done(null, false);
                })
                .catch(error => {
                    console.error('authentication db error: ', error);
                    done(null, false)
                })
        }
    ))
    // serialize user 
    // save the user to the session -> create session_id cookie
    passport.serializeUser(
        (user, done) => {
            console.info('** Serialize user: ', user)
            done(null, user);
        }
    )
    // deserialize user 
    // retrieve the user profile from database and pass it to passport
    // passport will attach the user details to req.user
    passport.deserializeUser(
        (user, done) => {
            console.info('++ Deserialize user: ', user)
            getUserDetails([user])
                .then(result => {
                    // console.info('result from deserialize ', result)
                    if (result.length)
                        return done(null, result)
                    done(null, user)
                })
        }
    )


    // Configure session support for express
    // must be before initialize()
    app.use(session({
        secret: config.passport.sessionSecret,
        name: 'session_id', // session name -> cookie name
        resave: true,
        saveUninitialized: true,
        // cookie: {
        //             maxAge: 30000 //timeout in ms
        //         }
    }))



    // Add passport to the request route
    // Must be after urlencoded
    app.use(passport.initialize())
    // Get passport to use session
    app.use(passport.session())

    // console.log(passport.authenticate()+'');


    app.get('/profile', acFunction, (req, resp) => {

        console.log('profile!!');

        resp.status(200).json({ access: "Granted" });
    })


    app.get('/authsec',
        (req, resp, next) => {
            console.log('secure_printout:', req['user']);
            if (!(req['user'])) {
                resp.json({messsage: 'no access'});
            } else {
                return next();
                // return resp.send('ok pass');
                // resp.redirect(301, '/index.html');
                // resp.send('wtf is going on');
            }
        },
        (req, resp) => {
            console.log('passed next()');
            resp.json({message: 'next() success'});
        });


    app.use('/securecheck',
        (req, resp, next) => {
            console.info('>>>>>>user = ', req['user']);
            console.info('logic', !!(req['user']));

            const logic = !!(req['user']);
            resp.json({ reqObj: logic });
        });

    app.post('/authenticateOld',
        // Use LocalStrategy to authenticate
        passport.authenticate('local', {
            successRedirect: '/success.html',
            failureRedirect: '/error.html'
        })
    )


    app.post('/authenticate', (req, res, next) => {
        console.log('New auth!');
        console.log('body: ', req.body);
        passport.authenticate('local', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                // return res.redirect('/error.html'); 
                return res.json({login:false});
            }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                //return res.redirect('/success.html');
                return res.json({login:true});
            });
        })(req, res, next);
    });

    app.get('/logout', (req, resp) => {
        req.logout();
        // res.redirect('/');
        // resp.send('logout');
        resp.json({login:false});
    })

    app.get('/details', (req, resp) => {

        console.log('in details');
        resp.json({
            'user': req.user,
            'sessions': req.session
        });
    })


}