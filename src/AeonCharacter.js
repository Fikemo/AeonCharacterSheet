export default class AeonCharacter {
    constructor (config) {
        if (config) {
            this.data = config;
        } else {
            this.data = {};
        }
    }

    setName(name) {
        this.data.name = name;
    }

    setFromJson(json) {
        json = JSON.parse(json);
        this.data = json;
    }

    getJson() {
        return JSON.stringify(this);
    }
}