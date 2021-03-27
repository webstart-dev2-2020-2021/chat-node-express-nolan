import {Express} from "../express";
import {Ninja} from "./ninja";
import {User} from './user';
import {Message} from './message';

export class Channel {
   
    id: number;
    name: string;
    description: string;
    color: string;
    selfBot: User;

    constructor(id: number, name: string, description: string, color: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.selfBot = new User(0, name, null, true);
    }

    public send(message: Message) {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .run(`INSERT INTO messages values(?, ?, ?, ?)`, [null, message.content, message.channel_id, message.author], function(error, row) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    resolve(this.lastID);
                    Ninja.debug("Successfuly registered a new message. (Channel id n°" + message.channel_id + ").");
                }
            });
        });
    }
    
    public static get(id: number) {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .get(`SELECT * FROM channels WHERE id = ?`, [id], function(error, row) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    (row) ? resolve(new Channel(row.id, row.name, row.description, row.color)) : resolve(false);
                    Ninja.debug("Fetched channel... (Id n°" + id + ").");
                }
            });
        });
    }

    public static getAllChannels() {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .all(`SELECT * FROM channels`, function(error, rows) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    let channels = [];

                    rows.forEach((row) => {
                        channels.push(new Channel(row.id, row.name, row.description, row.color));
                    });

                    resolve(channels);
                    Ninja.debug("Fetched all channels...");
                }
            });
        });
    }
}