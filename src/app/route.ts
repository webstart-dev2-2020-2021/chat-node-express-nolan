import {Request, Response, Router} from "express";
import {Express} from "./express";
import passport = require('passport');
import {User} from './models/user';
import {Channel} from './models/channel';
import {Message} from './models/message';
import {Regex} from './models/regex';
import {Auth} from './models/auth';

export class Route {

    public static init(router: Router, ) {
        const route = new Route();

        router.all("*", (request: Request, response: Response, next) => {
            response.locals['page'] = String(request.path.split(/\//g)[1]);
                
            if (request.app.get('alert') != "") {
                response.locals['alert'] = request.app.get('alert');
                request.app.set('alert', "");
            }

            next();
        });

        router.get("/", (request: Request, response: Response) => response.redirect("/signin"));
        
        router.get("/signup", (request: Request, response: Response) => route.viewSignup(request, response));
        router.get("/signin", (request: Request, response: Response) => route.viewSignin(request, response));

        router.post("/signup", (request: Request, response: Response, next) => route.postSignup(request, response, next));
        router.post("/signin", (request: Request, response: Response, next) => route.postSignin(request, response, next));

        router.all("*", (request: Request, response: Response, next) => {
            Auth.ensure(request, response, next);
            
            response.locals['user'] = request.user;
        });

        router.get("/hello", (request: Request, response: Response) => route.viewDefault(request, response));
        router.get("/channel/:id", (request: Request, response: Response) => route.viewChannel(request, response));
        router.get("/admin", (request: Request, response: Response) => route.viewAdmin(request, response));
        router.get("/disconnect", (request: Request, response: Response) => route.postDisconnect(request, response));

        router.all("*", (request: Request, response: Response) => response.redirect("/hello"));
    }

    private viewSignup(request: Request, response: Response) {
        response.locals['sidebar'] = "about";
        response.render("signup");
    }

    private viewSignin(request: Request, response: Response) {
        response.locals['sidebar'] = "about";
        response.render("signin");
    }

    private viewAdmin(request: Request, response: Response) {
        response.locals['sidebar'] = "channels";

        Promise
            .all([User.getAllUsers(), Channel.getAllChannels()])
            .then(values => {
                response.locals['users'] = values[0];
                response.locals['channels'] = values[1];

                response.render("admin");
            });
    }

    private viewDefault(request: Request, response: Response) {
        response.locals['sidebar'] = "channels";

        Promise
            .all([Channel.getAllChannels()])
            .then(values => {
                response.locals['channels'] = values[0];

                response.render("default");
            });
    }

    private viewChannel(request: Request, response: Response) {
        response.locals['sidebar'] = "channels";

        Promise
            .all([Channel.getAllChannels() ,Channel.get(Number(request.params.id)), Message.retrieveFromChannel(Number(request.params.id))])
            .then(values => {
                response.locals['channels'] = values[0];
                response.locals['channel'] = values[1];
                response.locals['messages'] = values[2];
                
                response.render("channel");
            });
    }

    private postSignup(request: Request, response: Response, next) {
        let validated = true;

        if (!Regex.EMAIL.test(request.body.email)) {
            request.app.set('alert', "Enter a valid email.");
            validated = false;
        } else if (!Regex.PASSWORD.test(request.body.password)) {
            request.app.set('alert', "Your password must contain a lower case letter, upper case letter and a number. And having a length between 8 and 16 characters.");
            validated = false;
        } else if (request.body.password != request.body.confirmPassword) {
            request.app.set('alert', "Passwords must be equals.");
            validated = false;
        }

        if (!validated) return response.redirect('/signup');

        Promise
            .resolve(User.exists(request.body.email))
            .then(user => {
                if (user) {
                    request.app.set('alert', "This email is already registered.");
                    return response.redirect('/signup');
                }

                Promise
                    .resolve(User.register(request.body.email, request.body.password))
                    .then(id => {
                        this.postSignin(request, response, next);
                    });
            });

    }

    private postSignin(request: Request, response: Response, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { 
                request.app.set('alert', "Incorrect password.");
                return response.redirect("/signin"); 
            }

            request.logIn(user, function(err) {
                if (err) { return next(err); }

                request.app.set('alert', "You've been connected.");
                return response.redirect("/hello");
            });
        })(request, response, next);
    }

    private postDisconnect(request: Request, response: Response) {
        request.app.set('alert', "You successfully disconnected.");

        request.logout();
        return response.redirect('/signin');
    }
}