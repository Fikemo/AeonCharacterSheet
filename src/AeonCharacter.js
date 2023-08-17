export default class AeonCharacter {
    constructor (json) {
        this.name = "";
        this.description = "";
        this.stats = {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10
        };
        this.abilities = [];
        this.skills = [];
        this.equipment = [];
        this.notes = "";

        if (json) {
            this.setFromJson(json);
        }
    }

    setFromJson(json) {
        json = JSON.parse(json);
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                this[key] = json[key];
            }
        }
    }

    getJson() {
        return JSON.stringify(this);
    }
}