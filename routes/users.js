var express = require('express');
var router = express.Router();
var {RuleEngine} = require('../helpers/RuleEngine');

function getTier1Type1(){
  
  let eventForTier1Type1 = {
    type: tier1Name,
    params: {
      contributeBy: 'employer',
      value: 17
    }
  };
  let eventForTier1Type2 = {
    type: tier1Name,
    params: {
      contributeBy: 'employee',
      value: 20
    }
  };
  
  let conditionsForTier1 = {
    all: [
      {
        fact: 'age',
        operator: 'greaterThanInclusive',
        value: 16
      }, {
        fact: 'age',
        operator: 'lessThanInclusive',
        value: 55
      },
     
    ]
  };
  return {events:[eventForTier1Type1,eventForTier1Type2],conditions:conditionsForTier1}
}

router.get('/', async function(req, res, next) {
  
let engine = RuleEngine.getInstance();
let data = await engine.execute(parseInt(req.query.age))

res.status(200).json(data);

 
});

module.exports = router;
