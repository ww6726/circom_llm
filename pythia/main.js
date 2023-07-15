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
const {attn} = require('./build_circuit/llm_components/attention');
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
        const M = 4;

        const n = 32;
        const inNum = 32;
        const outNum = 96;
        dim = 2;

        var input_ = [];
        var weight_ = [];
        var bias_ = [];

        var input = [];
        var weight = [];
        var bias = [];

        for (let i = 0; i < n; i++) {
            input[i] = [];
            input_[i] = [];

            for (let j = 0; j < inNum; j++) {
                const number = 0.34242;
                input[i][j] = floatToQ(N,M,number);
                input_[i][j] = number;
            }
        }
        for (let i = 0; i < inNum; i++) {
            weight[i] = [];
            weight_[i] = [];

            for (let j = 0; j < outNum; j++) {
                const number = -0.234236;
                weight[i][j] = floatToQ(N,M,number);
                weight_[i][j] = number;
            }
        }
        for (let i = 0; i < n; i++) {
            bias[i] = [];
            bias_[i] = [];

            for (let j = 0; j < outNum; j++) {
                const number = -0.3329;
                bias[i][j] = floatToQ(N,M,number);
                bias_[i][j] = number;
            }
        }

        //step 2 - read witness
        const ROPE_COS_FILE = "witness/ROPE_cos.txt";
        const ropeCos = floatToQ_matrix(N,M,readWitness(ROPE_COS_FILE));
        const ROPE_SIN_FILE = "witness/ROPE_sin.txt";
        const ropeSin = floatToQ_matrix(N,M,readWitness(ROPE_SIN_FILE));
        const MASK_FILE = "witness/mask.txt";
        const mask = floatToQ_matrix(N,M,readWitness(MASK_FILE));

        var attention = await attn(input, weight, bias,ropeCos,ropeSin,mask,n,inNum, outNum,dim,M);
        // console.log(fieldToReal(attention,M));
        log(getShape(attention));
     
    });
});