import {Server, Socket} from "socket.io";
import {Message} from './message';
import {Channel} from './channel';

export class Listeners {

	private io: Server;

	private constructor(io: Server) {
		this.io = io;
	}

	public static build(io) {
		return new Listeners(io);
	}

	public init() {
		this.io.on("connection", socket => {
			socket.on("message", (message, channel) => {
				Promise
					.resolve(Channel.get(channel.id))
					.then(channel => {
						const newMessage = new Message(null, message.content, channel.id, message.author);
						Promise
							.resolve(channel.send(newMessage))
							.then(id => {
								newMessage.id = id;
								socket.emit("update", newMessage, channel);
							});
					})
			});
		});
	}
}