function decompose(n) {
    // your code
    return decompose2(n);
}

function decompose2(n, resto = n*n, resultado = [], primeiraVez = true, height = 0) {
 
  var n1 = primeiraVez? n-1 : n;

  if(resultado.length>0 && n1 == resultado[resultado.length-1]) {
      resultado = [];
      return resultado;
  }

  var results = [];
  for(var na = n1; na >= Math.floor(n1/2); na--) {
        var parcial = resultado.concat([na]);

        var novoResto = resto - n1*n1;
        var novoN = Math.floor(Math.sqrt(novoResto));

        if(novoResto == 0) results.push(parcial);
        else {
            var decomposition = decompose2(novoN,novoResto,parcial,false, height+1);
            if(decomposition.length > 0) results.push(parcial.concat(decomposition));
        }
  }
  return results || results[0];

//   resultado.push(n1);
//   resto -= n1*n1;
//   n = Math.floor(Math.sqrt(resto));
  
//   if(resto == 0) return resultado;
//   return decompose2(n,resto,resultado,false, height+1);
}

console.log(decompose(50));
process.exit();