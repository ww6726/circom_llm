const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {floatToQ,getShape,QToFloat,floatToQ_signed} = require('../build_circuit/basic_components/util');
const {add,sub,mul,div,sqrt} = require('../build_circuit/basic_components/arithmetics');
const {linear} = require('../build_circuit/basic_components/linear');
const {attn} = require('../build_circuit/llm_components/attention');

function matrixMultiplication(matrixA, matrixB) {
    const rowsA = matrixA.length;
    const columnsA = matrixA[0].length;
    const columnsB = matrixB[0].length;
  
    if (columnsA !== matrixB.length) {
      throw new Error("Invalid matrix dimensions. Columns of matrixA must match rows of matrixB.");
    }
  
    const result = new Array(rowsA);
    for (let i = 0; i < rowsA; i++) {
      result[i] = new Array(columnsB);
      for (let j = 0; j < columnsB; j++) {
        result[i][j] = 0;
        for (let k = 0; k < columnsA; k++) {
          result[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }
    return result;
  }
  function addBias(matrixA, matrixB) {
    const rows = matrixA.length;
    const columns = matrixA[0].length;
  
    if (rows !== matrixB.length || columns !== matrixB[0].length) {
      throw new Error("Matrix dimensions must match for element-wise addition.");
    }
  
    const result = new Array(rows);
    for (let i = 0; i < rows; i++) {
      result[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        result[i][j] = matrixA[i][j] + matrixB[i][j];
      }
    }
  
    return result;
  }

describe("test linear module", function () {
    this.timeout(100000000);

    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        const N = 4;
        const M = 12;// this is number of bits to represent fractions

        const n = 2;
        const inNum = 2;
        const outNum = 2;

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
                const number = i+j;
                input[i][j] = floatToQ(N,M,number);
                input_[i][j] = number;
            }
        }
        for (let i = 0; i < inNum; i++) {
            weight[i] = [];
            weight_[i] = [];

            for (let j = 0; j < outNum; j++) {
                const number = i+j;
                weight[i][j] = floatToQ(N,M,number);
                weight_[i][j] = number;
            }
        }
        for (let i = 0; i < n; i++) {
            bias[i] = [];
            bias_[i] = [];

            for (let j = 0; j < outNum; j++) {
                const number = i+j;
                bias[i][j] = floatToQ(N,M,number);
                bias_[i][j] = number;
            }
        }
        console.log("==================== Actual ==========================");
        console.log(input_);
        console.log(weight_);
        console.log(bias_);
        var linear_Out = addBias(matrixMultiplication(input_,weight_),bias_);
        var linear_Out2 = addBias(matrixMultiplication(linear_Out,weight_),bias_)
        console.log(linear_Out2);
        console.log("==================== Circuit ==========================");
        console.log(input);
        console.log(weight);
        console.log(bias);
        var linearOut = await linear(input,weight,bias,n,inNum,outNum,M);
        var linearOut2 = await linear(linearOut,weight,bias,n,inNum,outNum,M);

        //convert back to real numeber;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < outNum; j++) {
              linearOut2[i][j] = parseFloat(Fr.toString(linearOut2[i][j])) / (2**(M));
            }
        }
        console.log(linearOut2);




        

        // const INPUT = {
        //     "a": a,
        //     "b": b,
        // }
        // const Input16BitFixedPoint = {};
        // for (const key in INPUT) {

        //     if(INPUT[key]<0){
        //         INPUT[key] = INPUT[key]*-1
        //         Input16BitFixedPoint[key] = F - Scalar.fromString(floatToQ(N,M,INPUT[key]));
        //     }else{
        //         Input16BitFixedPoint[key] = Scalar.fromString(floatToQ(N,M,INPUT[key]));
        //     }
        // }
        // const witness = await circuit.calculateWitness(Input16BitFixedPoint, true);
        // var quotient = witness[1];
        // var remainder = witness[2];

        // quotient = parseInt(Fr.toString(quotient));
        // remainder = parseInt(Fr.toString(remainder));

        // console.log("======================================");
        // console.log(Fr.toString(quotient));
        // if(quotient < 0){
        //     console.log("quotient: ", -QToFloat(2*N,M,parseInt(Fr.toString(-quotient))));
        // }
        // else{
        //     console.log("quotient: ", QToFloat(2*N,M,parseInt(Fr.toString(quotient))));
        // }

        // if(remainder < 0){
        //     console.log("remainder: ", -QToFloat(2*N,M,parseInt(Fr.toString(-remainder))));
        // }
        // else{
        //     console.log("remainder: ", QToFloat(2*N,M,parseInt(Fr.toString(remainder))));
        // }
        // console.log(QToFloat(2*N,N+M-(2*N),parseInt(Fr.toString(output))));
        // assert(parseFloat(Fr.toString(output)),0.035)


        // assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        // assert(Fr.eq(Fr.e(witness[1]),Fr.e(1*4+2*5+3*6+10)));
        // assert(Fr.eq(Fr.e(witness[2]),Fr.e(1*7+2*8+3*9+11)));
    
    });
});