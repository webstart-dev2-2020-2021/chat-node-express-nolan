export class Channel {

    name: string;
    id: number;

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }

    public getId() {
    	return this.id;
    }

    public getName() {
        return this.name;
    }

    public setId(id: number) {
        this.id = id;
        return this;
    }

    public setName(name: string) {
        this.name = name;
        return this;
    }
}