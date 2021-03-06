import sqlite3 = require('sqlite3');
import path = require("path");
import {Express} from "../express";

export class Database {
	database: sqlite3;

	constructor() {
        this.database = new sqlite3.Database(path.resolve('src/static/db/ninja.db'));
    }

    public get() {
    	return this.database;
    }

	public static getUsers() {

		return new Promise(resolve => {
			let users: Array<User> = [];

			NinjaData.database()
				.each(`SELECT * FROM users`, function(error, row) {			    	
			    	users.push(new User(row.ID, row.EMAIL, row.PASSWORD, row.IS_ADMIN));

			    }, (error, count) => {

	            	resolve(users);

				})
				.close();
		});
	}

	public static verifyUser(request) {

		const user = new User(null, null, null, null);
		return user;
	}


	public static getChannelsByUserId() {
		let userchannels: Array<string> = [];
        return userchannels;
	}
}