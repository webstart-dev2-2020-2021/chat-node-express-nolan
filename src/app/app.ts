import {Express, ServerOptions} from './express';
import {Server, Socket} from "socket.io";
import {Listeners} from "./models/listeners";
import * as http from 'http';

const options = {
    static: 'src/static',
    port: 8080
} as ServerOptions;

const instance = Express.bootstrap(options).app;
const server = http.createServer(instance);

Listeners
	.build(new Server(server))
	.init();

server
	.listen(options.port)
    .on("listening", () => console.debug('Server listening on port ' + options.port));
