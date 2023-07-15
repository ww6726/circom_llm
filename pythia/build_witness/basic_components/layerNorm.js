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
const {squareRoot} = require('../basic_components/squareRoot');
const fs = require('fs');




function layerNorm1D(input){
    let sum = 0;
    //find mean
    let n = input.length;
    for (let i = 0; i < n; i++) {
      sum += input[i];
    }
    let E = sum/n;
    //find variance
    let sum2 = 0;
    for (let i = 0; i < n; i++) {
      sum2 += Math.pow(input[i] - E,2);//twice
    }

    let sum2_div_n = sum2 / n;
    let VAR = Math.sqrt(sum2_div_n); 


    //find layerNorm
    let LM = [];
    for (let i = 0; i < n; i++) {
      LM[i] = (input[i] - E)/VAR;
    }

    return LM;
}

function layerNorm2D(input, gamma, beta) {
  const rows = input.length;
  let output = [];
  for(let i=0;i<rows;i++){
    output[i] = layerNorm1D(input[i]);
  }
  return output;
}

function layerNormBatch(input,gamma,beta){
  const numBatch = input.length;
  let output = [];
  for(let i=0;i<numBatch;i++){
    output[i] = layerNorm2D(input[i]);
  }
  return output;
}


function I_layerNorm1D(input,fracBits){
  let sum = 0;
  //find mean
  let n = input.length;
  for (let i = 0; i < n; i++) {
    sum += input[i];
  }
  let E = Math.floor(sum/n);

  //find variance
  let sum2 = 0;
  for (let i = 0; i < n; i++) {
    sum2 += Math.pow(input[i] - E,2);//twice
  }

  
  let sum2_div_n = Math.floor(sum2 /n);
  let VAR = squareRoot(sum2_div_n,16);//single 

  //find layerNorm
  let LM = [];
  for (let i = 0; i < n; i++) {
    let in_E_scaled = (input[i] - E) * Math.pow(2,fracBits);
    LM[i] = Math.floor(in_E_scaled/VAR);
    log(LM[i]);

  }

  return LM;
}
function I_layerNorm2D(input,fracBits) {
  const rows = input.length;
  let output = [];
  for(let i=0;i<rows;i++){
    output[i] = I_layerNorm1D(input[i],fracBits);
  }
  return output;
}
module.exports = {
  layerNormBatch,
  layerNorm2D,
  layerNorm1D,

  I_layerNorm1D,
  I_layerNorm2D,

};