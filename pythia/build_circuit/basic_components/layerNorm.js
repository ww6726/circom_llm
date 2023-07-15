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
const {floatToQ,getShape,floatToQ_matrix,floatToQ_multiD} = require('../basic_components/util');
const fs = require('fs');

function generateCircomFile(n,m,fracBits) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/ml_components/LayerNorm.circom";
  
  component main = LayerNorm(${n},${m},${fracBits});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "layerNorm.circom"), content);
}

async function layerNorm(input,fracBits) {
    let n = input.length;
    let m = input[0].length;
    generateCircomFile(n,m,fracBits);
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "layerNorm.circom"));

   const INPUT = {
        "in": input,

    }
    const witness = await circuit.calculateWitness(INPUT, true);
    var output = [];
    var idx = 1;
    for(let i = 0;i <n;i++){
        output[i] = [];
      for(let j = 0;j <m;j++){
        output[i][j] = (witness[idx++]);
      }
    }
    return output;

}
module.exports = {
    layerNorm,
};