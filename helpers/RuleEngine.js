let { Engine } = require('json-rules-engine');
let fs = require('fs');

const tierName = 'CPF';

class RuleEngine {
engine = null;
ruleEngine = null;  
alreadyCreated = false;

constructor() {
  this.engine = new Engine();
  
}
static getInstance(){
  if(this.ruleEngine==null)
    this.ruleEngine = new RuleEngine();
  return this.ruleEngine;
}

getTiersTypes(){ 
  let arr = [];
  for(let i=1;i<=5;i++){
    var eventForTierType1 = JSON.parse( fs.readFileSync(`./rules/events/tier${i}EmployeeEvent.json`));
    var eventForTierType2= JSON.parse( fs.readFileSync(`./rules/events/tier${i}EmployerEvent.json`));
    var conditionsForTier =  JSON.parse( fs.readFileSync(`./rules/conditions/tier${i}Conditions.json`));;
    arr.push({events:[eventForTierType1,eventForTierType2],conditions:conditionsForTier});
  }
  return arr;
}

execute(age){
  if(this.alreadyCreated){
        return this.engine.run({ age }).then(({events})=>{
          return events.map((event)=>{
            return {
              contributed_by:event.params.contributeBy,
              percent: event.params.value
            }
        })
      })
  }


  let tiersData = this.getTiersTypes();
  tiersData.forEach((tierData)=>{
    tierData.events.forEach((event)=>{
      this.engine.addRule({ event, conditions:tierData.conditions});
    })
  })

  this.engine.on(tierName, (params) => {
    console.log(`Tier ${params.contributeBy} contribution:${params.value}% of wage`);
  });
  this.alreadyCreated = true;
 return this.engine.run({ age }).then(({events})=>{
    return events.map((event)=>{
      return {
        contributed_by:event.params.contributeBy,
        percent: event.params.value
      }
  })
});  
}
    
}
module.exports = {
  RuleEngine
}