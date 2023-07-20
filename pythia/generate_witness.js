const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {floatToQ,QToFloat,floatToQ_signed} = require('./build_witness/basic_components/util');
const {linear} = require('./build_witness/basic_components/linear');
const {attn} = require('./build_witness/llm_components/attention');
const {gptLayer} = require('./build_witness/llm_components/gptLayer');
const {pythia} = require('./build_witness/pythia');

const {softmax,softmax_,softmax_poly,softmax_poly_i} = require('./build_witness/basic_components/softmax');
const { log } = require("console");


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
describe("main function for generating witness and verifying", function () {
    this.timeout(100000000);

    it("test", async () => {
        // const N = 4;
        // const M = 8;
        // let fracBits = M;
        // const n = 32;
        // const inNum = 32;
        // const outNum = 96;
        // let dim = 2;

        // var input = [];
        // var weight = [];
        // var bias = [];


        // for (let i = 0; i < n; i++) {
        //     input[i] = [];
        //     for (let j = 0; j < inNum; j++) {
        //         const number = i+j;
        //         input[i][j] = number;
        //     }
        // }
        // for (let i = 0; i < inNum; i++) {
        //     weight[i] = [];

        //     for (let j = 0; j < outNum; j++) {
        //         const number = i+j;
        //         weight[i][j] = number;
        //     }
        // }
        // for (let i = 0; i < n; i++) {
        //     bias[i] = [];
        //     for (let j = 0; j < outNum; j++) {
        //         const number = i+j;
        //         bias[i][j] = number;
        //     }
        // }
        
        // sequence_length = n;

        // //generate weights and bias for MLP 1,2,3
        // let mlp_Linear1_size = 4;
        // let weight_mlp_1 = [];
        // let bias_mlp_1 = [];
        // let weight_mlp_2 = [];
        // let bias_mlp_2 = [];
     

        // for (let i = 0; i < inNum; i++) {
        //   weight_mlp_1[i] = [];
        //   for (let j = 0; j < mlp_Linear1_size; j++) {
        //       weight_mlp_1[i][j] = i+j;
        //   }
        // }
        // for (let i = 0; i < n; i++) {
        //   bias_mlp_1[i] = [];
        //   for (let j = 0; j < mlp_Linear1_size; j++) {
        //       bias_mlp_1[i][j] = i+j;
        //   }
        // }

        // for (let i = 0; i < mlp_Linear1_size; i++) {
        //   weight_mlp_2[i] = [];
        //   for (let j = 0; j < inNum; j++) {
        //       weight_mlp_2[i][j] = i+j;
        //   }
        // }
        // for (let i = 0; i < n; i++) {
        //   bias_mlp_2[i] = [];
        //   for (let j = 0; j < inNum; j++) {
        //       bias_mlp_2[i][j] = i+j;
        //   }
        // }
        // var attention = attn(input, weight, bias,n,inNum, outNum,fracBits,sequence_length);

        // let gpt_out = gptLayer(input, weight, bias,weight_mlp_1,bias_mlp_1,weight_mlp_2,bias_mlp_2,
        //                         n,inNum, outNum,mlp_Linear1_size,dim,fracBits,sequence_length);



        // ===========================================================================
        // ===========================================================================
        // ========================    pythia test    ================================
        // ===========================================================================
        // ===========================================================================

        //make each input, witness 3D.
        let fracBits = 8;
        let numLayer = 6;
        let n = 32;
        let m = 32;
        let p = 96;
        let mlp_Linear1_size = 4;

        let dim = 2;
        //weights, biases 
        let input = [];//2D
        let weights = [];//3D
        let biases = [];//3D
        let weights_mlp_1st=[];//3D;
        let biases_mlp_1st=[];
        let weights_mlp_2nd=[];
        let biases_mlp_2nd=[];
        let sequence_length = n;

        //initialize all winesses (soon be replaced by real witnesses)
        for(var i =0;i<n;i++){
          input[i] = []
          for(var j =0;j<m;j++){
            input[i][j] = i+j;
          }
        }
        //attn part
        for(var l = 0;l<numLayer;l++){
          weights[l] = [];
          for(var i =0;i<m;i++){
            weights[l][i] = [];
            for(var j =0;j<p;j++){
              weights[l][i][j] = i+j;
            }
          }
        }
        for(var l = 0;l<numLayer;l++){
          biases[l] = [];
          for(var i =0;i<n;i++){
            biases[l][i] = [];
            for(var j =0;j<p;j++){
              biases[l][i][j] = i+j;
            }
          }
        }
        //mlp part
        for(var l = 0;l<numLayer;l++){
          weights_mlp_1st[l] = [];
          for(var i =0;i<m;i++){
            weights_mlp_1st[l][i] = [];
            for(var j =0;j<mlp_Linear1_size;j++){
              weights_mlp_1st[l][i][j] = i*j;
            }
          }
        }
        for(var l = 0;l<numLayer;l++){
          biases_mlp_1st[l] = [];
          for(var i =0;i<n;i++){
            biases_mlp_1st[l][i] = [];
            for(var j =0;j<mlp_Linear1_size;j++){
              biases_mlp_1st[l][i][j] = i*j;
            }
          }
        }

        for(var l = 0;l<numLayer;l++){
          weights_mlp_2nd[l] = [];
          for(var i =0;i<mlp_Linear1_size;i++){
            weights_mlp_2nd[l][i] = [];
            for(var j =0;j<m;j++){
              weights_mlp_2nd[l][i][j] = i*j;
            }
          }
        }
        for(var l = 0;l<numLayer;l++){
          biases_mlp_2nd[l] = [];
          for(var i =0;i<n;i++){
            biases_mlp_2nd[l][i] = [];
            for(var j =0;j<m;j++){
              biases_mlp_2nd[l][i][j] = i*j;
            }
          }
        }

        
        

        let pythia_out = pythia(input, weights, biases,weights_mlp_1st,biases_mlp_1st,weights_mlp_2nd,biases_mlp_2nd,
                                numLayer,mlp_Linear1_size,n,m,p,dim,fracBits,sequence_length);
                                

    });
});