export default class Util {
    constructor(){
        this.names = ['a','b']
    }
    static getRandomName(){
        return this.names[Math.floor(Math.random() * this.names.length)]
    }
}