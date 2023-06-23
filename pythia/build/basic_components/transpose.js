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

function generateCircomFile(row, col) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/matrix/Transpose.circom";
  
  component main = Transpose(${row},${col});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "transpose.circom"), content);
}
async function transpose(input) {
    const row = input.length;
    const col = input[0].length;

    generateCircomFile(row,col);
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "transpose.circom"));
    const INPUT = {
        "in": input,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    
    const output = [];
    idx = 1;
    for(let i =0;i<col;i++){
        output[i] = []
        for(let j = 0;j < row;j++){
            output[i][j] = witness[idx++];
        }
    }
    return output;
}
module.exports = {
    transpose,
};