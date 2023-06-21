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
const {floatToQ,QToFloat,floatToQ_signed} = require('util');

async function add(a, b) {
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "add.circom"));
    var sum = a + b;
    const INPUT = {
        "a": a,
        "b": b,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    return sum;
}
async function mul(a, b,n,m) {
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "mul.circom"));
    var prod = a * b;
    const INPUT = {
        "a": a,
        "b": b,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    return prod;
}
async function sub(a, b) {
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "sub.circom"));
    var prod = a - b;
    const INPUT = {
        "a": a,
        "b": b,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    return prod;
}
async function div(a, b) {
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "div.circom"));
    var quotient = a / b;
    var remainder = a - b * quotient;
    const INPUT = {
        "a": a,
        "b": b,
        "q": quotient,
        "r": remainder,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    return quotient;
}
//deprecated. Dont need for now;
async function sqrt(a) {
    let circuit;
    circuit = await wasm_tester(path.join(__dirname, "../circom_runner", "sqrt.circom"));
    var root = Math.sqrt(a);
    const a_q = floatToQ(4,8,a);
    const root_q = floatToQ(4,4,root);

    console.log(a_q);
    console.log(root_q);
    console.log(root_q*root_q);

    const INPUT = {
        "in": a,
        "root": root,
    }
    const witness = await circuit.calculateWitness(INPUT, true);
    return root;
}
module.exports = {
    div,
    add,
    mul,
    sub,
    sqrt
};