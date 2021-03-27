export class Ninja { 

	public static fixDate(date: number) {
		return ((date < 10) ? "0" : "") + date;
	}

	public static getCurrentClock() {
		const current = new Date();
		return Ninja.fixDate(current.getHours()) + ":" + Ninja.fixDate(current.getMinutes()) + " ";
	}

	public static debug(message) {
		console.debug(Ninja.getCurrentClock() + message);
	}
}