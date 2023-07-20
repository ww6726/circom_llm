const chai = require("chai");
const { log } = require("console");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {getShape,floatToQ,QToFloat,floatToQ_signed} = require('../basic_components/util');
const {matrixMultiplication,linear} = require('../basic_components/linear');
const {layerNorm} = require('../basic_components/layerNorm');
const {softmax} = require('../basic_components/softmax');

const fs = require('fs');
const { exit } = require("process");





function splitToHeads(qkv, headNum) {
  const heads = [];
  const rows = qkv.length;
  const columns = qkv[0].length;
  const splitSize = Math.ceil(columns / headNum);

  for (let i = 0; i < headNum; i++) {
    const head = [];
    for (let j = 0; j < rows; j++) {
      head.push(qkv[j].slice(i * splitSize, (i + 1) * splitSize));
    }
    heads.push(head);
  }
  return heads;
}


function permute(data){
  //todo: implement permutation for input
}
function splitQKV(qkv_head) {
  const numRows = qkv_head.length;
  const numColumns = qkv_head[0].length;

  const sectionSize = Math.floor(numColumns / 3);

  const q_k_v = [
    qkv_head.map(row => row.slice(0, sectionSize)),
    qkv_head.map(row => row.slice(sectionSize, 2 * sectionSize)),
    qkv_head.map(row => row.slice(2 * sectionSize, numColumns))
  ];

  return q_k_v;
}
function transposeMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Create a new empty transposed matrix
  const transposedMatrix = new Array(cols);
  for (let i = 0; i < cols; i++) {
    transposedMatrix[i] = new Array(rows);
  }

  // Fill the transposed matrix with the values from the original matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      transposedMatrix[j][i] = matrix[i][j];
    }
  }

  return transposedMatrix;
}
function divideByConstant(matrix, constant){
  const rows = matrix.length;
  const cols = matrix[0].length;

  const dividedMatrix = [];

  for (let i = 0; i < rows; i++) {
    const row = matrix[i];
    const dividedRow = [];

    for (let j = 0; j < cols; j++) {
      const dividedValue = row[j] / constant;
      dividedRow.push(dividedValue);
    }

    dividedMatrix.push(dividedRow);
  }

  return dividedMatrix;
}
function elementwiseMultiply(matrix1, matrix2) {
  if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
    throw new Error("Matrices must have the same dimensions.");
  }

  const result = [];
  for (let i = 0; i < matrix1.length; i++) {
    result.push([]);
    for (let j = 0; j < matrix1[0].length; j++) {
      result[i].push(matrix1[i][j] * matrix2[i][j]);
    }
  }

  return result;
}
function elementwiseAdd(matrix1, matrix2) {
  if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
    throw new Error("Matrices must have the same dimensions.");
  }

  const result = [];
  for (let i = 0; i < matrix1.length; i++) {
    result.push([]);
    for (let j = 0; j < matrix1[0].length; j++) {
      result[i].push(matrix1[i][j] + matrix2[i][j]);
    }
  }

  return result;
}
function rotateHalf(x) {
    // const halfIndex = Math.floor(x.length / 2);
    // const x1 = x.slice(0, halfIndex);
    // const x2 = x.slice(halfIndex);

    const halfIndex = Math.floor(x[0].length / 2);

    const x1 = x.map(row => row.slice(0, halfIndex));
    const x2 = x.map(row => row.slice(halfIndex));


    const negatedX2 = x2.map(subArray => subArray.map(value => -value));
    const rotated = negatedX2.map((row, index) => row.concat(x1[index]));
    // const rotated = negatedX2.concat(x1);
    return rotated;
}
function applyRotaryPosEmb(q, k, cos, sin, positionIds,dim) {
  let gather_indices = positionIds.map(element => [element]);
  // console.log(getShape(gather_indices));
  // console.log((gather_indices));
  gather_indices = gather_indices.map(row => Array(dim).fill(row[0]));
  // console.log((gather_indices));


  // for(let i=0;i<cos.length;i++){
  //   for(let j=0;j<cos[0].length;j++){
  //     cos[i][j] = cos[gather_indices[i][j]][j]; 
  //     sin[i][j] = sin[gather_indices[i][j]][j]; 
  //   }
  // }
  //store witness for circuit
  const witness_sin = 'witness/ROPE_sin.txt';
  saveWitnessToFile(sin, witness_sin);
  const witness_cos = 'witness/ROPE_cos.txt';
  saveWitnessToFile(cos, witness_cos);
  
  // for(var i = 0; i <q.length; i++) {
  //   for(var j = 0; j <q[0].length; j++){
  //     console.log(q[i][j]);
  //   }
  // }
  
  q_embed = elementwiseAdd(elementwiseMultiply(q,cos) , elementwiseMultiply(rotateHalf(q),sin));
  k_embed = elementwiseAdd(elementwiseMultiply(k,cos) , elementwiseMultiply(rotateHalf(k),sin));

  return [q_embed,k_embed];
}
function concatenateMatrices(matrix1, matrix2) {
  if (matrix1.length !== matrix2.length) {
    throw new Error("The matrices must have the same number of rows.");
  }
  
  const concatenatedMatrix = [];
  
  for (let i = 0; i < matrix1.length; i++) {
    const concatenatedRow = matrix1[i].concat(matrix2[i]);
    concatenatedMatrix.push(concatenatedRow);
  }
  
  return concatenatedMatrix;
}
function Sin(data) {
  return data.map(row => row.map(element => Math.sin(element)));
}
function Cos(data) {
  return data.map(row => row.map(element => Math.cos(element)));
}
function computeROPE(dim, max_position_embedding){
  const inv_freq = [];
  var idx = 0;
  for (let i = 0; i < dim; i += 2) {
    inv_freq[idx++]=(1.0 / Math.pow(10000, i / dim));
  }
  let t = Array.from({ length: max_position_embedding }, (_, index) => index);
  let t_mm = [];
  t_mm[0] = t;
  
  let inv_freq_mm = [];
  inv_freq_mm[0] = inv_freq;

  t_mm = transposeMatrix(t_mm);
  let freqs = matrixMultiplication(t_mm,inv_freq_mm);
  let embs = concatenateMatrices(freqs,freqs);


  const sin_matrix = Sin(embs);
  const cos_matrix = Cos(embs);
  return [sin_matrix,cos_matrix];


}
function createMask(n) {
  const matrix = [];

  for (let i = 0; i < n; i++) {
    matrix.push([]);
    for (let j = 0; j < n; j++) {
      if (i >= j) {
        matrix[i][j] = 0; // Bottom-left region (including diagonal) contains 0
      } else {
        matrix[i][j] = -999999; // Top-right region contains -Infinity
      }
    }
  }

  return matrix;
}
function saveWitnessToFile(witness, filename) {
  const data = witness.map(row => row.join(' ')).join('\n');
  fs.writeFileSync(filename, data);
}

