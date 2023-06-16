const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;
const {floatToQ,QToFloat} = require('../inputHelper');

describe("Fixed Point arithemetic test", function () {
    this.timeout(100000000);

    it("multiplication", async () => {
        const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        //await circuit.loadConstraints();
        //assert.equal(circuit.nVars, 18);
        //assert.equal(circuit.constraints.length, 6);
        const N = 12;
        const M = 25;
        const INPUT = {
            "a": "-3.51",
            "b": "3.53",
        }
        const Input16BitFixedPoint = {};
        for (const key in INPUT) {
            Input16BitFixedPoint[key] = floatToQ(N,M,INPUT[key]);
        }

        const witness = await circuit.calculateWitness(Input16BitFixedPoint, true);
        const output = witness[1];
        console.log(output);

        console.log(QToFloat(2*N,N+M-(2*N),parseInt(Fr.toString(output))));

        assert(parseFloat(Fr.toString(output)),0.035)

        // assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        // assert(Fr.eq(Fr.e(witness[1]),Fr.e(1*4+2*5+3*6+10)));
        // assert(Fr.eq(Fr.e(witness[2]),Fr.e(1*7+2*8+3*9+11)));
    });
});