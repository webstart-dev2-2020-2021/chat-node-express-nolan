import {Server, Socket} from "socket.io";

export class Listeners {

	private io: Server;

	private constructor(io) {
		this.io = io;
	}

	public static build(io) {
		return new Listeners(io);
	}

	public init() {
		this.io.on("connection", socket => {
			socket.on("message", (message, channel) => {
				console.log(message, channel)
			});
		});
	}
}