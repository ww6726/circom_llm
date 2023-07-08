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
const {max} = require('../build_circuit/basic_components/max');

describe("test max", function () {
    this.timeout(100000000);
    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        const N = 4;
        const M = 12;// this is number of bits to represent fractions

        let num = 5;
        let n = 32;
        var input = [3,22,4,5,1];
        
        var out = await max(input,n);
        console.log((out));




    });
});