const c = require('@smogon/calc');
const g = c.Generations.get(9);

const names = ['rillaboom', 'baxcalibur', 'golisopod', 'salamence', 'garchompmegaz'];
for (const n of names) {
  console.log(n, !!g.species.get(n));
}