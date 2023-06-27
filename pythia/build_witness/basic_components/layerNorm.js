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


function layerNorm(matrix, gamma, beta) {
    const rows = matrix.length;
    const cols = matrix[0].length;
  
    // Calculate the mean for each row
    const mean = [];
    for (let i = 0; i < rows; i++) {
      let sum = 0;
      for (let j = 0; j < cols; j++) {
        sum += matrix[i][j];
      }
      const rowMean = sum / cols;
      mean.push(rowMean);
    }
  
    // Calculate the variance for each row
    const variance = [];
    for (let i = 0; i < rows; i++) {
      let sum = 0;
      for (let j = 0; j < cols; j++) {
        sum += Math.pow(matrix[i][j] - mean[i], 2);
      }
      const rowVariance = sum / cols;
      variance.push(rowVariance);
    }
  
    // Apply layer normalization with gamma and beta
    const normalizedMatrix = [];
    for (let i = 0; i < rows; i++) {
      const normalizedRow = [];
      for (let j = 0; j < cols; j++) {
        const normalizedValue = ((matrix[i][j] - mean[i]) / Math.sqrt(variance[i] + 1e-5)) * gamma[j] + beta[j];
        normalizedRow.push(normalizedValue);
      }
      normalizedMatrix.push(normalizedRow);
    }
  
    return normalizedMatrix;
  }
module.exports = {
    layerNorm,

};