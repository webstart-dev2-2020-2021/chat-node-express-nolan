import * as express from 'express';
import * as handlebars from 'express-handlebars';
import errorHandler = require("errorhandler");
import {NinjaRoute} from "./ninjaroute";
import bodyParser = require("body-parser");
import path = require("path");

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
    	NinjaRoute.init(router);

        this.app
            .engine('handlebars', handlebars())
	        .set('view engine', 'handlebars')
	        .enable('view cache')
	        .enable('trust proxy')
	        .set('views', path.join(__dirname + '/../src/views/'))
	        .use(bodyParser.urlencoded({extended: true}))
            .use(bodyParser.json())
            .use('/static', express.static(__dirname + '/../' + this.options.static))
	        .use(router)
            .use(errorHandler());
    }

    public static bootstrap(options: ServerOptions): Express {
        console.log("Initializing the server...");
        return new Express(options);
    }
}