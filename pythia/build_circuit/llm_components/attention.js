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



function generateCircomFile(n, m,p,dim,fracBits) {
  const content = `pragma circom 2.0.0;
include "../../circuits/llm_components/attention.circom";

component main = attention(${n},${m},${p},${dim},${fracBits});`;
  fs.writeFileSync(path.join(__dirname, "../circom_runner", "attention.circom"), content);
}


async function attn(input, weight, bias,ropeCos,ropeSin,mask,n,inNum, outNum,dim, fracBits) {

  let circuit;
  generateCircomFile(n,inNum,outNum,dim,fracBits);
  circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "attention.circom"));
  let qln2 = floatToQ(4,fracBits,Math.log(2));//for softmax

  const INPUT = {
      "in_first_layer": input,
      "weights_first_layer": weight,
      "bias_first_layer": bias,

      "rope_cos": ropeCos,
      "rope_sin": ropeSin,
      "mask": mask,

      "qln2": qln2,

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
  attn,
};