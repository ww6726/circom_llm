const chai = require("chai");
const path = require("path");
const { log } = require("console");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ} = require('../build_circuit/basic_components/util');
const {squareRoot} = require('../build_witness/basic_components/squareRoot');
// const {sqrt} = require('../build_circuit/basic_components/sqrt');

describe("sqrt test", function () {
    this.timeout(100000000);
    let fracBits = 16;

    it("check to see if sqrt from  IBERT is good", async () => {
        let x = 29999;
        let x_I = floatToQ(4,fracBits,x);

        log("==================== Real sqrt ==========================");
        log("Input: ", x);
        log(Math.sqrt(x))
        

        log("==================== I_sqrt ==========================");
        log("Input: ", x_I);
        let root = squareRoot(x_I,fracBits);
        log(root);
        log(root / Math.sqrt(Math.pow(2,fracBits)));
   

        // log("==================== Circom ==========================");
        // let out = await gelu(x,fracBits);

    });
});