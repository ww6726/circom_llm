const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {floatToQ,getShape} = require('../build_circuit/basic_components/util');
const {split} = require('../build_circuit/basic_components/split');

describe("test split", function () {
    this.timeout(100000000);
    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        const N = 4;
        const M = 12;// this is number of bits to represent fractions

        const row = 32;
        const col = 96;
        var input = [];
        for (let i = 0; i < row; i++) {
            input[i] = [];
            for (let j = 0; j < col; j++) {
                const number = i*col + j;
                input[i][j] = number;

                // input[i][j] = floatToQ(N,M,number);
            }
        }
        var out = await split(input,row,col,8);
        console.log()
        console.log(getShape(out));




    });
});