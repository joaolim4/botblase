const mysql = require("mysql2/promise");

function getFormatDate(){
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let day = ("0" + date_ob.getDate()).slice(-2);
    var dateF = year+month+day;
    return dateF;
}

async function connect(){
    if(global.connetion && global.connetion.state !== 'disconnected'){
         return global.connetion;
    }else {
        const connetion = await mysql.createConnection("mysql://root:@localhost:3306/bot_bd");
        global.connetion = connetion;
        return connetion;
    }
}

async function saveStrategy(strategy){
    const connection = await connect();
    const prepare = 'INSERT INTO bot_strategys VALUES(NULL,?,?,?,?,NULL,"[]",NULL)'
    await connection.query(prepare, [strategy.name, JSON.stringify(strategy.deps), strategy.gales, strategy.signal])
    console.log("Estratégia criada, já foi adicionada ao algoritmo!") 
}

async function getStrategy(){
    const connection = await connect();
    const prepare = 'SELECT * FROM bot_strategys'
    const [rows] = await connection.query(prepare, [])
    return rows
}   

async function getStrategyWins(name){
    const connection = await connect();
    const prepare = 'SELECT * FROM bot_strategys WHERE name = ?'
    const [rows] = await connection.query(prepare, [name])
    return rows[0]
}  

async function addStrategyLoss(strategy){
    const connection = await connect();
    const prepare = 'UPDATE bot_strategys SET loss = loss + 1 WHERE name = ?'
    const [rows] = await connection.query(prepare, [strategy])
    return rows
}  


async function addStrategyWin(strategy, gale){
    var table = await getStrategyWins(strategy)
    var wins = table.wins
    if(wins){
        wins = JSON.parse(wins)
        if(wins[gale]){
            wins[gale] = wins[gale] + 1
        }else{
            wins[gale] =  1
        }
    }else{
        wins = []
        wins[gale] = 1
    }
    wins = JSON.stringify(wins)
    const connection = await connect();
    const prepare = 'UPDATE bot_strategys SET wins = ? WHERE name = ?'
    await connection.query(prepare, [wins, strategy])
}   

async function clearAllStrategysWinsAndLoss(date){
    const connection = await connect();
    const prepare = 'UPDATE bot_strategys SET wins = "[]", loss = 0, date = ? '
    const [rows] = await connection.query(prepare, [date])
    return rows
}


module.exports = {saveStrategy, getStrategy, addStrategyLoss, addStrategyWin, clearAllStrategysWinsAndLoss}