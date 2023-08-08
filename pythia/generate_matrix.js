const fs = require('fs');
const { log } = require("console");

const {floatToQ,floatToQ_matrix} = require('./build_circuit/basic_components/util');

function readWitness(filename) {
  const data = fs.readFileSync(filename, 'utf8');
  const lines = data.trim().split('\n');
  const matrix = lines.map(line => line.split(' ').map(Number));
  return matrix;
}
function matrixMultiplication(matrixA, matrixB) {
  const rowsA = matrixA.length;
  const columnsA = matrixA[0].length;
  const columnsB = matrixB[0].length;

  if (columnsA !== matrixB.length) {
    throw new Error("Invalid matrix dimensions. Columns of matrixA must match rows of matrixB.");
  }

  const result = new Array(rowsA);
  for (let i = 0; i < rowsA; i++) {
    result[i] = new Array(columnsB);
    for (let j = 0; j < columnsB; j++) {
      result[i][j] = 0;
      for (let k = 0; k < columnsA; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }
  return result;
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
  let same = 64;
  let n = same;
  let m = same;
  let p = same;

//matrices
  let a = [];
  let b = [];
  //freidvald
  let c = [];

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
  c = matrixMultiplication(a,b);
  for(var i =0;i<n;i++){
    for(var j =0;j<p;j++){
        c[i][j] = c[i][j] / Math.pow(2,8);
    }
  }

const INPUT = {
  a: a,
  b: b,
  c: c,

}

const inputJson = JSON.stringify(INPUT);

fs.writeFile('input.json', inputJson, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Input data written to file successfully!');
  }
});