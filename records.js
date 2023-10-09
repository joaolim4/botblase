const xl = require('excel4node');
var heightSpace = 2 
var widhtSpace = 2 


const bgStyle = wb.createStyle({
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#FFFF00',
      fgColor: '#FFFF00',
    }
  });

async function formatStrategyWins(strategywins){
    wins = []
    wins[0] = {name:'Entrada', qtd: 0}
    if(strategywins){
        table = JSON.parse(strategywins)
        if(table != 0){
            wins = table
            for(var i = 0; i < wins.length; i ++){
                if(wins[i]){
                    if (i == 0){
                        wins[i] = {name:'Entrada', qtd: parseInt(wins[i])}
                    }else{
                        wins[i] = {name:'Gale '+i,qtd: parseInt(wins[i])}
                    } 
                }else{
                    if (i == 0){
                        wins[i] = {name:'Entrada', qtd: 0}
                    }else{
                        wins[i] = {name:'Gale '+i,qtd: 0}
                    } 
                }
                     
            }
        }
           
    }
    return wins
}

async function createRecord(myStrategys, today){
    const wb = new xl.Workbook()
    const ws = wb.addWorksheet('Name of data');
    
    for(var i = 0; i < myStrategys.length; i ++){
        
        let strategy = myStrategys[i]
        let name = strategy.name
        let loss = parseInt(strategy.loss)
        let wins = await formatStrategyWins(strategy.wins)
        ws.cell(heightSpace, widhtSpace, heightSpace, widhtSpace+wins.length, true).string(name)
        ws.cell(heightSpace, widhtSpace).style(bgStyle)
        wins.forEach((element, idice) => {
            ws.cell(heightSpace+1, widhtSpace+idice).string(element.name)
            ws.cell(heightSpace+2, widhtSpace+idice).number(element.qtd)
        });
        ws.cell(heightSpace+1, widhtSpace+wins.length).string('Loss')
        ws.cell(heightSpace+2, widhtSpace+wins.length).number(loss)
        heightSpace = heightSpace+4
    }
    wb.write('dataRecords/relatório-'+new Date().getMilliseconds()+'-'+today+'.xlsx')
}



module.exports = { createRecord}