export class Regex {
	static readonly EMAIL = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	static readonly PASSWORD = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/);

	private constructor(private readonly key: string, public readonly value: any) {
	
	}
}