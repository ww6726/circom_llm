const chai = require("chai");
const { log } = require("console");
const path = require("path");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ} = require('../build_circuit/basic_components/util');
const {softmax_} = require('../build_witness/basic_components/softmax');
const {softmax_i} = require('../build_witness/basic_components/softmax');
const {softmax} = require('../build_circuit/basic_components/softmax');

describe("vector softmax test", function () {
    this.timeout(100000000);

    it("check compare softmax results between actual and circom", async () => {
        var x_ = [0.32,-2.39,0.45,0.42];
        var x_I = [];
        const fracBits = 8;
        const num = 4;
       
        for(let i = 0;i<num;i++){
            x_I[i] = floatToQ(4,fracBits,x_[i]); 
        }
        console.log("==================== Actual ==========================");
        const out_ = softmax_(x_);
        console.log(out_);

        
        console.log("==================== softmax_i ==========================");
        let out_i = softmax_i(x_I,fracBits);
        log(out_i);


        console.log("==================== Circuit ==========================");
        let out = await softmax(x_I,fracBits);

        for (let i = 0; i < num; i++) {
            out[i] = parseFloat(Fr.toString(out[i])) / Math.pow(2,fracBits);
        }
        console.log(out);

    });
});