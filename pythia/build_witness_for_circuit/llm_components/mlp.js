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
const {getShape,floatToQ,QToFloat,floatToQ_signed,matmulTruncate,fieldToReal} = require('../basic_components/util');
const {matrixMultiplication,linear, addBias} = require('../basic_components/linear');
const {gelu_,gelu2D,gelu_i_2d} = require('../llm_components/gelu');

const fs = require('fs');
const { exit } = require("process");


function mlp(input,weight1,bias1,weight2,bias2,n,p,m,fracBits,
              layer_ID, mlp_first_aux,mlp_second_aux){
    let linear1_out = matmulTruncate(input,weight1,fracBits);
    linear1_out = addBias(linear1_out,bias1);
    mlp_first_aux[layer_ID] = matrixMultiplication(input,weight1);
    
    let gelu_out = gelu_i_2d(linear1_out,fracBits);
    
    let linear2_out = matmulTruncate(gelu_out, weight2,fracBits);
    mlp_second_aux[layer_ID] = matrixMultiplication(gelu_out,weight2);
    linear2_out = addBias(linear2_out,bias2);

    return linear2_out;
}
module.exports = {
  mlp,
};
