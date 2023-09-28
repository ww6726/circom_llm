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


const fs = require('fs');
const { exit } = require("process");

function generateCircomFile(num,n,m,numMalicious,numNeighbors,fracBits) {
    const content = `pragma circom 2.0.0;
  include "../../circuits/outlierDetect.circom";
  
  
  component main = outlierDetect(${num},${n},${m},${numMalicious},${numNeighbors},${fracBits});`;
    fs.writeFileSync(path.join(__dirname, "circom_runner", "outlierDetect.circom"), content);
}

async function outlierDetection(weights,num,n,m,numMalicious,numNeighbors,fracBits) {
   
    let circuit;
    generateCircomFile(num,n,m,numMalicious,numNeighbors,fracBits);
    circuit = await wasm_tester(path.join(__dirname, "circom_runner", "outlierDetect.circom"));
    console.log(circuit.dir);
    console.log(circuit.constraints);
    const INPUT = {
        "weights": weights,
    
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    await circuit.checkConstraints(witness);

    log(witness);
    return witness;
}

module.exports = {
    outlierDetection,
};