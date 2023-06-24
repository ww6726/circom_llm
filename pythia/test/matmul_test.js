const chai = require("chai");
const path = require("path");
const { matmul } = require("../build/basic_components/matmul");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ,matrixMultiplication} = require('../build/basic_components/util');
describe("Matrix multiplication test", function () {
    this.timeout(100000000);

    it("should a n by m matrix with a m by p matrix", async () => {
        
        const fracBits = 4;
        const a_ = [];
        const b_ = [];

        const a = [];
        const b = [];
        
        const m = 2;
        const n = 2;
        const p = 2;
        
        for(let i = 0;i<m;i++){
            a[i] = [];
            a_[i] = [];
            for(let j = 0;j <n;j++){
                const number = Math.random() * 8 - 4;
                a[i][j] = floatToQ(4,fracBits,number);
                a_[i][j] = number;

            }
        }
        for(let i = 0;i<n;i++){
            b[i] = [];
            b_[i] = [];
            for(let j = 0;j <p;j++){
                const number = Math.random() * 8 - 4;
                b[i][j] = floatToQ(4,fracBits,number);
                b_[i][j] = number;
            }
        }
        console.log("==================== Actual ==========================");
        const out_ = matrixMultiplication(a_,b_);
        console.log(out_);

 
        const out = await matmul(a,b,fracBits);
        console.log("==================== Circuit ==========================");

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < p; j++) {
                out[i][j] = parseFloat(Fr.toString(out[i][j])) / (2**(fracBits));
            }
        }
        console.log(out);

    });
});