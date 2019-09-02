/***********************************************************************************
/* Genetic Algorithm implementation
/***********************************************************************************/

var GeneticAlgorithm = function(max_units, top_units, strategy){
	this.max_units = max_units; // max number of units in population
	this.top_units = top_units; // number of top units (winners) used for evolving population

	this.strategy = strategy;
	
	if (this.max_units < this.top_units) this.top_units = this.max_units;
	
	this.Population = []; // array of all units in current population

	this.generation = 0;
}

GeneticAlgorithm.prototype = {
	// resets genetic algorithm parameters
	reset : function(){
		this.iteration = 1;	// current iteration number (it is equal to the current population number)
		this.mutateRate = 1; // initial mutation rate
		
		this.best_population = 0; // the population number of the best unit
		this.best_fitness = 0;  // the fitness of the best unit

		this.generation = 0;
	},
	
	// creates a new population
	createPopulation : function(){
		// clear any existing population
		this.Population.splice(0, this.Population.length);
		
		for (var i=0; i<this.max_units; i++){
			var newUnit = this.createNewUnit(i);
      
			// add the new unit to the population 
			this.Population.push(newUnit);
		}

		++this.generation;
  	},
  
	createNewUnit: function(index){
		var newUnit = {
			value: this.strategy.createNewUnit()
		};
		
		// set additional parameters for the new unit
		newUnit.index = index;
		newUnit.fitness = 0;
		newUnit.isWinner = false;

		return newUnit;
	},

	getDNA: function(unit){
		return this.strategy.getDNA(unit.value);
	},

	createFromDNA: function(dna, newIndex){
		var newUnit = {
			value: this.strategy.createFromDNA(dna)
		}

		newUnit.index = newIndex;
		newUnit.fitness = 0;
		newUnit.isWinner = false;
		
		return newUnit;
	},

	computeFitness: function(){
		this.Population.map((unit, unitIdx) => {
			unit.fitness = this.strategy.computeFitness(unit.value);
		});
	},

	getStats: function(){

		return {
			generation: this.generation,
			hasWinner: this.strategy.hasWinner(this.Population.map(p => p.value)),
			population: this.Population.map(u => ({ fitness: u.fitness, value: u.value }))
		}
	},
	
	// evolves the population by performing selection, crossover and mutations on the units
	evolvePopulation : function(){
		// select the top units of the current population to get an array of winners
		// (they will be copied to the next population)
		var Winners = this.selection();

		if (this.mutateRate == 1 && Winners[0].fitness < 0){ 
			// If the best unit from the initial population has a negative fitness 
			// then it means there is no any bird which reached the first barrier!
			// Playing as the God, we can destroy this bad population and try with another one.
			this.createPopulation();
		} else {
			this.mutateRate = 0.2; // else set the mutatation rate to the real value
		}
			
		// fill the rest of the next population with new units using crossover and mutation
		for (var i=this.top_units; i<this.max_units; i++){
			var parentA, parentB, offspring;
				
			if (i == this.top_units){
				// offspring is made by a crossover of two best winners
				parentA = this.getDNA(Winners[0]);
				parentB = this.getDNA(Winners[1]);
				offspring = this.crossOver(parentA, parentB);

			} else if (i < this.max_units-2){
				// offspring is made by a crossover of two random winners
				parentA = this.getDNA(this.getRandomUnit(Winners));
				parentB = this.getDNA(this.getRandomUnit(Winners));
				offspring = this.crossOver(parentA, parentB);
				
			} else {
				// offspring is a random winner
				offspring = this.getDNA(this.getRandomUnit(Winners));
			}

			// mutate the offspring
			offspring = this.mutation(offspring);
			
			// update population by changing the old unit with the new one
			this.Population[i] = this.createFromDNA(offspring, this.Population[i].index);
		}
		
		// if the top winner has the best fitness in the history, store its achievement!
		if (Winners[0].fitness > this.best_fitness){
			this.best_population = this.iteration;
			this.best_fitness = Winners[0].fitness;
		}
		
		// sort the units of the new population	in ascending order by their index
		this.Population.sort(function(unitA, unitB){
			return unitA.index - unitB.index;
		});

		++this.generation;
	},

	// selects the best units from the current population
	selection : function(){
		// sort the units of the current population	in descending order by their fitness
		var sortedPopulation = this.Population.sort(
			function(unitA, unitB){
				return unitB.fitness - unitA.fitness;
			}
		);
		
		// mark the top units as the winners!
		for (var i=0; i<this.top_units; i++) this.Population[i].isWinner = true;
		
		// return an array of the top units from the current population
		return sortedPopulation.slice(0, this.top_units);
	},
	
	// performs a single point crossover between two parents
	crossOver : function(dnaParentA, dnaParentB) {
		return this.strategy.crossOver(dnaParentA, dnaParentB);
  	},
	
	// performs random mutations on the offspring
	mutation : function (dna){
		return this.strategy.mutate(dna, this.mutateRate);
	},
	
	random : function(min, max){
		if(min > max){
			[min, max] = [max, min];
		}
		return Math.floor(Math.random()*(max-min+1) + min);
  	},
	
	getRandomUnit : function(array){
		return array[this.random(0, array.length-1)];
	},
	
	normalize : function(value, max){
		// clamp the value between its min/max limits
		if (value < -max) value = -max;
		else if (value > max) value = max;
		
		// normalize the clamped value
		return (value/max);
	}
}