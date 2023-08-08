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
const {truncate} = require('../build_circuit/basic_components/truncate');

const {max} = require('../build_circuit/basic_components/max');
const { log } = require("console");

describe("truncate test", function () {
    this.timeout(100000000);
    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        const N = 4;
        const fracBits = 8;// this is number of bits to represent fractions

        let x = -12311.2;
        let x_I = floatToQ(N,fracBits,x);

        log("============= js ===============");

        //js
        log(Math.trunc(x_I / Math.pow(2,fracBits)));

        log("============= circom ===============");
        let out = await truncate(x_I,fracBits);
        out = parseFloat(Fr.toString(out));
        log(out);
        //circom


    });
});