import sqlite3 = require('sqlite3');
import {Request} from "express";
import {Channel} from './channel';
import {User} from './user';
import path = require("path");

export class NinjaData {
	public static database() {
		return new sqlite3.Database(path.resolve('src/static/db/ninja.db'));
	}

	public static addUser(request: Request) {

		return new Promise<void>((resolve, reject) => {

		NinjaData.database()
			.run(`INSERT INTO users VALUES(?, ?, ?)`, [null, request.body.email, request.body.password], function(error) {
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

	public static deleteUserById(_callback) {
		//
	}

	public static getUsers() {

		return new Promise(resolve => {
			let users: Array<User> = [];

			NinjaData.database()
				.each(`SELECT * FROM users`, function(error, row) {			    	
			    	users.push(new User(row.ID, row.EMAIL, row.PASSWORD));

			    }, (error, count) => {

	            	resolve(users);

				})
				.close();
		});
	}

	public static verifyUser(request) {

		const user = new User(null, null, null);
		return user;
	}


	public static getChannelsByUserId() {
		let userchannels: Array<string> = [];
        return userchannels;
	}
}