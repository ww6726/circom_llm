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
const {floatToQ,getShape} = require('../basic_components/util');
const fs = require('fs');

function generateCircomFile(n,fracBits) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/ml_components/Softmax.circom";
  
  component main = Softmax(${n},${fracBits});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "softmax.circom"), content);
}
async function softmax(input,fracBits) {
    let n = input.length;

    generateCircomFile(n,fracBits);
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "softmax.circom"));

    let qln2 = floatToQ(4,fracBits,Math.log(2));
    let qln2_inv = floatToQ(4,fracBits,1/Math.log(2));
    let a = floatToQ(4,2*fracBits,0.3585);
    const INPUT = {
        "in": input,
        "qln2":qln2,
        "qln2_inv": qln2_inv,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    let output = [];
    let idx = 0;
    for(var i =1;i<n+1;i++){
        output[idx++] = witness[i];
    }
    return output;

}
module.exports = {
    softmax,
};