import * as express from 'express';
import * as expressHandlebars from 'express-handlebars';
import errorHandler = require("errorhandler");
import {Route} from "./route";
import {Database} from "./models/database";
import bodyParser = require("body-parser");
import path = require("path");
import passport = require('passport');
import {User} from './models/user';
import passportLocal = require('passport-local');
import session = require('express-session');
import bcrypt = require('bcrypt');

export interface ServerOptions {
    static: string;
    port: number;
}
    
export class Express {

    public app: express.Application;

    constructor(public options: ServerOptions) {
        this.app = express();

        this.config();
        this.app.set('port', this.options.port);
    }

    public config() {

    	const router = express.Router();
    	Route.init(router);

        let handlebars = expressHandlebars.create({
            helpers: {
                toCapitalize: function (str) { return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1); },
                partial: function (str) { return str; },
            }
        });

        passport.use(
            new passportLocal.Strategy({usernameField: 'email'}, (email, password, done) => {   
                Promise
                    .resolve(User.exists(email))
                    .then(user => {
                        if (!user){
                            return done(null, false, { message:'Account not found.' });
                        }
                        bcrypt.compare(password, user.password, (error, isMatch) => { 
                            if (error) throw error;
                            return (isMatch) ? done(null, user) : done(null, false, {message: 'Password incorrect.'});
                        })
                    })
                    .catch((err)=> {
                        console.log(err)
                    });
            })
        )

        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser(function(user, done) {
            done(null, user);
        });

        this.app
            .engine('handlebars', handlebars.engine)
	        .set('view engine', 'handlebars')
	        .enable('view cache')
	        .enable('trust proxy')
	        .set('views', path.join(__dirname + '/../src/views/'))
	        .use(bodyParser.urlencoded({extended: true}))
            .use(bodyParser.json())
            .use('/static', express.static(__dirname + '/../' + this.options.static))
            .use(
                session({
                    secret : 'd7XViPpJPi4d5vKY',
                    resave : true,
                    saveUninitialized : true,
                })
            )
            .use(passport.initialize())
            .use(passport.session())
	        .use(router)
            .use(errorHandler());
    }

    private static DATABASE: Database = new Database();

    public static database() {
        return Express.DATABASE.get();
    }

    public static bootstrap(options: ServerOptions): Express {
        console.log("Initializing the server...");
        return new Express(options);
    }
}