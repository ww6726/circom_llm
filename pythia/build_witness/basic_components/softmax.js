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


function softmax(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    const softmaxValues = [];
  
    for (let i = 0; i < rows; i++) {
      const row = matrix[i];
      const max = Math.max(...row);
      const exponentials = row.map((value) => Math.exp(value - max));
      const sum = exponentials.reduce((acc, val) => acc + val, 0);
      const softmaxRow = exponentials.map((value) => value / sum);
      softmaxValues.push(softmaxRow);
    }
    return softmaxValues;
  }
  
module.exports = {
    softmax,

};