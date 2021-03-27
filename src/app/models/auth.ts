import {Request, Response} from "express";

export class Auth {

	public static ensure(request: Request, response: Response, next) {
		if(request.isAuthenticated()) {
             return next();
        }
        
    	request.app.set('alert', "Please login first.");
    	response.redirect('/signin');
	}
} 