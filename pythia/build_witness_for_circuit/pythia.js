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

const {I_layerNorm2D} = require('./basic_components/layerNorm');
const {gptLayer} = require('./llm_components/gptLayer');

const fs = require('fs');
const { exit } = require("process");
const { getShape } = require("./basic_components/util");
function save2DWitnessToFile(witness, filename) {
    const data = witness.map(row => row.join(' ')).join('\n');
    fs.writeFileSync(filename, data);
}
function save3DWitnessToFile(witness, filename) {
    const arrayString = JSON.stringify(witness);
    // Define the file path where you want to save the data
    const filePath = filename;
    // Write the string representation of the array to the file
    fs.writeFile(filePath, arrayString, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Array written to file successfully!');
      }
    });
}
    
function pythia(input, weights, biases,weights_attn_final,biases_attn_final,weights_mlp_1st,biases_mlp_1st,weights_mlp_2nd,biases_mlp_2nd,
                ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,q_root2_inv,a,b_neg,b,c,
                numLayer,numHead,mlp_Linear1_size,n,m,p,dim,fracBits,sequence_length) {


    let gptLayerOut = input;
    //store witness for freidvalds
    let initialLinearLayerMMOut = [];
    keyQueryMM = [];keyQueryMM_aux = [];softmaxValue_aux = []; finalLinearLayer_aux=[];
    mlp_first_aux = [];mlp_second_aux = [];
    for(var i=0;i<numLayer;i++){
        gptLayerOut = gptLayer(gptLayerOut, weights[i], biases[i],weights_attn_final[i],biases_attn_final[i],weights_mlp_1st[i],biases_mlp_1st[i],weights_mlp_2nd[i],biases_mlp_2nd[i],
                                    ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,q_root2_inv,a,b_neg,b,c,                          
                                    n,m,p,mlp_Linear1_size,dim,fracBits,sequence_length,numHead,
                                    i,initialLinearLayerMMOut,keyQueryMM,keyQueryMM_aux,softmaxValue_aux,finalLinearLayer_aux,mlp_first_aux,mlp_second_aux);
    }  
    // log(keyQueryMM[0][0]);
    // exit();
    const witness_initialLinearLayerMMOut = 'witness/initialLinearLayerMMOut.txt';
    save3DWitnessToFile(initialLinearLayerMMOut, witness_initialLinearLayerMMOut);
    //attn mlp
    const witness_keyQueryMM = 'witness/keyQueryMM.txt';
    save3DWitnessToFile(keyQueryMM, witness_keyQueryMM);
    const witness_keyQueryMM_aux = 'witness/keyQueryMM_aux.txt';
    save3DWitnessToFile(keyQueryMM_aux, witness_keyQueryMM_aux);
    const witness_softmaxValue_aux = 'witness/softmaxValue_aux.txt';
    save3DWitnessToFile(softmaxValue_aux, witness_softmaxValue_aux);
    const witness_finalLinearLayer_aux = 'witness/finalLinearLayer_aux.txt';
    save3DWitnessToFile(finalLinearLayer_aux, witness_finalLinearLayer_aux);
    //freivalds mlp
    const witness_mlp_1st_aux = 'witness/mlp_first_aux.txt';
    save3DWitnessToFile(mlp_first_aux, witness_mlp_1st_aux);
    const witness_mlp_2nd_aux = 'witness/mlp_second_aux.txt';
    save3DWitnessToFile(mlp_second_aux, witness_mlp_2nd_aux);


    // final layerNorm 
    let out = I_layerNorm2D(gptLayerOut,fracBits);
    return out;
}
module.exports = {
    pythia,
};
