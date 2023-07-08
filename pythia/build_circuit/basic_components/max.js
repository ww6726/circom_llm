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

function generateCircomFile(num,n) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/util/max.circom";
  
  component main = max(${num},${n});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "max.circom"), content);
}
async function max(input,n) {
    let num = input.length;

    generateCircomFile(num,n);
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "max.circom"));
    const INPUT = {
        "in": input,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    let output = witness[1];
    return output;

}
module.exports = {
    max,
};