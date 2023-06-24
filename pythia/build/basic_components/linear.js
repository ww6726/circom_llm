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
const {getShape,truncate} = require('../basic_components/util');

const fs = require('fs');

function generateCircomFile(n, m,p,fracBits) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/ml_components/Linear.circom";
  
  
  component main = Linear(${n},${m},${p},${fracBits});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "linear.circom"), content);
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
  function addBias(matrixA, matrixB) {
    const rows = matrixA.length;
    const columns = matrixA[0].length;
  
    if (rows !== matrixB.length || columns !== matrixB[0].length) {
      throw new Error("Matrix dimensions must match for element-wise addition.");
    }
  
    const result = new Array(rows);
    for (let i = 0; i < rows; i++) {
      result[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        result[i][j] = matrixA[i][j] + matrixB[i][j];
      }
    }
  
    return result;
  }
  
  
  // [n][inNum] * [inNum][outNum] = [n][outNum]
async function linear(input, weight, bias, n, inNum, outNum, fracBits) {
    let circuit;
    generateCircomFile(n,inNum,outNum,fracBits);
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "linear.circom"));
    const INPUT = {
        "in": input,
        "weights": weight,
        "bias": bias,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    var ret = [];
    var idx = 1;
    for(let i = 0;i <n;i++){
      ret[i] = [];
      for(let j = 0;j <outNum;j++){
        ret[i][j] = (witness[idx++]);
      }
    }
    // ret = truncate(ret,fracBits);
    return ret;
}

module.exports = {
    linear,
};