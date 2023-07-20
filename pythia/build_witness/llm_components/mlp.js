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
const {matrixMultiplication,linear} = require('../basic_components/linear');
const {gelu_,gelu2D} = require('../llm_components/gelu');

const fs = require('fs');
const { exit } = require("process");


function mlp(input,weight1,bias1,weight2,bias2,n,p,m,fracBits){
    let linear1_out  = linear(input, weight1, bias1, n, p, m, fracBits);
    let gelu_out = gelu2D(linear1_out);
    let linear2_out = linear(gelu_out, weight2, bias2, n, p, m, fracBits);
    return linear2_out;
}
  module.exports = {
    mlp,
  };
  