import {Express, ServerOptions} from './express';
import * as http from 'http';

const options = {
    static: 'src/static',
    port: 8080
} as ServerOptions;

const server = Express.bootstrap(options).app;

http.createServer(server)
    .listen(options.port)
    .on("listening", () => console.debug('Server listening on port ' + options.port));

