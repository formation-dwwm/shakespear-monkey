const GA = new GeneticAlgorithm(20, 4);

GA.createPopulation();

const word = "banana";  // 6-letter word !!!

let bFound = false;

for(var i = 0; i < 500; ++i){
  console.log(`~~~~[Generation ${i}]~~~~`);

  // Compute fitness
  GA.Population.map((unit, unitIdx) => {
    const unitWord = unit.value;
    let score = 0;
    for(var idx = 0; idx < unitWord.length; ++idx){
      if(word[idx] === unitWord[idx]){
        ++score;
      }
    }
    
    unit.fitness = score;

    console.log(`[Unit ${unitIdx}] fitness: ${unit.fitness} value: ${unit.value}`);

    if(unitWord === word){
      bFound = true;
    }
  });

  if(bFound){
    console.log(`~~~~[Generation ${i} has a winner !!]~~~~`);
    break;
  }else{
    GA.evolvePopulation();
  }
}