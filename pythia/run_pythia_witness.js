const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {floatToQ,floatToQ_matrix,floatToQ_multiD} = require('./build_circuit/basic_components/util');
const {add,sub,mul,div,sqrt} = require('./build_circuit/basic_components/arithmetics');
const {linear} = require('./build_circuit/basic_components/linear');
const {gptLayer} = require('./build_circuit/llm_components/gptLayer');
const {attn} = require('./build_circuit/llm_components/attention');
const {mlp} = require('./build_circuit/llm_components/mlp');
const {pythia} = require('./build_witness_for_circuit/pythia');

const { log } = require("console");

const fs = require('fs');
const { exit } = require("process");
const { matrixMultiplication } = require("./build_witness/basic_components/util");

function getShape(data) {
    if (Array.isArray(data)) {
      var shape = [];
      var currentLevel = data;
  
      while (Array.isArray(currentLevel)) {
        shape.push(currentLevel.length);
        currentLevel = currentLevel[0];
      }
  
      return shape;
    } else {
      return [];
    }
  }
  function fieldToReal(input,fracBits){
    const out = []
    for (let i = 0; i < input.length; i++) {
        out[i] = [];
        for (let j = 0; j < input[0].length; j++) {
            out[i][j] = parseFloat(Fr.toString(input[i][j])) / (2**(fracBits));
        }
    }
    return out;
  }
  function readWitness(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.trim().split('\n');
    const matrix = lines.map(line => line.split(' ').map(Number));
    return matrix;
  }
  async function read3DWitness(filePath) {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (err) {
      throw err;
    }
  }
  
describe("main function for building circuit", function () {
    this.timeout(100000000);
    
    
    it("test", async () => {

    
         //make each input, witness 3D.
         let N = 4;// deprecated. Remove this later

         let fracBits = 8;
         let numLayer = 6;
         let numHead = 8;
         let n = 32;
         let m = 32;
         let p = 96;
         let mlp_Linear1_size = 4;
 
         let dim = 2;
         //weights, biases 
         let input = [];//2D
         let weights = [];//3D
         let biases = [];//3D
         let weights_attn_final = [];//3D
         let biases_attn_final = [];//3D
         let weights_mlp_1st=[];//3D;
         let biases_mlp_1st=[];
         let weights_mlp_2nd=[];
         let biases_mlp_2nd=[];
         let sequence_length = n;
 
         //initialize all winesses (soon be replaced by real witnesses)
         for(var i =0;i<n;i++){
           input[i] = [];
           for(var j =0;j<m;j++){
             input[i][j] = floatToQ(N,fracBits,i+j);
           }
         }
         //attn part
         for(var l = 0;l<numLayer;l++){
           weights[l] = [];
           for(var i =0;i<m;i++){
             weights[l][i] = [];
             for(var j =0;j<p;j++){
               weights[l][i][j] = floatToQ(N,fracBits,i+j);
             }
           }
         }
         for(var l = 0;l<numLayer;l++){
           biases[l] = [];
           for(var i =0;i<n;i++){
             biases[l][i] = [];
             for(var j =0;j<p;j++){
               biases[l][i][j] = floatToQ(N,fracBits,i+j);
             }
           }
         }
         for(var l = 0;l<numLayer;l++){
          weights_attn_final[l] = [];
          for(var i =0;i<m;i++){
            weights_attn_final[l][i] = [];
            for(var j =0;j<m;j++){
              weights_attn_final[l][i][j] = floatToQ(N,fracBits,i+j);
            }
          }
        }
        for(var l = 0;l<numLayer;l++){
          biases_attn_final[l] = [];
          for(var i =0;i<n;i++){
            biases_attn_final[l][i] = [];
            for(var j =0;j<m;j++){
              biases_attn_final[l][i][j] = floatToQ(N,fracBits,i+j);
            }
          }
        }
         //mlp part
         for(var l = 0;l<numLayer;l++){
           weights_mlp_1st[l] = [];
           for(var i =0;i<m;i++){
             weights_mlp_1st[l][i] = [];
             for(var j =0;j<mlp_Linear1_size;j++){
               weights_mlp_1st[l][i][j] = floatToQ(N,fracBits,i+j);
             }
           }
         }
         for(var l = 0;l<numLayer;l++){
           biases_mlp_1st[l] = [];
           for(var i =0;i<n;i++){
             biases_mlp_1st[l][i] = [];
             for(var j =0;j<mlp_Linear1_size;j++){
               biases_mlp_1st[l][i][j] = floatToQ(N,fracBits,i+j);
             }
           }
         }
 
         for(var l = 0;l<numLayer;l++){
           weights_mlp_2nd[l] = [];
           for(var i =0;i<mlp_Linear1_size;i++){
             weights_mlp_2nd[l][i] = [];
             for(var j =0;j<m;j++){
               weights_mlp_2nd[l][i][j] = floatToQ(N,fracBits,i+j);
             }
           }
         }
         for(var l = 0;l<numLayer;l++){
           biases_mlp_2nd[l] = [];
           for(var i =0;i<n;i++){
             biases_mlp_2nd[l][i] = [];
             for(var j =0;j<m;j++){
               biases_mlp_2nd[l][i][j] = floatToQ(N,fracBits,i+j);
             }
           }
         }
           //step 2 - read witness
        const ROPE_COS_FILE = "witness/ROPE_cos.txt";
        const ropeCos = floatToQ_matrix(N,fracBits,readWitness(ROPE_COS_FILE));
        const ROPE_SIN_FILE = "witness/ROPE_sin.txt";
        const ropeSin = floatToQ_matrix(N,fracBits,readWitness(ROPE_SIN_FILE));
        const MASK_FILE = "witness/mask.txt";
        const mask = floatToQ_matrix(N,fracBits,readWitness(MASK_FILE));

         //witness for Freidvalds
         const initialLinearLayerMMOut = "witness/initialLinearLayerMMOut.txt";
  
        //softmax
        let qln2 = floatToQ(4,fracBits,Math.log(2));
        let a_sm = floatToQ(4,2*fracBits,0.3585);
        let b_sm = floatToQ(4,fracBits,1.353);
        let c_sm = floatToQ(4,4*fracBits,0.344);
        //gelu
        let q_root2_inv = Math.floor((1/Math.sqrt(2))*Math.pow(2,fracBits));  
        let a = Math.floor(-0.2888*Math.pow(2,2*fracBits));
        let b_neg = Math.floor(1.769*Math.pow(2,fracBits));
        let b = Math.floor(-1.769*Math.pow(2,fracBits));
        let c = Math.floor(1* Math.pow(2,4*fracBits));
  
        let pythia_out = pythia(input, weights, biases,weights_attn_final,biases_attn_final,weights_mlp_1st,biases_mlp_1st,weights_mlp_2nd,biases_mlp_2nd,
                                  ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,q_root2_inv,a,b_neg,b,c,
                                  numLayer,numHead,mlp_Linear1_size,n,m,p,dim,fracBits,sequence_length);
        // log(fieldToReal(pythia_out,fracBits));
        // log(getShape(pythia_out));
 
    });
});