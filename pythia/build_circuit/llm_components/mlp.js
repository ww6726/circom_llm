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
const {linear} = require('../basic_components/linear');
const {split} = require('../basic_components/split');
const {transpose} = require('../basic_components/transpose');
const {matmul } = require("../basic_components/matmul");
const fs = require('fs');



function generateCircomFile(n, m,p,fracBits) {
  const content = `pragma circom 2.0.0;
include "../../circuits/llm_components/mlp.circom";

component main = MLP(${n},${m},${p},${fracBits});`;
  fs.writeFileSync(path.join(__dirname, "../circom_runner", "mlp.circom"), content);
}


async function mlp(input, weight1, bias1,weight2,bias2,q_root2_inv,a,b_neg,b,c,n,m,p, fracBits) {
    // log(n,m,p);
    // log(getShape(input));
    // log(getShape(weight1));
    // log(getShape(bias1));
    // log(getShape(weight2));
    // log(getShape(bias2));

  let circuit;
  generateCircomFile(n,m,p,fracBits);
  circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "mlp.circom"));


  const INPUT = {
      "in": input,
      "weight1": weight1,
      "bias1": bias1,

      "q_root2_inv": q_root2_inv,
      "gelu_a": a,
      "gelu_b_neg": b_neg,
      "gelu_b": b,
      "gelu_c": c,
      "weight2": weight2,
      "bias2": bias2,

  }
  const witness = await circuit.calculateWitness(INPUT, true);
  var ret = [];
  var idx = 1;
  for(let i = 0;i <n;i++){
    ret[i] = [];
    for(let j = 0;j <n;j++){
      ret[i][j] = (witness[idx++]);
    }
  }
  return ret;
}
module.exports = {
    mlp,
};