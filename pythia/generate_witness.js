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
const {gelu,gelu_poly} = require('./build_witness/llm_components/gelu');

const {softmax,softmax_,softmax_poly,softmax_poly_i} = require('./build_witness/basic_components/softmax');


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
describe("main function for generating witness", function () {
    this.timeout(100000000);

    it("test", async () => {
        const N = 4;
        const M = 4;

        const n = 32;
        const inNum = 32;
        const outNum = 96;

        var input = [];
        var weight = [];
        var bias = [];


        for (let i = 0; i < n; i++) {
            input[i] = [];
            for (let j = 0; j < inNum; j++) {
                const number = 0.34242;
                input[i][j] = number;
            }
        }
        for (let i = 0; i < inNum; i++) {
            weight[i] = [];

            for (let j = 0; j < outNum; j++) {
                const number = -0.234236;
                weight[i][j] = number;
            }
        }
        for (let i = 0; i < n; i++) {
            bias[i] = [];
            for (let j = 0; j < outNum; j++) {
                const number = -0.3329;
                bias[i][j] = number;
            }
        }
        sequence_length = n;
        // var attention = attn(input, weight, bias,n,inNum, outNum,M,sequence_length);
        // console.log((attention));

        // const x = -0.898;
        // console.log("input: ",x);

        // console.log("Ramy's polynomial approximation: ");
        // var gelu_out2 = gelu_poly(x);
        // console.log(gelu_out2);


        // Example usage
        var x = [0.32,0.39,0.45,0.42];
        
        //this is actual softmax
        var output = softmax_(x);
        console.log(`Exact value: ${output}`);
        console.log("====================================");

        //test paper's softmax on real numbers
        const softmax_approx = softmax_poly(x);
        console.log(`Approximation: ${softmax_approx}`);
        console.log("====================================");


        //test paper's softmax using integers
        for(var i =0;i<x.length;i++){
            x[i] = floatToQ(N,M,x[i]);
        }
        let softmax_approx_i = softmax_poly_i(x,M);
        for(var i =0;i<softmax_approx_i.length;i++){
            softmax_approx_i[i] = floatToQ(N,M,softmax_approx_i[i]);
        }
        console.log(`Approximation_i: ${softmax_approx_i}`);

    });
});