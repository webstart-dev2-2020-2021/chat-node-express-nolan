import {Express} from "../express";
import {Ninja} from "./ninja";
import bcrypt = require('bcrypt');

export class User {
   
    id: number;
    email: string;
    password: string;
    is_admin: boolean;

    constructor(id: number, email: string, password: string, is_admin: boolean) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.is_admin = is_admin;
    }
    
    public static get(id: number) {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .get(`SELECT * FROM users WHERE id = ?`, [id], function(error, row) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    (row) ? resolve(new User(row.id, row.email, row.password, row.is_admin)) : resolve(false);
                    Ninja.debug("Fetched user... (Id n°" + id + ").");
                }
            });
        });
    }

    public static getAllUsers() {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .all(`SELECT * FROM users`, function(error, rows) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    let users = [];

                    rows.forEach((row) => {
                        users.push(new User(row.id, row.email, row.password, row.is_admin));
                    });

                    resolve(users);
                    Ninja.debug("Fetched all users...");
                }
            });
        });
    }

    public static exists(email: string) {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .get(`SELECT * FROM users WHERE email = ?`, [email], function(error, row) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    (row) ? resolve(new User(row.id, row.email, row.password, row.is_admin)) : resolve(false);
                    Ninja.debug("Fetched user... (Email \"" + email + "\").");
                }
            });      
        });
    }

    public static register(email: string, password: string) {
        return new Promise<number>((resolve, reject) => {
            bcrypt.genSalt(10, (error, salt) => 
                bcrypt.hash(password, salt, (error, encrypted) => {
                    if(error) throw error;

                    Express.database()
                    .run(`INSERT INTO users VALUES(?, ?, ?, ?)`, [null, email, encrypted, false], function(error) {
                        if (error) {
                            reject(console.log(error.message));
                        } else {
                            resolve(this.lastID);
                            Ninja.debug("Successfuly registered a new user. (Id n°" + this.lastID + ").");
                        }
                    });
                })
            );
        });
    }
}