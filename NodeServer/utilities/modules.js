//TryCatch 

//Factory (Singleton) - Create structure to parse data 
class Factory {
    constructor() { 
    }
    createClass(){
    }
}

//[0] = Ref points Dictionary Above and Below
const Origin = {name:"Marika", coordinate: [102,-605]}

//Player Npcs
class Entity{
    constructor(location){
        this.location = location
    }
}

class Player extends Entity {
    constructor(location){
        super()
    }
}

class NPC extends Entity {
    constructor(){}
}
