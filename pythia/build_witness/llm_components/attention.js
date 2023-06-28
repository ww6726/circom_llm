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
  function rotateHalf(x) {
    const halfIndex = Math.floor(x.length / 2);
    const x1 = x.slice(0, halfIndex);
    const x2 = x.slice(halfIndex);

    const negatedX2 = x2.map(subArray => subArray.map(value => -value));
    const rotated = negatedX2.concat(x1);

    return rotated;
}
function applyRotaryPosEmb(q, k, cos, sin, positionIds) {
  const gatherIndices = positionIds.map(row => row.map(value => [value])); // [bs, 1, seq_len, 1]
  const gatherIndicesRepeated = gatherIndices.map(row => row.map(value => value.repeat(cos[0].length)));

  const repeatedCos = cos.map(row => row.map(value => value.repeat(gatherIndices.length, 1)));
  const repeatedSin = sin.map(row => row.map(value => value.repeat(gatherIndices.length, 1)));

  const qEmbed = q.map((qRow, i) => {
      return qRow.map((qValue, j) => {
          const qCos = qValue * repeatedCos[i][j];
          const qSin = rotateHalf(qValue) * repeatedSin[i][j];
          return qCos + qSin;
      });
  });

  const kEmbed = k.map((kRow, i) => {
      return kRow.map((kValue, j) => {
          const kCos = kValue * repeatedCos[i][j];
          const kSin = rotateHalf(kValue) * repeatedSin[i][j];
          return kCos + kSin;
      });
  });

  return [qEmbed, kEmbed];
}
function attn(input, weight, bias,n,inNum, outNum, fracBits) {
  const query_key_value = linear(input, weight, bias,n,inNum, outNum,fracBits);
  const headsAll = splitToHeads(query_key_value,8);
  for(let i = 0;i < 1;i++){
    const head = headsAll[i];
    const q_k_v =  splitQKV(head);
    const query = q_k_v[0];
    const key   = q_k_v[1];
    const value = q_k_v[2];
    const keyT = transposeMatrix(key);
    const queryKT = matrixMultiplication(query,keyT);
    return(divideByConstant(queryKT,8));
    return queryKT;

    // const softMaxOut =  softmax(divideByConstant(queryKT,8));
  }
}
module.exports = {
  attn,
};