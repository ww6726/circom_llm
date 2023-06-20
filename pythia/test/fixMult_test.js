const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {floatToQ,QToFloat,floatToQ_signed} = require('../inputHelper');

describe("Fixed Point arithemetic test", function () {
    this.timeout(100000000);

    it("multiplication", async () => {
        const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        //await circuit.loadConstraints();
        //assert.equal(circuit.nVars, 18);
        //assert.equal(circuit.constraints.length, 6);
        const N = 4;
        const M = 8;
        const INPUT = {
            "a": 5.42,
            "b": 2.32,
        
        }
        const Input16BitFixedPoint = {};
        for (const key in INPUT) {

            if(INPUT[key]<0){
                INPUT[key] = INPUT[key]*-1
                Input16BitFixedPoint[key] = F - Scalar.fromString(floatToQ(N,M,INPUT[key]));
            }else{
                Input16BitFixedPoint[key] = Scalar.fromString(floatToQ(N,M,INPUT[key]));
            }
            
        }
        const witness = await circuit.calculateWitness(Input16BitFixedPoint, true);
        var quotient = witness[1];
        var remainder = witness[2];

        quotient = parseInt(Fr.toString(quotient));
        remainder = parseInt(Fr.toString(remainder));

        console.log("======================================");
        console.log(Fr.toString(quotient));
        if(quotient < 0){
            console.log("quotient: ", -QToFloat(2*N,M,parseInt(Fr.toString(-quotient))));
        }
        else{
            console.log("quotient: ", QToFloat(2*N,M,parseInt(Fr.toString(quotient))));
        }

        if(remainder < 0){
            console.log("remainder: ", -QToFloat(2*N,M,parseInt(Fr.toString(-remainder))));
        }
        else{
            console.log("remainder: ", QToFloat(2*N,M,parseInt(Fr.toString(remainder))));
        }
        // console.log(QToFloat(2*N,N+M-(2*N),parseInt(Fr.toString(output))));
        // assert(parseFloat(Fr.toString(output)),0.035)


        // assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        // assert(Fr.eq(Fr.e(witness[1]),Fr.e(1*4+2*5+3*6+10)));
        // assert(Fr.eq(Fr.e(witness[2]),Fr.e(1*7+2*8+3*9+11)));
    });
});