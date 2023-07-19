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



function generateCircomFile(n,m,p,attention_dim,mlp_Linear1_size,fracBits) {
  const content = `pragma circom 2.0.0;
include "../../circuits/llm_components/GPTLayer.circom";

component main = gptLayer(${n},${m},${p},${attention_dim},${mlp_Linear1_size},${fracBits});`;
  fs.writeFileSync(path.join(__dirname, "../circom_runner", "gptlayer.circom"), content);
}


async function gptLayer(input, weight, bias,weight_mlp_1,bias_mlp_1,weight_mlp_2,bias_mlp_2,mask,ropeCos,ropeSin,
                    qln2,q_root2_inv,a,b_neg,b,c,n,inNum, outNum,mlp_Linear1_size,dim,fracBits) {

  let circuit;
  generateCircomFile(n,inNum,outNum,dim,mlp_Linear1_size,fracBits);
  circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "gptlayer.circom"));

  const INPUT = {
      "in": input,
      "weight": weight,
      "bias": bias,

      "rope_cos": ropeCos,
      "rope_sin": ropeSin,
      "mask": mask,
      "qln2": qln2,

      "weight_mlp_1": weight_mlp_1,
      "bias_mlp_1": bias_mlp_1,
      "weight_mlp_2": weight_mlp_2,
      "bias_mlp_2": bias_mlp_2,

      "q_root2_inv": q_root2_inv,
      "gelu_a": a,
      "gelu_b_neg": b_neg,
      "gelu_b": b,
      "gelu_c": c,

  }
  log("hello");
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
    gptLayer,
};