const readline = require('readline'); 
const puppeteer = require('puppeteer')
const bd = require('./bdfunctions')
const IA = require('./IA');
const records = require('./records');

var myStrategys = []
var saveRecords = []
var today = false
var browser = false
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function getFormatDate(){
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let day = ("0" + date_ob.getDate()).slice(-2);
    var dateF = year+month+day;
    return Number(dateF);
}

async function getPreviews(){
    browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    await page.goto('https://blaze.com/pt/games/double')
    while (true){
        var result = await page.evaluate(()=>{
            var table = []
            var documentS =  document.querySelectorAll('#roulette-recent .sm-box');
            for(var i = 0; i < documentS.length; i ++){
                if (documentS[i].classList.contains('white')){
                    table[i] = 0
                }else {
                    table[i] = parseInt(documentS[i].children[0].innerHTML)
                }
            }
            return table
        })
        

        if (saveRecords[0] == result[0] && saveRecords[5] == result[5]){
            console.log("Sincronizando tempo de requisição...") 
            await sleep(3000);
        }else {
            saveRecords = result
            IA.getResults(result, today)
            IA.getAlgorithm(myStrategys,result, today)
            await sleep(30000);
        }
        
        let day = getFormatDate() 
        if(day != today){
            myStrategys = await bd.getStrategy()
            records.createRecord(myStrategys, today)
            today = day
            bd.clearAllStrategysWinsAndLoss(today)
        }
    }  
    
}



 function createInterface(){
    const rl = readline.createInterface({input: process.stdin,output: process.stdout})
    var newStrategy = []
     rl.on('line', async(input) => {
        if(input == '/criarestrategia'){
            rl.question("Digite o nome da sua estratégia... ", function(name){
                if(name){
                    newStrategy = []
                    newStrategy.name = name
                    rl.question("Digite a sequência sa sua estratégia (separe com espaço)? (red,white,black, número) ", function(seq){
                        var deps = seq.split(' ')
                        newStrategy.deps = deps
                        var format = '';
                        for (var i = 0; i < deps.length; i ++){
                            format = format + '  |'+i+'|'+deps[i]
                        }
                        rl.question("Sua sequência está correta: ("+format+") (y/n) ", function(res){
                            if(res == 'y'){
                                rl.question("Digite o sinal da sua estratégia... (red,white,black) ", function(signal){
                                    newStrategy.signal = signal
                                    rl.question("Digite o número de gales da sua estratégia... ", function(gales){
                                        newStrategy.gales = gales
                                        console.log(newStrategy)
                                        rl.question("Salvar estratégia? (y/n) ", function(res){
                                            if(res == 'y'){
                                                bd.saveStrategy(newStrategy)
                                                setTimeout(function(){
                                                    myStrategys = bd.getStrategy()
                                                },1000)
                                            }
                                            
                                        })
                                    })
                                })
                            }else{
                               console.log("Criação cancelada, recomece usando: /criarestrategia!") 
                            }
                        })
                    })
                }else{
                    console.log("Digite um nome para sua estratégia!") 
                }
            }) 
        }else if(input == '/relatorio'){
            today = getFormatDate()
            myStrategys = await bd.getStrategy()
            records.createRecord(myStrategys, myStrategys[0].date)
            // bd.clearAllStrategysWinsAndLoss(today)
        }
    }); 
    rl.on('close', function(){
        browser.close()
        process.exit(0)
    })  
}



async function run(){
    myStrategys = await bd.getStrategy()
    if(!myStrategys[0]){
        console.log('Antes de começar, crie sua primeira estratégia!')
    }
    today = getFormatDate()
    getPreviews();
    createInterface()
    if (myStrategys[0].date != today ){
       records.createRecord(myStrategys, myStrategys[0].date)
        bd.clearAllStrategysWinsAndLoss(today)
    }
    console.log('Sistema iniciado com sucesso!')
}

run();