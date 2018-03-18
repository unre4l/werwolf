export default class Director {
    constructor() {
        this.games = []
    }

    handle(msg, ws){
        
    }

    direct(location){
        for (const game in this.games) {
            if (game.isNearBy(location)){
                return game;
            }
        }
        const game = new Game(location);
        this.games.push(game)
        return game;
    }
}