function attnHead(head,dim,sequence_length){
    
  const q_k_v =  splitQKV(head);
  var query = q_k_v[0];
  var key   = q_k_v[1];
  var value = q_k_v[2];

  const query_rot = query.map(row => row.slice(0, dim));
  const query_pass = query.map(row => row.slice(dim));
  const key_rot = key.map(row => row.slice(0, dim));
  const key_pass = key.map(row => row.slice(dim));


  //apply ROPE

  const max_position_embedding = sequence_length;//32 for now
  let position_ids = Array.from({ length: max_position_embedding }, (_, index) => index);
  const[sin, cos] = computeROPE(dim,max_position_embedding);

  // //store witness for circuit. NOTE: This part was moved 
  // const witness_sin = 'witness/ROPE_sin.txt';
  // saveWitnessToFile(sin, witness_sin);
  // const witness_cos = 'witness/ROPE_cos.txt';
  // saveWitnessToFile(cos, witness_cos);

  const[query_emb, key_emb] = applyRotaryPosEmb(query_rot,key_rot,cos,sin,position_ids,dim);

  query = concatenateMatrices(query_emb,query_pass);
  key = concatenateMatrices(key_emb,key_pass);

  const keyT = transposeMatrix(key);
  var queryKT = matrixMultiplication(query,keyT);

  queryKT = divideByConstant(queryKT,8);

  //ADD MASKing
  let mask = createMask(queryKT.length);
  const witness_mask = 'witness/mask.txt';
  saveWitnessToFile(mask, witness_mask);
  queryKT_masked = elementwiseAdd(queryKT,mask);
  //softmax
  let softMaxOut = softmax(queryKT_masked);
  //multiply V

  let out = matrixMultiplication(softMaxOut,value);
  return out;
}
function attn(input, weight, bias,n,inNum, outNum, dim,fracBits,sequence_length) {
  const query_key_value = linear(input, weight, bias,n,inNum, outNum,fracBits);
  const headsAll = splitToHeads(query_key_value,8);
  attnAllHeads = [];
  for(let i = 0;i < 8;i++){
    
    const head = headsAll[i];
    attnAllHeads[i] = attnHead(head,dim,sequence_length);
  }
  attention
  let attn = [];
  let sizeQKV = getShape(attnAllHeads)[2];
  for(let i =0;i <n;i++){
    attn[i] = [];
    for(let j =0;j <8*sizeQKV;j++){
        let headIdx = Math.floor(j / sizeQKV);
        let idx = j % sizeQKV;
        attn[i][j] = attnAllHeads[headIdx][i][idx];
    }
  }

  return attn;
}
module.exports = {
  attn,
};
