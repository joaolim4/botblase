const { Telegraf } = require('telegraf');

const token  = "6242288436:AAEKJssgmbE02iDRtBoT0B29RkTRJJ_KBA8"
const defaultChat = -814887402

const customChats = []

const bot = new Telegraf(token)
function sendMessage(message, strategy){
    if(customChats[strategy]){
        let chats = customChats[strategy]
        for(var i = 0; i < chats.length; i ++){
            bot.telegram.sendMessage(chats[i],message)
        }
    }else {
        bot.telegram.sendMessage(defaultChat,message)
    }
  
}

function getPercent(wins, loss, allins){
    let winp = (wins/100) * allins
    let lossp = (loss/100) * allins
    return lossp, winp
}

function sendSignal(result,strategy, gales, recent, wins, loss, allins){
    let lossP, winsP = getPercent(wins, loss, allins)
    if(result == 'black'){
        result = '⚫ PRETO'
    }else if (result == 'red'){
        result = '🔴 VERMELHO'
    }else {
        result = '⚪ BRANCO'
    }

    if(recent > 7){
        recent = '⚫ '+recent+' PRETO'
    }else if (recent < 8 && recent > 0){
        recent = '🔴 '+recent+' VERMELHO'
    }else {
        recent = '⚪ '+recent+' BRANCO'
    }
    sendMessage(`
Sinal de entrada ⚪🔴⚫!

Emtrada: `+result+`

Após: `+recent+`

`+gales+` Gales ✳️

Estratégia: `+strategy+`
`)
}

function sendWin(result,strategy, gale){
    if(result == 'black'){
        result = '⚫ PRETO'
    }else if (result == 'red'){
        result = '🔴 VERMELHO'
    }else {
        result = '⚪ BRANCO'
    }

    sendMessage(`
Vitória ✳️✳️✳️!

Emtrada: `+result+`

Estratégia: `+strategy+`

`+gale+` ✳️
`)
}

function sendLoss(result,strategy){
    if(result == 'black'){
        result = '⚫ PRETO'
    }else if (result == 'red'){
        result = '🔴 VERMELHO'
    }else {
        result = '⚪ BRANCO'
    }
    sendMessage(`
Derrota 🔴🔴🔴!

Emtrada: `+result+`

Estratégia: `+strategy+`

`)
}

module.exports = {sendSignal, sendWin, sendLoss}