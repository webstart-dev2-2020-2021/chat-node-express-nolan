import {Express} from "../express";
import {Ninja} from "./ninja";

export class Message {
   
    id: number;
    content: string;
    channel_id: number;
    author: string

    constructor(id: number, content: string, channel_id: number, author: string) {
        this.id = id;
        this.content = content;
        this.channel_id = channel_id;
        this.author = author;
    }
    
    public static get(id: number) {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .get(`SELECT * FROM messages WHERE id = ?`, [id], function(error, row) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    (row) ? resolve(new Message(row.id, row.content, row.channel_id, row.author)) : resolve(false);
                    Ninja.debug("Fetched message... (Channel id n°" + row.channel_id + ").");
                }
            });
        });
    }

    public static retrieveFromChannel(id: number) {
        return new Promise<any>((resolve, reject) => {
            Express.database()
            .all(`SELECT * FROM messages WHERE channel_id = ` + id, function(error, rows) {
                if (error) {
                    reject(console.log(error.message));
                } else {
                    let messages = [];

                    rows.forEach((row) => {
                        messages.push(new Message(row.id, row.content, id, row.author));
                    });

                    resolve(messages);
                    Ninja.debug("Fetched all messages... (Channel id n°" + id + ").");
                }
            });
        });
    }
}