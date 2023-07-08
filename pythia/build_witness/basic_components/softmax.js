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
  const ln2 = Math.log(2);
  let z = Math.floor(-x_ / (ln2));
  let p = x_ + z * (ln2);
  console.log(-x_,z,p);
  console.log(Math.exp(p),",",L(p));
  console.log(Math.exp(x_));


  return [z,p];
}

function I_EXP(z,p){
  return L(p) * Math.pow(2,-z); 
}
function softmax_poly(q){
  let max = Math.max(...q);
  let q_ = subtractVector(q, max);
  // for(var i =0;i<q.length;i++){
  //   console.log(q_[i]);
  // }
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


//this entire function can easily be implemented in circom
function L_int(p, fracBits){
  let a = Math.floor(0.3585*Math.pow(2,2*fracBits));
  let b = Math.floor(1.353*Math.pow(2,fracBits));
  let c = Math.floor(0.344*Math.pow(2,4*fracBits));
  return (a *((p + b)**2) + c);
}
function find_z_p_2(x_,fracBits){
  let S = 1/(Math.pow(2,fracBits));
  let scale = 1/S;
  let qln2 = Math.floor(Math.log(2)*scale);
  let z = Math.floor(-x_ / qln2);
  let p = x_ + z * qln2;

  log(x_,qln2,z);
  

  let qln2_inv = Math.floor(1/Math.log(2)*scale);
  let z2 = Math.floor(-x_ * qln2_inv / (scale*scale));
  log(x_,qln2_inv,z2);
  exit();

  let p_l = L_int(p,fracBits);
  let p_out = Math.floor(p_l / Math.pow(2,z));
  scale = Math.pow(2,4*fracBits);


  // console.log((Math.exp(x_)));
  // console.log((Math.exp(p))* Math.pow(2,-z));
  // console.log((L(p))*Math.pow(2,-z));
  return [p_out,scale];
}
function softmax_poly_i(q,fracBits){


  let max = Math.max(...q);
  let q_ = subtractVector(q, max);

  let p_exp = [];
  let scale;
  for(var i =0;i < q_.length;i++){
    let result= find_z_p_2(q_[i],fracBits);
    p_exp[i] = result[0];
    scale = result[1];
  }

  let p_out = [];
  let p_outi = [];
  let p_sum = sumVector(p_exp);
  for(var i =0;i < p_exp.length;i++){
    p_out[i] = p_exp[i]/p_sum;
    p_outi[i] = Math.floor(p_out[i]*2*scale);
  }

  //conpute fixpoint inverse
  scale = 10*scale;
  let p_sum_inv = Math.floor(scale / p_sum);//this is gonna be a witness

  for(var i =0;i < p_exp.length;i++){
    p_outi[i] = p_exp[i] * p_sum_inv;
    p_out[i] = p_outi[i]/scale;
  }
  console.log(p_outi);
  console.log(p_out);





  return p_out;

}
module.exports = {
    softmax,
    softmax_,
    softmax_poly,
    softmax_poly_i,
};