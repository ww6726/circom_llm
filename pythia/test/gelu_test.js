const chai = require("chai");
const path = require("path");
const { log } = require("console");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ} = require('../build_circuit/basic_components/util');
const {gelu_,gelu_i} = require('../build_witness/llm_components/gelu');
const {gelu} = require('../build_circuit/basic_components/gelu');

describe("gelu test", function () {
    this.timeout(100000000);
    let fracBits = 8;

    it("check compare gelu results between python and circom", async () => {
        let  x = [-0.77,0.32,32.0];
        let x_I = []
        let n = x.length;
        for(let i = 0; i < n; i++){
            x_I[i] = floatToQ(4,fracBits,x[i]);
        }
  
        console.log("==================== gelu ==========================");
        for (let i = 0; i < n; i++) {
            log(gelu_(x[i]));
        }
        console.log("==================== i-gelu ==========================");
        for (let i = 0; i < n; i++) {
            log(gelu_i(x_I[i],fracBits));
        }
        console.log("==================== circom gelu ==========================");

        let out = await gelu(x_I,fracBits);
        for (let i = 0; i < n; i++) {
            log(parseFloat(Fr.toString(out[i]))/(Math.pow(2,fracBits)));
        }
        // log( parseFloat(Fr.toString(out))/(Math.pow(2,fracBits)));

        // log("==================== Circom ==========================");
        // let out = await gelu(x,fracBits);

    });
});