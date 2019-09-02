const DEBUG_LOG = true;

const word = "banana";

const strategy = new GuessWordStrategy(word)

const GA = new GeneticAlgorithm(20, 4, strategy);

GA.createPopulation();

for(var i = 0; i < 500; ++i){
  // Compute fitness
  GA.computeFitness();

  const stats = GA.getStats();

  log(`~~~~[Generation ${stats.generation}]~~~~`);

  stats.population.map((unit, unitIdx) => {
    log(`[Unit ${unitIdx}] fitness: ${unit.fitness} value: ${unit.value}`);
  });

  if(stats.hasWinner){
    log(`~~~~[Generation ${stats.generation} has a winner !!]~~~~`);
    break;
  }else{
    GA.evolvePopulation();
  }
}

function log(...args) {
  if(!DEBUG_LOG) return;
  console.log(...args);
}