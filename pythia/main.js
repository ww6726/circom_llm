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
const {pythia} = require('./build_circuit/pythia');

const { log } = require("console");

const fs = require('fs');
const { exit } = require("process");

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

describe("main function for building circuit", function () {
    this.timeout(100000000);
    
    
    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        const N = 4;
        const fracBits = 8;
        let M = fracBits;
        let n = 32;
        let inNum = 32;
        let outNum = 96;
        dim = 2;

    
        var input = [];
        var weight = [];
        var bias = [];

        for (let i = 0; i < n; i++) {
            input[i] = [];
            for (let j = 0; j < inNum; j++) {
                const number = i+j;
                input[i][j] = floatToQ(N,M,number);
            }
        }
        for (let i = 0; i < inNum; i++) {
            weight[i] = [];

            for (let j = 0; j < outNum; j++) {
                const number = (i+j);
                weight[i][j] = floatToQ(N,M,number);
            }
        }
        for (let i = 0; i < n; i++) {
            bias[i] = [];
            for (let j = 0; j < outNum; j++) {
                const number = i+j;
                bias[i][j] = floatToQ(N,M,number);
            }
        }
        //generate weights and bias for MLP

        let mlp_Linear1_size = 4;
        let weight_mlp_1 = [];
        let bias_mlp_1 = [];
        let weight_mlp_2 = [];
        let bias_mlp_2 = [];
     

        for (let i = 0; i < inNum; i++) {
          weight_mlp_1[i] = [];
          for (let j = 0; j < mlp_Linear1_size; j++) {
              const number = i+j;
              weight_mlp_1[i][j] = floatToQ(N,M,number);
          }
        }
        for (let i = 0; i < n; i++) {
          bias_mlp_1[i] = [];
          for (let j = 0; j < mlp_Linear1_size; j++) {
              const number = i+j;
              bias_mlp_1[i][j] = floatToQ(N,M,number);
          }
        }

        for (let i = 0; i < mlp_Linear1_size; i++) {
          weight_mlp_2[i] = [];
          for (let j = 0; j < inNum; j++) {
              const number = i+j;
              weight_mlp_2[i][j] = floatToQ(N,M,number);
          }
        }
        for (let i = 0; i < n; i++) {
          bias_mlp_2[i] = [];
          for (let j = 0; j < inNum; j++) {
              const number = i+j;
              bias_mlp_2[i][j] = floatToQ(N,M,number);
          }
        }

        
        //step 2 - read witness
        const ROPE_COS_FILE = "witness/ROPE_cos.txt";
        const ropeCos = floatToQ_matrix(N,M,readWitness(ROPE_COS_FILE));
        const ROPE_SIN_FILE = "witness/ROPE_sin.txt";
        const ropeSin = floatToQ_matrix(N,M,readWitness(ROPE_SIN_FILE));
        const MASK_FILE = "witness/mask.txt";
        const mask = floatToQ_matrix(N,M,readWitness(MASK_FILE));
        //softmax
        let qln2 = floatToQ(4,M,Math.log(2));
        let a_sm = floatToQ(4,2*fracBits,0.3585);
        let b_sm = floatToQ(4,fracBits,1.353);
        let c_sm = floatToQ(4,4*fracBits,0.344);
        //gelu
        let q_root2_inv = Math.floor((1/Math.sqrt(2))*Math.pow(2,fracBits));  
        let a = Math.floor(-0.2888*Math.pow(2,2*fracBits));
        let b_neg = Math.floor(1.769*Math.pow(2,fracBits));
        let b = Math.floor(-1.769*Math.pow(2,fracBits));
        let c = Math.floor(1* Math.pow(2,4*fracBits));
        
        // var attention = await attn(input, weight, bias,ropeCos,ropeSin,mask,qln2,a_sm,b_sm,c_sm,n,inNum, outNum,dim,M);
        // var mlp_out = await mlp(input, weight_mlp_1, bias_mlp_1,weight_mlp_2,bias_mlp_2,
        //                         q_root2_inv,a,b_neg,b,c,n,inNum,mlp_Linear1_size, fracBits);

        var gpt_out = await gptLayer(input, weight, bias,weight_mlp_1,bias_mlp_1,weight_mlp_2,bias_mlp_2,mask,ropeCos,ropeSin,
                                     qln2,q_root2_inv,a,b_neg,b,c,a_sm,b_sm,c_sm,n,inNum, outNum,mlp_Linear1_size,dim,fracBits); 
        console.log(fieldToReal(gpt_out,fracBits));

        



    });
});