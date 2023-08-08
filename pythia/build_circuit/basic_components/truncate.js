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

function generateCircomFile(bits_total, bits_want) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/util/fixedPoint.circom";
  
  component main = truncate(${bits_total},${bits_want});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "truncate.circom"), content);
}
async function truncate(input,fracBits) {

    let bits_total = 96;
    let bits_want = bits_total - fracBits;
    generateCircomFile(bits_total,bits_want);
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "truncate.circom"));
    const INPUT = {
        "in": input,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    
    // const output = [];
    // idx = 1;
    // for(let i =0;i<col;i++){
    //     output[i] = []
    //     for(let j = 0;j < row;j++){
    //         output[i][j] = witness[idx++];
    //     }
    // }
    return witness[1];
}
module.exports = {
    truncate,
};