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


const {gptLayer} = require("./llm_components/gptLayer");

const fs = require('fs');



function generateCircomFile(numLayer,n,m,p,attention_dim,mlp_Linear1_size,fracBits) {
  const content = `pragma circom 2.0.0;
include "../../circuits/pythia.circom";

component main = Pythia(${numLayer},${n},${m},${p},${attention_dim},${mlp_Linear1_size},${fracBits});`;
  fs.writeFileSync(path.join(__dirname, "/circom_runner", "pythia.circom"), content);
}


async function pythia(input, weights, biases,weights_mlp_1st,biases_mlp_1st,weights_mlp_2nd,biases_mlp_2nd,
                        ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,q_root2_inv,a,b_neg,b,c,
                        numLayer,mlp_Linear1_size,n,m,p,dim,fracBits) {
                    
    
  let circuit;
  generateCircomFile(numLayer,n,m,p,dim,mlp_Linear1_size,fracBits);
  circuit = await wasm_tester(path.join(__dirname, "/circom_runner", "pythia.circom"));
  const INPUT = {
      "in": input,
      "weights": weights,
      "biases": biases,

      "rope_cos": ropeCos,
      "rope_sin": ropeSin,
      "mask": mask,
      
      "qln2": qln2,
      "a_sm": a_sm,
      "b_sm": b_sm,
      "c_sm": c_sm,

      "weights_mlp_1st": weights_mlp_1st,
      "biases_mlp_1st": biases_mlp_1st,
      "weights_mlp_2nd": weights_mlp_2nd,
      "biases_mlp_2nd": biases_mlp_2nd,

      "q_root2_inv": q_root2_inv,
      "gelu_a": a,
      "gelu_b_neg": b_neg,
      "gelu_b": b,
      "gelu_c": c,
  }
  const witness = await circuit.calculateWitness(INPUT, true);
  var ret = [];
  var idx = 1;
  for(let i = 0;i <n;i++){
    ret[i] = [];
    for(let j = 0;j <n;j++){
      ret[i][j] = (witness[idx++]);
    }
  }
  return ret;
}
module.exports = {
    pythia,
};