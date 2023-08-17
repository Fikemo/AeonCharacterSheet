export default class Events {
    // do something next time an event triggers
    static next(name, callback) {
        if (!this._triggersOnce[name]) this._triggersOnce[name] = new Set();
        this._triggersOnce[name].add(callback);
    }

    // wait for an event to trigger before async function continues
    static async nextAsync(name) {
        return new Promise(resolve => {
            this.next(name, resolve);
        })
    }

    // register an event
    static on(name, callback) {
        if (!this._triggers[name]) this._triggers[name] = new Set();
        this._triggers[name].add(callback);
    }

    // remove a callback from being triggered by an event
    static off(name, callback) {
        this._triggers[name]?.delete(callback);
        this._triggersOnce[name]?.delete(callback);
    }

    // triggers an event
    static emit(name, args) {
        this._triggers[name]?.forEach(callback => callback(args));
        this._triggersOnce[name]?.forEach(callback => callback(args));
        this._triggersOnce[name]?.clear();
    }
}

Events._triggers = {};
Events._triggersOnce = {};