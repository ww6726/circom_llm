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
const { exit } = require("process");

function softmax_(arr) {
  var softmaxArr = [];
  var sum = 0;

  // Calculate the exponential of each element and sum them
  for (var i = 0; i < arr.length; i++) {
    softmaxArr[i] = Math.exp(arr[i]);
    sum += softmaxArr[i];
  }

  // Divide each element by the sum to normalize
  for (var i = 0; i < softmaxArr.length; i++) {
    softmaxArr[i] /= sum;
  }

  return softmaxArr;
}
function L(p){
  let a = 0.3585;
  let b = 1.353;
  let c = 0.344;
  return a *((p + b)**2) + c;
}
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

function subtractVector(vector, num) {
  var result = [];
  for (var i = 0; i < vector.length; i++) {
    result[i] =  vector[i] - num;
  }

  return result;
}
function sumVector(vector) {
  var sum = 0;
  for (var i = 0; i < vector.length; i++) {
    sum += vector[i];
  }
  return sum;
}
function find_z_p(x_){
  let z = Math.floor(-x_ / (Math.log(2)));
  let p = x_ + z * (Math.log(2));

  // console.log((Math.exp(x_)));
  // console.log((Math.exp(p))* Math.pow(2,-z));



  // console.log((Math.exp(x_)));
  // console.log((Math.exp(p))* Math.pow(2,-z));
  // console.log((L(p))*Math.pow(2,-z));
  return [z,p];
}

function I_EXP(z,p){
  return L(p) * Math.pow(2,-z); 
}
function softmax_poly(q){
  let max = Math.max(...q);
  let q_ = subtractVector(q, max);

  let q_exp = [];
  for(var i =0;i < q_.length;i++){
    let result= find_z_p(q_[i]);
    let z = result[0];
    let p = result[1];
    q_exp[i] = I_EXP(z,p);
  }
  let q_sum = sumVector(q_exp);

  let q_out = [];
  for(var i =0;i < q_exp.length;i++){
    q_out[i] = q_exp[i] / q_sum;
  }

  return q_out;
}



function I_EXP2(q,S){
  let a = 0.3585;
  let b = 1.353;
  let c = 0.344;

  let q_ln2 = Math.floor(Math.log(2)/S);
  let z = [];
  for(var i  = 0;i<q.length;i++){
    z[i] = Math.floor(-q[i]/q_ln2);
  }

}
function find_z_p_2(x_,S){
  let z = Math.floor(-x_ / (Math.log(2)*16));
  let p = x_ + z * (Math.log(2)*16);

  console.log((Math.exp(x_)));
  console.log((Math.exp(p))* Math.pow(2,-z));
  console.log((L(p))*Math.pow(2,-z));

  exit();

  // console.log((Math.exp(x_)));
  // console.log((Math.exp(p))* Math.pow(2,-z));
  // console.log((L(p))*Math.pow(2,-z));
  return [z,p];
}
function softmax_poly_i(q,S){
  let max = Math.max(...q);
  let q_ = subtractVector(q, max);
  for(var i =0;i < q_.length;i++){
    let result= find_z_p_2(q_[i]);
    let z = result[0];
    let p = result[1];
    q_exp[i] = I_EXP(z,p);
  }
  find_z_p_2(q,S);
  return result;

}
module.exports = {
    softmax,
    softmax_,
    softmax_poly,
    softmax_poly_i,
};