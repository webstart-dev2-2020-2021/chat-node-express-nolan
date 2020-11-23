import {Request, Response, Router} from "express";
import {Channel} from './channel';
import {User} from './user';

export class NinjaRoute {

    constructor() {
        
    }

    public static init(router: Router) {
        const ninja = new NinjaRoute();

        router.get("/chat", (request: Request, response: Response) => ninja.viewChat(request, response));
        router.get("/signup", (request: Request, response: Response) => ninja.viewSignup(request, response));
        router.get("/signin", (request: Request, response: Response) => ninja.viewSignin(request, response));
        router.get("/admin", (request: Request, response: Response) => ninja.viewAdmin(request, response));

        router.post("/signup", (request: Request, response: Response) => ninja.addUser(request, response));
        router.post("/signin", (request: Request, response: Response) => ninja.connectUser(request, response));

        router.all("*", (request: Request, response: Response) => ninja.viewChat(request, response));
    }

    private viewSignup(request: Request, response: Response){
        response.locals['title'] = "Ninja - Signup";
        response.locals['favicon'] = "static/favicon.png";
        response.render('signup');
    }

    private addUser(request: Request, response: Response){
        
    }

    private deleteUserById(request: Request, response: Response) {

    }

    private viewSignin(request: Request, response: Response){
        response.locals['title'] = "Ninja - Signin";
        response.locals['favicon'] = "static/favicon.png";
        response.render('signin');
    }

    private connectUser(request: Request, response: Response){
        
    }

    private viewAdmin(request: Request, response: Response){
        response.locals['title'] = "Ninja - Admin";
        response.locals['favicon'] = "static/favicon.png";
        response.locals['layout'] = "main_sidebar";
        response.locals['channels'] = this.getChannels(request, response);  

        response.render('admin');
    }

    private viewChat(request: Request, response: Response){
        response.locals['title'] = "Ninja - EncryptedChat";
        response.locals['favicon'] = "static/favicon.png";
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
}