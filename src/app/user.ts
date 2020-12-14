import {Response} from "express";

export class User {
   
    id: number;
    email: string;
    password: string;
    is_admin: boolean;

    constructor(id: number, email: string, password: string, is_admin: boolean) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.is_admin = is_admin
    }

    public connect(response: Response) {
    	response.redirect("/chat");
        
    }

    public disconnect(response: Response) {
    	response.redirect("/signin");

    }
}