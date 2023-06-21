const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {floatToQ,QToFloat,floatToQ_signed} = require('./build/basic_components/util');
const {add,sub,mul,div,sqrt} = require('./build/basic_components/arithmetics');
const {linear} = require('./build/basic_components/linear');

describe("main function", function () {
    this.timeout(100000000);

    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        const N = 4;
        const M = 4;

        const inNum = 2;
        const outNum = 1;
        var input = [];
        var weight = [];
        var bias = [];

        for (let i = 0; i < 1; i++) {
            input[i] = [];
            for (let j = 0; j < inNum; j++) {
                input[i][j] = floatToQ(N,M,1.32);
                // input[i][j] = 1;
            }
        }
        for (let i = 0; i < inNum; i++) {
            weight[i] = [];
            for (let j = 0; j < outNum; j++) {
                weight[i][j] = floatToQ(N,M,1.23);
                // weight[i][j] = 1;
            }
        }
        for (let i = 0; i < 1; i++) {
            bias[i] = [];
            for (let j = 0; j < outNum; j++) {
                bias[i][j] = floatToQ(N,M,1.39);
                // bias[i][j] = 1;
            }
        }
        console.log(input);
        console.log(weight);
        console.log(bias);

        var result;
        result = await linear(input,weight,bias,inNum,outNum);




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