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
const {getShape,floatToQ,QToFloat,floatToQ_signed,fieldToReal,elementwiseAdd} = require('../basic_components/util');
const {matrixMultiplication,linear} = require('../basic_components/linear');
const {I_layerNorm2D} = require('../basic_components/layerNorm');
const {attn} = require('../llm_components/attention');
const {mlp} = require('../llm_components/mlp');

const fs = require('fs');
const { exit } = require("process");
const { exitProcess } = require("yargs");





function gptLayer(input, weight, bias,weights_attn_final,biases_attn_final,weight_mlp_1,bias_mlp_1,weight_mlp_2,bias_mlp_2,
                    ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,q_root2_inv,a,b_neg,b,c,
                    n,inNum, outNum,mlp_Linear1_size,dim,fracBits,sequence_length,numHead,
                    layerID,initialLinearLayerMMOuts,keyQueryMM,keyQueryMM_aux) {
    let ln_out_first = I_layerNorm2D(input,fracBits);
    let attention = attn(ln_out_first, weight, bias,weights_attn_final,biases_attn_final,n,inNum, outNum, dim, fracBits,sequence_length,numHead,
                    ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,
                    layerID,initialLinearLayerMMOuts,keyQueryMM,keyQueryMM_aux);
    // log(attention);
    // exit();                

    let ln_out = I_layerNorm2D(attention,fracBits);
    let mlp_out = mlp(ln_out,weight_mlp_1,bias_mlp_1,weight_mlp_2,bias_mlp_2,n,inNum,mlp_Linear1_size,fracBits,
                        q_root2_inv,a,b_neg,b,c,);
    
    //residual layer
    let gptLayer_out = elementwiseAdd(attention,mlp_out);
    return gptLayer_out;
}
module.exports = {
    gptLayer,
};
