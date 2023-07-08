const chai = require("chai");
const path = require("path");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ} = require('../build_circuit/basic_components/util');
const {softmax_} = require('../build_witness/basic_components/softmax');
const {softmax} = require('../build_circuit/basic_components/softmax');

describe("vector softmax test", function () {
    this.timeout(100000000);

    it("check compare softmax results between actual and circom", async () => {
        var x_ = [0.32,0.9,3.4354,2.42];
        var x = [];
        const fracBits = 4;
        const num = 4;
       
        for(let i = 0;i<num;i++){
            x[i] = floatToQ(4,fracBits,x_[i]); 
        }
        console.log("==================== Actual ==========================");
        const out_ = softmax_(x_);
        console.log(out_);

 
        console.log("==================== Circuit ==========================");
        let out = await softmax(x,fracBits);

        for (let i = 0; i < num; i++) {
            out[i] = parseFloat(Fr.toString(out[i]));
        }
        console.log(out);

    });
});