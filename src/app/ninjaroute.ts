import {Request, Response, Router} from "express";
import {NinjaData} from './data';
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

        router.post("/disconnect", (request: Request, response: Response) => ninja.postDisconnect(request, response));
        router.post("/signup", (request: Request, response: Response) => ninja.postSignup(request, response));
        router.post("/signin", (request: Request, response: Response) => ninja.postSignin(request, response));

        router.all("*", (request: Request, response: Response) => response.redirect("/chat"));
    }

    private viewSignup(request: Request, response: Response) {
        response.render('signup');
    }

    private viewSignin(request: Request, response: Response) {
        response.render('signin');
    }

    private async viewAdmin(request: Request, response: Response) {
        response.locals['layout'] = "main_sidebar";

        response.locals['channels'] = await NinjaData.getChannelsByUserId();
        response.locals['users'] = await NinjaData.getUsers();

        response.render('admin');
    }

    private async viewChat(request: Request, response: Response) {
        response.locals['layout'] = "main_sidebar";

        response.locals['channels'] = await NinjaData.getChannelsByUserId();

        response.render('chat');
    }

    private async postSignup(request: Request, response: Response) {
        const id = Number(await NinjaData.addUser(request));

        const user = new User(id, request.body.email, request.body.password);
        user.connect(response);
        console.log(user.email);
        console.log(user.password);
    }

    private async postSignin(request: Request, response: Response) {
        const user = await NinjaData.verifyUser(request);
        user.connect(response);
    }

    private async postDisconnect(request: Request, response: Response) {
        const user = new User(null, null, null);
        user.disconnect(response);
    }
}