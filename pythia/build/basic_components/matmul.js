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
const {getShape,matrixMultiplication,truncate} = require('../basic_components/util');

const fs = require('fs');

function generateCircomFile(m,n,p) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/matrix/matmul.circom";
  
  
  component main = matmul(${m},${n},${p});`;
    fs.writeFileSync(path.join(__dirname, "../circom_runner", "matmul.circom"), content);
}
  // [n][inNum] * [inNum][outNum] = [n][outNum]
async function matmul(a, b, fracBits) {
    const m = a.length;
    const n = a[0].length;
    const p = b[0].length;


    let circuit;
    generateCircomFile(m,n,p);
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "matmul.circom"));
    
    const INPUT = {
        "a": a,
        "b": b,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    await circuit.checkConstraints(witness);

    var ret = [];
    var idx = 1;
    for(let i = 0;i <m;i++){
      ret[i] = [];
      for(let j = 0;j <p;j++){
        ret[i][j] = (witness[idx++]);
      }
    }
    ret = truncate(ret,fracBits);
    return ret;
}

module.exports = {
    matmul,
};