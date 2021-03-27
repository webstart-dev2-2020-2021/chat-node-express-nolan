import sqlite3 = require('sqlite3');
import path = require("path");
import {Express} from "../express";

export class Database {
	database: sqlite3;

	constructor() {
        this.database = new sqlite3.Database(path.resolve('src/static/ninja.db'));
    }

    public get() {
    	return this.database;
    }
}