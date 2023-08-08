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
const {getShape,floatToQ,QToFloat,floatToQ_signed,truncate,truncateMatrix,fieldToReal} = require('../basic_components/util');
const {matrixMultiplication,addBias,linear} = require('../basic_components/linear');
const {layerNorm} = require('../basic_components/layerNorm');
const {softmax,I_softmax2D, softmax_i} = require('../basic_components/softmax');

const fs = require('fs');
const { exit } = require("process");
const { get } = require("http");
const { lastIndexOf } = require("b4a");
const { floatToQ_matrix } = require("../../build_circuit/basic_components/util");

function areMatricesEqual(matrixA, matrixB) {
  if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
    return false;
  }

  for (let i = 0; i < matrixA.length; i++) {
    for (let j = 0; j < matrixA[0].length; j++) {
      if (matrixA[i][j] !== matrixB[i][j]) {
        return false;
      }
    }
  }

  return true;
}
function matmulTruncate(matrixA, matrixB,fracBits) {
  const rowsA = matrixA.length;
  const columnsA = matrixA[0].length;
  const columnsB = matrixB[0].length;

  if (columnsA !== matrixB.length) {
    throw new Error("Invalid matrix dimensions. Columns of matrixA must match rows of matrixB.");
  }

  let result = new Array(rowsA);
  for (let i = 0; i < rowsA; i++) {
    result[i] = new Array(columnsB);
    for (let j = 0; j < columnsB; j++) {
      result[i][j] = 0;
      for (let k = 0; k < columnsA; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }


  result = truncateMatrix(result,fracBits)
  return result;
}
function freivalds(a,b,c,fracBits){
  let rand = [];
  for(let i =0;i < b[0].length;i++){
    rand[i] = [];
    for(let j = 0; j < 1;j++){
      rand[i][j] = 1;
    }
  }
  let c_ = matrixMultiplication(a,b);

  let lhs = matrixMultiplication(b,rand,fracBits);
  lhs = matrixMultiplication(a,lhs,fracBits);
  
  let rhs =matrixMultiplication(c_,rand,fracBits);

  if(areMatricesEqual(lhs,rhs) == false){
    log("freivalds failed");
    log(lhs);
    log("=========================");
    log(rhs);

    exit();
  }
  else{
    log("freivalds PASS");
    log(lhs);
    log("=========================");
    log(rhs);

    exit();
  
  }
  
}


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
      const dividedValue = Math.trunc(row[j] / constant);
      dividedRow.push(dividedValue);
    }

    dividedMatrix.push(dividedRow);
  }

  return dividedMatrix;
}
function elementwiseMultiply(matrix1, matrix2,fracBits) {
  if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
    throw new Error("Matrices must have the same dimensions.");
  }

  let result = [];
  for (let i = 0; i < matrix1.length; i++) {
    result.push([]);
    for (let j = 0; j < matrix1[0].length; j++) {
      result[i].push(matrix1[i][j] * matrix2[i][j]);
    }
  }
  result = truncateMatrix(result,fracBits);
  return result;
}
function elementwiseMultiplyNoTrunc(matrix1, matrix2,fracBits) {
  if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
    throw new Error("Matrices must have the same dimensions.");
  }

  let result = [];
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

function applyRotaryPosEmb(q, k, cos, sin, positionIds,dim,fracBits) {
  let gather_indices = positionIds.map(element => [element]);

  gather_indices = gather_indices.map(row => Array(dim).fill(row[0]));

  let q_embed = elementwiseAdd(elementwiseMultiplyNoTrunc(q,cos,fracBits) , elementwiseMultiplyNoTrunc(rotateHalf(q),sin,fracBits));
  let k_embed = elementwiseAdd(elementwiseMultiplyNoTrunc(k,cos,fracBits) , elementwiseMultiplyNoTrunc(rotateHalf(k),sin,fracBits));
  
  q_embed = truncateMatrix(q_embed,fracBits);
  k_embed = truncateMatrix(k_embed,fracBits);

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


function attnHead(head,dim,sequence_length,fracBits,head_idx,
                  ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,
                  keyQueryMM_head,keyQueryMM_head_aux){
    
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


  const[query_emb, key_emb] = applyRotaryPosEmb(query_rot,key_rot,ropeCos,ropeSin,position_ids,dim,fracBits);


  query = concatenateMatrices(query_emb,query_pass);
  key = concatenateMatrices(key_emb,key_pass);
  const keyT = transposeMatrix(key);

  //freivalds
  var queryKT = matmulTruncate(query,keyT,fracBits);
  var queryKT_aux = matrixMultiplication(query,keyT);

  //test freivalds algorithm


  // log(queryKT);
  

  keyQueryMM_head[head_idx] = queryKT;
  keyQueryMM_head_aux[head_idx] = queryKT_aux;

  queryKT = divideByConstant(queryKT,8);
 

  //ADD MASKing
  queryKT_masked = elementwiseAdd(queryKT,mask);

  //softmax
 
  let softMaxOut = I_softmax2D(queryKT_masked,fracBits);

  //multiply V
  let out = matmulTruncate(softMaxOut,value,fracBits);
  return out;
}
function attn(input, weight, bias,weights_attn_final,biases_attn_final,n,inNum, outNum, dim, fracBits,sequence_length,numHead,
              ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,
              layerID,initialLinearLayerMMOuts,keyQueryMM,keyQueryMM_aux) {
  // const query_key_value = linear(input, weight, bias,n,inNum, outNum,fracBits);
  let query_key_value = matmulTruncate(input,weight,fracBits);
  log(n,inNum,outNum);

  //save for Freidvalds
  initialLinearLayerMMOuts[layerID] = query_key_value;
  query_key_value = addBias(query_key_value,bias);

  const headsAll = splitToHeads(query_key_value,numHead);
  attnAllHeads = [];
  let keyQueryMM_head = [];
  let keyQueryMM_head_aux = [];

  for(let i = 0;i < numHead;i++){
    const head = headsAll[i];
    attnAllHeads[i] = attnHead(head,dim,sequence_length,fracBits,i,
                              ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,
                              keyQueryMM_head,keyQueryMM_head_aux);
  }
  keyQueryMM[layerID] = keyQueryMM_head;
  keyQueryMM_aux[layerID] = keyQueryMM_head_aux;


  let attn = [];
  let sizeQKV = getShape(attnAllHeads)[2];
  for(let i =0;i <n;i++){
    attn[i] = [];
    for(let j =0;j <numHead*sizeQKV;j++){
        let headIdx = Math.floor(j / sizeQKV);
        let idx = j % sizeQKV;
        attn[i][j] = attnAllHeads[headIdx][i][idx];
    }
  }
 //final attention layer
//  let final_attn = linear(attn,weights_attn_final,biases_attn_final,n,inNum,inNum,fracBits);
  let final_attn = matmulTruncate(attn,weights_attn_final,fracBits);
  final_attn = addBias(final_attn,biases_attn_final);

  return final_attn;
}
module.exports = {
  attn,
};
