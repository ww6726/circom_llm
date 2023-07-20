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

const {layerNorm2D} = require('./basic_components/layerNorm');
const {gptLayer} = require('./llm_components/gptLayer');

const fs = require('fs');
const { exit } = require("process");

function pythia(input, weights, biases,weights_mlp_1st,biases_mlp_1st,weights_mlp_2nd,biases_mlp_2nd,
                    numLayer,mlp_Linear1_size,n,m,p,dim,fracBits,sequence_length) {
    let gptLayerOut = input;
    for(var i=0;i<numLayer;i++){    
        gptLayerOut = gptLayer(gptLayerOut, weights[i], biases[i],weights_mlp_1st[i],biases_mlp_1st[i],weights_mlp_2nd[i],biases_mlp_2nd[i],
                                    n,m,p,mlp_Linear1_size,dim,fracBits,sequence_length);
    }                    
    // final layerNorm 
    let out = layerNorm2D(gptLayerOut);
    return out;
}
module.exports = {
    pythia,
};
