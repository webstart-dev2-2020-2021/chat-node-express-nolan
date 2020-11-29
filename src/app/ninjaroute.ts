import {Request, Response, Router} from "express";
import {Channel} from './channel';
import {User} from './user';

export class NinjaRoute {

    constructor() {
        
    }

    public static init(router: Router) {
        const ninja = new NinjaRoute();

        router.all('*', (request, response, next) => {
            response.locals['page'] = String(request.url.split('/')[1]);
            response.locals['favicon'] = "static/favicon.png";
            next();
        });

        router.get("/chat", (request: Request, response: Response) => ninja.viewChat(request, response));
        router.get("/signup", (request: Request, response: Response) => ninja.viewSignup(request, response));
        router.get("/signin", (request: Request, response: Response) => ninja.viewSignin(request, response));
        router.get("/admin", (request: Request, response: Response) => ninja.viewAdmin(request, response));

        router.post("/disconnect", (request: Request, response: Response) => ninja.disconnectUser(request, response));
        router.post("/signup", (request: Request, response: Response) => ninja.addUser(request, response));
        router.post("/signin", (request: Request, response: Response) => ninja.connectUser(request, response));

        router.all("*", (request: Request, response: Response) => response.redirect("/chat"));
    }

    private viewSignup(request: Request, response: Response) {
        response.render('signup');
    }

    private viewSignin(request: Request, response: Response) {
        response.render('signin');
    }

    private viewAdmin(request: Request, response: Response) {
        response.locals['layout'] = "main_sidebar";
        response.locals['channels'] = this.getChannels(request, response);  

        response.render('admin');
    }

    private viewChat(request: Request, response: Response) {
        response.locals['layout'] = "main_sidebar";
        response.locals['channels'] = this.getChannels(request, response);  

        response.render('chat');
    }

    private getChannels(request: Request, response: Response) {
        let channels: Array<Channel> = [];
        return channels;
    }

    private getUsers(request: Request, response: Response) {
        let users: Array<User> = [];
        return users;
    }

    private disconnectUser(request: Request, response: Response) {
        // disconnect user
        response.redirect("/signin");
    }

    private connectUser(request: Request, response: Response) {
        // sqlite check and connect user
        response.redirect("/chat");
    }

    private addUser(request: Request, response: Response) {
        // sqlite insertion
        this.connectUser(request, response);
    }

    private deleteUserById(request: Request, response: Response) {
        this.viewAdmin(request, response);
    }
}