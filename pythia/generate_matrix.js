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
  let same = 512;
  let n = 2048;
  let m = 512;
  let p = 1536;

//matrices
  let matrix_a = [];
  let matrix_b = [];
  //freidvald
  let matrix_c = [];

  //initialize all winesses (soon be replaced by real witnesses)
  for(var i =0;i<n;i++){
    matrix_a[i] = [];
    for(var j =0;j<m;j++){
      matrix_a[i][j] = floatToQ(N,fracBits,i+j);
    }
  }
  for(var i =0;i<m;i++){
    matrix_b[i] = [];
    for(var j =0;j<p;j++){
      matrix_b[i][j] = floatToQ(N,fracBits,i+j);
    }
  }
  matrix_c = matrixMultiplication(matrix_a,matrix_b);
  for(var i =0;i<n;i++){
    for(var j =0;j<p;j++){
      matrix_c[i][j] = matrix_c[i][j] / Math.pow(2,8);
    }
  }
// test matmul

  const INPUT = {
    "a": matrix_a,
    "b": matrix_b,
    "c": matrix_c
  } 


// //test softmax  about 140 gates per number
//   let qln2 = floatToQ(4,fracBits,Math.log(2));
//   let a_sm = floatToQ(4,2*fracBits,0.3585);
//   let b_sm = floatToQ(4,fracBits,1.353);
//   let c_sm = floatToQ(4,4*fracBits,0.344);
// const INPUT = {
//   "in": matrix_a,
//   "qln2": qln2,
//   "a_sm": a_sm,
//   "b_sm": b_sm,
//   "c_sm": c_sm
// }

// // test GeLU
//   let q_root2_inv = Math.floor((1/Math.sqrt(2))*Math.pow(2,fracBits));  
//   let a = Math.floor(-0.2888*Math.pow(2,2*fracBits));
//   let b_neg = Math.floor(1.769*Math.pow(2,fracBits));
//   let b = Math.floor(-1.769*Math.pow(2,fracBits));
//   let c = Math.floor(1* Math.pow(2,4*fracBits));

//   const INPUT = {
//   "in": matrix_a,
//   "q_root2_inv": q_root2_inv,
//   "gelu_a": a,
//   "gelu_b_neg": b_neg,
//   "gelu_b": b,
//   "gelu_c": c
// }

// // test LayerNorm

//   const INPUT = {
//     "in": matrix_a
//   } 


const inputJson = JSON.stringify(INPUT);

fs.writeFile('input.json', inputJson, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Input data written to file successfully!');
  }
});
log("========== witness done =============");
