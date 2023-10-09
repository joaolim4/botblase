const send = require('./telegram')
const bd = require('./bdfunctions')
var waitResult = []

function getNumberType(number){
    if(number == 0){
        return 'white'
    }else if(number >= 1 && number <= 7){
        return 'red';
    }else if(number >= 8 && number <= 14){
        return 'black';
    }
}

function valide(dependencies, results){
    let tryvalid = true
    let lastIndice = dependencies.length-1
    for(var i = 0; i  < dependencies.length; i ++){
        if(tryvalid){
            if(dependencies[i] == results[lastIndice-i] || dependencies[i] == getNumberType(parseInt(results[lastIndice-i]))){
                tryvalid = true
            }else {
                tryvalid = false
            }
        }
    }
    return tryvalid
}

function addToWait(toArray, resultL){
    for(var i = 0; i < waitResult.length; i ++){
        if(waitResult[i].name != toArray.name){
            continue;
        }else{
            return false;
        }
    }
    waitResult.push(toArray)
    send.sendSignal(toArray.result, toArray.name, toArray.max_gales, resultL)
    
}

function getAlgorithm(myStrategys, results, today){
    for(var i = 0; i < myStrategys.length; i ++){
        let dependencies = JSON.parse(myStrategys[i].dependencies)
        if(valide(dependencies, results)){
            let toArray = {
                gale: 0,
                max_gales: parseInt(myStrategys[i].gales),
                result: myStrategys[i].result,
                name: myStrategys[i].name
            }
            addToWait(toArray,results[0] )
        }
    }
}



function getResults(results){
     for(var i = 0; i < waitResult.length; i ++){
        element = waitResult[i]
        if(element.gale < element.max_gales){
            if(results[0] == element.result || getNumberType(parseInt(results[0])) == element.result){
                if (element.gale == 0){
                    send.sendWin(element.result,element.name, 'Win de primeira!')
                    bd.addStrategyWin(element.name, 0)
                }else{
                    send.sendWin(element.result,element.name, 'Win no gale !'+element.gale)
                    bd.addStrategyWin(element.name, element.gale)
                }
                waitResult.splice(i, 1);
            }else{
                waitResult[i].gale = element.gale + 1
            }
        }else{
            waitResult.splice(i, 1);
            send.sendLoss(element.result,element.name)
            bd.addStrategyLoss(element.name)
        }
    }
}

function clearWaitSignals(){
    waitResult = []
}

module.exports = {getAlgorithm, clearWaitSignals, getResults}