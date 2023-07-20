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
const {layerNorm2D} = require('../basic_components/layerNorm');
const {attn} = require('../llm_components/attention');
const {mlp} = require('../llm_components/mlp');

const fs = require('fs');
const { exit } = require("process");






function gptLayer(input, weight, bias,weight_mlp_1,bias_mlp_1,weight_mlp_2,bias_mlp_2,
                    n,inNum, outNum,mlp_Linear1_size,dim,fracBits,sequence_length) {

    let attention = attn(input, weight, bias,n,inNum, outNum, dim, fracBits,sequence_length);
    let ln_out = layerNorm2D(attention);
    let mlp_out = mlp(ln_out,weight_mlp_1,bias_mlp_1,weight_mlp_2,bias_mlp_2,n,inNum,mlp_Linear1_size,fracBits);
    
    return mlp_out;
}
module.exports = {
    gptLayer,
};
