/*
var fs = require('fs');

var distinct = array => array.filter((value,index,that) => that.indexOf(value) == index);

fs.readFile('dict.txt', 'utf8', (err,data) => {
    var dictionary = data.split(/[:.,\s]+[-=]+|[=-]+|[.:]+|[{}]+|[\r]+|[\n]+|[\r\n]+|[\s\n]+|[\n\s]+|[()]+/)
                         .filter(x => x.trim()!=="")
                         .filter(x => !isFinite(x) );
    dictionary = dictionary.map(x => x.toLowerCase().replace(/[,.'"?!]/g,''));
    dictionary = distinct(dictionary);


    //dictionary = dictionary.filter(term => ['.','',',',':',] .indexOf(term.trim()) == -1);
    var x = 1;
});
*/

Array.prototype.contains = (term) => this.indexOf(term) != -1;

var dictionary = ['Claude','Shannon','founded','information',
'theory',,'which','is','the','basis','of ',
'probabilistic','language','models','and',
'of','the','code','breaking','methods','that',
'you','would','use','to','solve','this','problem',
'with','the','paper','titled','Mathematical',
'Theory','of','Communication','published',   
'In','this','year'];

var allTerms = [
    'de|  | f|Cl|nf|ed|au| i|ti|  |ma|ha|or|nn|ou| S|on|nd|on',
    'ry|  |is|th|is| b|eo|as|  |  |f |wh| o|ic| t|, |  |he|h ',
    'ab|  |la|pr|od|ge|ob| m|an|  |s |is|el|ti|ng|il|d |ua|c ',
    'he|  |ea|of|ho| m| t|et|ha|  | t|od|ds|e |ki| c|t |ng|br',
    'wo|m,|to|yo|hi|ve|u | t|ob|  |pr|d |s |us| s|ul|le|ol|e ',
    ' t|ca| t|wi| M|d |th|"A|ma|l |he| p|at|ap|it|he|ti|le|er',
    'ry|d |un|Th|" |io|eo|n,|is|  |bl|f |pu|Co|ic| o|he|at|mm',
    'hi|  |  |in|  |  | t|  |  |  |  |ye|  |ar|  |s |  |  |. '
];


function prepare(str) {
    var input = str.split('|').filter(x => x!='').map((x,idx) => { return {value: x, index: idx }});
    var input2 = input.filter(x => x.value != '  ');

    // this array will contain all the final text results found in the scrambled data.
    var result = [];
    // this array here will contain the indices of the scrambled data in order.
    var indexResults = [];
    // this variable will be the parcial result data. There, I will test if this parcialResult matches with some word in the available dictionary 
    var parcialResult = "";
    // this array will contain the parcialIndexResults. I could use indexResults directly, but i can be that a possible word dont become a full word, then I can erase this erased easier than erasing the result one
    var parcialIndexResults = [];
    // this variable here will contain the index of my current term
    var currentTermIndex = -1;
    // this variable will indicate if I am still trying to match an existing word in the dictionary (true) or not (false, I am starting a new word)
    var someDictWordStartsWithparcialResult = false;
    do {
        // i am removing the first element of input2 at the same time that i am it putting into parcialResult
        // but i am doing this only if the word is not fully complete (meaning that some word of the dictionary starts with parcialResult)
        if(!someDictWordStartsWithparcialResult) {
            var firstTerm = input2.splice(0,1)[0]
            parcialResult = firstTerm.value;
            parcialIndexResults = [firstTerm.index];
        }

        var i = 0;
        while(i < input2.length && input2.length > 0) {
            // first of all, verify if the actual parcialResult is a valid term in the dictionary
            if( dictionary.includes(parcialResult.toLowerCase()) ) {
                result.push(parcialResult);
                // setting the variable to false, for it to get start a new word
                someDictWordStartsWithparcialResult = false;
                // here I am adding the index of the current term (this term's value is in parcialResult) and a separator, -1
                indexResults.push(parcialIndexResults);
                break;
            }
            
            // if it's got here, it means that parcialResult only isn't a full word in the dictionary

            // possibleWord will the parcialResult + <next term from the input array>
            var possibleWord = parcialResult.concat(input2[i].value).trim();
            if( dictionary.includes(possibleWord.toLowerCase()) ) {
                // possible word is actually a word
                // here i'm removing this term of the input2 array at the same time that I'm adding it's index to the parcialIndexResults
                parcialIndexResults.push(input2.splice(i,1)[0].index);
                // then I'm adding this to the indexResults, because it configures a complete word in the dictionary
                indexResults.push(parcialIndexResults);
                //add this word to the result
                result.push(possibleWord);
                // setting the variable to false, for it to get start a new word
                someDictWordStartsWithparcialResult = false;
                // breaking the loop, beacause i dont need to check the other terms (because this is a greedy algorithm and it will only try and find the local maximum)
                break;
            } else if( dictionary.some(t => t.startsWith(possibleWord.toLowerCase())) ) {
                // it means that some word of the dictionary starts with 'possibleWord'. I will continue trying to find the full word
                parcialResult = possibleWord;
                // set this variable to true, because i know that some word in the dictionary starts with possibleWord/parcialResult and I am continuing to search for it
                someDictWordStartsWithparcialResult = true;
                // remove this term from the input array at the same time that I'm adding it's index to the parcialIndexResults
                parcialIndexResults.push(input2.splice(i,1)[0].index);
                // breaking the loop, because i will try and find another term to concatenated from the beginning of the input array
                break;
            } else {
                someDictWordStartsWithparcialResult = false;
                // if it's got here, it means no word starts with possibleWord nor possibleWord is a full word in the dictionary
                // here i will add nothing the final result, as possibleWord is not valid.
                // i will not delete anything from input2 because i already did it in the first place 
            }
            // this code will run until the array is empty, which means that I tried to create all the existing words possible in  the dictionary.
            // the code is not complete, it will only try and match the valid words with the dictionary (it doesnt include special characters like ",.' etc)
            i++;
        }

    } while(input2.length > 0);
    if(dictionary.includes(parcialResult.toLowerCase())) {
        result.push(parcialResult);
        indexResults.push(parcialIndexResults);
    }

    return {
        result: result,
        indexResult: indexResults
    };
}

var termSolutions = [];
var termIndexSolutions = [];
allTerms.forEach(terms => {
    var r = prepare(terms);
    if(r.result.length > 0) {
        termSolutions.push(r.result);
        termIndexSolutions.push(r.indexResult);
    }
})

process.exit();