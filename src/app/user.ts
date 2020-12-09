import {Response} from "express";

export class User {
   
    id: number;
    email: string;
    password: string;

    constructor(id: number, email: string, password: string) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public connect(response: Response) {
    	response.redirect("/chat");
    }

    public disconnect(response: Response) {
    	response.redirect("/signin");

    }
}