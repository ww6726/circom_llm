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
include "../../circuits/llm_components/attention.circom";

component main = attention(${n},${m},${p},${fracBits});`;
  fs.writeFileSync(path.join(__dirname, "../circom_runner", "attention.circom"), content);
}
async function attn(input, weight, bias,n,inNum, outNum, fracBits) {
  generateCircomFile(n,inNum,outNum,fracBits);
  circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "attention.circom"));

  const INPUT = {
      "in_first_layer": input,
      "weights_first_layer": weight,
      "bias_first_layer": bias,
  }
  const witness = await circuit.calculateWitness(INPUT, true);
}
module.exports = {
  attn,
};