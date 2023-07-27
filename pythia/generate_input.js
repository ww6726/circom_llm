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
  let numLayer = 6;
  let n = 32;
  let m = 32;
  let p = 96;
  let mlp_Linear1_size = 4*m;

  let dim = 2;
  //weights, biases 
  let inputs = [];//2D
  let weights = [];//3D
  let biases = [];//3D
  let weights_attn_final = [];//3D
  let biases_attn_final = [];//3D
  let weights_mlp_1st=[];//3D;
  let biases_mlp_1st=[];
  let weights_mlp_2nd=[];
  let biases_mlp_2nd=[];
  let sequence_length = n;

  //initialize all winesses (soon be replaced by real witnesses)
  for(var i =0;i<n;i++){
    inputs[i] = [];
    for(var j =0;j<m;j++){
      inputs[i][j] = floatToQ(N,fracBits,i+j);
    }
  }
  //attn part
  for(var l = 0;l<numLayer;l++){
    weights[l] = [];
    for(var i =0;i<m;i++){
      weights[l][i] = [];
      for(var j =0;j<p;j++){
        weights[l][i][j] = floatToQ(N,fracBits,i+j);
      }
    }
  }
  for(var l = 0;l<numLayer;l++){
    biases[l] = [];
    for(var i =0;i<n;i++){
      biases[l][i] = [];
      for(var j =0;j<p;j++){
        biases[l][i][j] = floatToQ(N,fracBits,i+j);
      }
    }
  }
  for(var l = 0;l<numLayer;l++){
  weights_attn_final[l] = [];
  for(var i =0;i<m;i++){
    weights_attn_final[l][i] = [];
    for(var j =0;j<m;j++){
      weights_attn_final[l][i][j] = floatToQ(N,fracBits,i+j);
    }
  }
}
for(var l = 0;l<numLayer;l++){
  biases_attn_final[l] = [];
  for(var i =0;i<n;i++){
    biases_attn_final[l][i] = [];
    for(var j =0;j<m;j++){
      biases_attn_final[l][i][j] = floatToQ(N,fracBits,i+j);
    }
  }
}
  //mlp part
  for(var l = 0;l<numLayer;l++){
    weights_mlp_1st[l] = [];
    for(var i =0;i<m;i++){
      weights_mlp_1st[l][i] = [];
      for(var j =0;j<mlp_Linear1_size;j++){
        weights_mlp_1st[l][i][j] = floatToQ(N,fracBits,i+j);
      }
    }
  }
  for(var l = 0;l<numLayer;l++){
    biases_mlp_1st[l] = [];
    for(var i =0;i<n;i++){
      biases_mlp_1st[l][i] = [];
      for(var j =0;j<mlp_Linear1_size;j++){
        biases_mlp_1st[l][i][j] = floatToQ(N,fracBits,i+j);
      }
    }
  }

  for(var l = 0;l<numLayer;l++){
    weights_mlp_2nd[l] = [];
    for(var i =0;i<mlp_Linear1_size;i++){
      weights_mlp_2nd[l][i] = [];
      for(var j =0;j<m;j++){
        weights_mlp_2nd[l][i][j] = floatToQ(N,fracBits,i+j);
      }
    }
  }
  for(var l = 0;l<numLayer;l++){
    biases_mlp_2nd[l] = [];
    for(var i =0;i<n;i++){
      biases_mlp_2nd[l][i] = [];
      for(var j =0;j<m;j++){
        biases_mlp_2nd[l][i][j] = floatToQ(N,fracBits,i+j);
      }
    }
  }
    //step 2 - read witness
const ROPE_COS_FILE = "witness/ROPE_cos.txt";
const ropeCos = floatToQ_matrix(N,fracBits,readWitness(ROPE_COS_FILE));
const ROPE_SIN_FILE = "witness/ROPE_sin.txt";
const ropeSin = floatToQ_matrix(N,fracBits,readWitness(ROPE_SIN_FILE));
const MASK_FILE = "witness/mask.txt";
const mask = floatToQ_matrix(N,fracBits,readWitness(MASK_FILE));

log(getShape(ropeCos));
//softmax
let qln2 = floatToQ(4,fracBits,Math.log(2));
let a_sm = floatToQ(4,2*fracBits,0.3585);
let b_sm = floatToQ(4,fracBits,1.353);
let c_sm = floatToQ(4,4*fracBits,0.344);
//gelu
let q_root2_inv = Math.floor((1/Math.sqrt(2))*Math.pow(2,fracBits));  
let a = Math.floor(-0.2888*Math.pow(2,2*fracBits));
let b_neg = Math.floor(1.769*Math.pow(2,fracBits));
let b = Math.floor(-1.769*Math.pow(2,fracBits));
let c = Math.floor(1* Math.pow(2,4*fracBits));


const INPUT = {
  in: inputs,
  weights: weights,
  biases: biases,
  weights_attn_final: weights_attn_final,
  biases_attn_final: biases_attn_final,

  rope_cos: ropeCos,
  rope_sin: ropeSin,
  mask: mask,
  
  qln2: qln2,
  a_sm: a_sm,
  b_sm: b_sm,
  c_sm: c_sm,

  weights_mlp_1st: weights_mlp_1st,
  biases_mlp_1st: biases_mlp_1st,
  weights_mlp_2nd: weights_mlp_2nd,
  biases_mlp_2nd: biases_mlp_2nd,

  q_root2_inv: q_root2_inv,
  gelu_a: a,
  gelu_b_neg: b_neg,
  gelu_b: b,
  gelu_c: c,
}

// //test
// let d1 = [];
// let d2 = [];
// for(var i=0;i<6;i++){
//   d1[i] = [];
//   d2[i] = [];

//   for(var j=0;j<32;j++){
//     d1[i][j] = [];
//     d2[i][j] = [];

//     for(var k=0;k<96;k++){
//       d1[i][j][k] = i+j;
//       d2[i][j][k] = i+j;

//     }
//   }
// }
// // let d2 = [[3,2],[223,2]];

// const INPUT2 = {
//   a : d1,
//   b : d2,
// }

const inputJson = JSON.stringify(INPUT);

fs.writeFile('input.json', inputJson, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Input data written to file successfully!');
  }
});