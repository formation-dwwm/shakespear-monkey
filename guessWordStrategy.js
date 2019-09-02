var GuessWordStrategy = function(guessWord){
    this.guessWord = guessWord;
    this.wordLength = guessWord.length;
}

GuessWordStrategy.prototype = {
    createNewUnit: function(){
        // Random string
        return Array.from({ length: this.wordLength }, () => this.randomChar("a", "z")).join(""); 
    },

    createFromDNA: function(dna){
        return dna;
    },

    getDNA: function(dna){
        return dna;
    },

    computeFitness: function(word){
        let score = 0;
        for(var idx = 0; idx < word.length; ++idx){
            if(this.guessWord[idx] === word[idx]){
                ++score;
            }
        }

        return score;
    },

    hasWinner: function(values){
        let bFound = false;

        values.map((word, unitIdx) => {
            if(word === this.guessWord){
              bFound = true;
            }
        });

        return bFound;
    },

    crossOver: function(parentA, parentB){
        // get a cross over cutting point
        var cutPoint = this.random(0, parentA.length-1);
            
        // swap 'char' information between both parents:
        // 1. left side to the crossover point is copied from one parent
        // 2. right side after the crossover point is copied from the second parent
        var arrA = Array.from(parentA);
        var arrB = Array.from(parentB);
    
        for (var i = cutPoint; i < arrA.length; i++){
            var fromParentA = arrA[i];
            arrA[i] = arrB[i];
            arrB[i] = fromParentA;
        }
    
        var newA = arrA.join("");
        var newB = arrB.join("");
    
        return this.random(0, 1) == 1 ? newA : newB;
    },

    mutate : function (gene, mutateRate){
		if (Math.random() < mutateRate) {
			var mutateIndex = this.random(0, gene.length);
            var arr = Array.from(gene);
            arr[mutateIndex] = this.randomChar();
            gene = arr.join("");
        }else if(Math.random() < 0.04){
            gene = gene.split("").reverse().join("");
        }
		
		return gene;
    },
    
    random : function(min, max){
        if(min > max){
            [min, max] = [max, min];
        }
        return Math.floor(Math.random()*(max-min+1) + min);
    },
      
    randomChar: function(start = "a", end = "z"){
        return String.fromCharCode(this.random(start.charCodeAt(0), end.charCodeAt(0)));
    },
}