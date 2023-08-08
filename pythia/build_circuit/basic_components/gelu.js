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
const {floatToQ,getShape} = require('util');
const fs = require('fs');

function generateCircomFile(n,m,fracBits) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/ml_components/GeLU.circom";
  
  component main = Gelu2D(${n},${m},${fracBits});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "gelu.circom"), content);
}
async function gelu(input,fracBits) {
    let n = input.length;
    let m = input[0].length;
    let q_root2_inv = Math.floor((1/Math.sqrt(2))*Math.pow(2,fracBits));  

    let a = Math.floor(-0.2888*Math.pow(2,2*fracBits));
    let b_neg = Math.floor(1.769*Math.pow(2,fracBits));
    let b = Math.floor(-1.769*Math.pow(2,fracBits));
    let c = Math.floor(1* Math.pow(2,4*fracBits));

    generateCircomFile(n,m,fracBits);
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "gelu.circom"));
    const INPUT = {
        "in": input,
        "q_root2_inv": q_root2_inv,
        "gelu_a": a,
        "gelu_b_neg": b_neg,
        "gelu_b": b,
        "gelu_c": c

    }
    const witness = await circuit.calculateWitness(INPUT, true);
    let output = [];
    let idx = 1;
    for(var i =0;i<n;i++){
        output[i] = witness[idx++];
    }
    return output;

}
module.exports = {
    gelu,
};