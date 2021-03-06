import {Express} from "../express";

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

    public static add(data: object) {

        return new Promise<void>((resolve, reject) => {

            Express.database()
            .run(`INSERT INTO users VALUES(?, ?, ?, ?)`, [null, request.body.email, request.body.password, false], function(error) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    resolve(this.lastID);
                    console.log("A new user registered under email address " + request.body.email + " (ID " + this.lastID + ")");
                }
            })
            .close();
        });
    }

    public static delete(id: number) {
        return new Promise<void>((resolve, reject) => {

            Express.database()
            .run(`DELETE FROM users WHERE id = ` + id, function(error) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    resolve(this.lastID);
                }
            })
            .close();
        });
    }
}