const fs = require('fs');
const { log } = require("console");

const {floatToQ,floatToQ_matrix} = require('./build_circuit/basic_components/util');

function readWitness(filename) {
  const data = fs.readFileSync(filename, 'utf8');
  const lines = data.trim().split('\n');
  const matrix = lines.map(line => line.split(' ').map(Number));
  return matrix;
}
function getShape(data) {
  if (Array.isArray(data)) {
    var shape = [];
    var currentLevel = data;

    while (Array.isArray(currentLevel)) {
      shape.push(currentLevel.length);
      currentLevel = currentLevel[0];
    }

    return shape;
  } else {
    return [];
  }
}

let N = 4;// deprecated. Remove this later

  let fracBits = 8;
  let n = 4;
  let m = 4;
  let p = 4;

//matrices
  let a = [];
  let b = [];

  //initialize all winesses (soon be replaced by real witnesses)
  for(var i =0;i<n;i++){
    a[i] = [];
    for(var j =0;j<m;j++){
        a[i][j] = floatToQ(N,fracBits,i+j);
    }
  }
  for(var i =0;i<m;i++){
    b[i] = [];
    for(var j =0;j<p;j++){
        b[i][j] = floatToQ(N,fracBits,i+j);
    }
  }
  

const INPUT = {
  a: a,
  b: b,

}

const inputJson = JSON.stringify(INPUT);

fs.writeFile('input.json', inputJson, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Input data written to file successfully!');
  }
});