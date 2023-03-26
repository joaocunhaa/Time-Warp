class State {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    export() {
        return this.name;
    }
}

module.exports = State;