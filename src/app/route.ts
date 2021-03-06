import {Request, Response, Router} from "express";
import {User} from './models/user';

export class Route {

    constructor() {
        
    }

    public static init(router: Router) {
        const ninja = new Route();

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
        if (request.app.get('alert')) {    
            response.locals['alert'] = request.app.get('alert');
            request.app.set('alert', null);
        } 

        response.render('signup');
    }

    private viewSignin(request: Request, response: Response) {
        if (request.app.get('alert')) {
            response.locals['alert'] = request.app.get('alert');
            request.app.set('alert', null);
        }

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
        if (request.body.email.includes("@") 
            && /\d/.test(request.body.password)
            && request.body.password.length > 8 
            && request.body.password.length < 20) {

            const id = Number(await NinjaData.addUser(request));

            const user = new User(id, request.body.email, request.body.password, false);
            user.connect(response);
            console.log(user.email);
            console.log(user.password);
        } else {
            request.app.set('alert', "Votre email et mot de passe doivent être valides.");
            response.redirect("/signup");
        }
    }

    private async postSignin(request: Request, response: Response) {
        if (request.body.email.includes("@")) {
            const user = await NinjaData.verifyUser(request);
            user.connect(response);
        } else {
            request.app.set('alert', "Votre email doit être valide.");
            response.redirect("/signin");
        }
    }

    private async postDisconnect(request: Request, response: Response) {
        const user = new User(null, null, null, null);
        user.disconnect(response);
    }
}