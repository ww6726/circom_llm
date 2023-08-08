const chai = require("chai");
const path = require("path");
const { log } = require("console");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ} = require('../build_circuit/basic_components/util');
const {gelu_,gelu_i,gelu_i_2d} = require('../build_witness/llm_components/gelu');
const {gelu} = require('../build_circuit/basic_components/gelu');

describe("gelu test", function () {
    this.timeout(100000000);
    let fracBits = 8;

    it("check compare gelu results between python and circom", async () => {
        let  x = [
            [ 75515, 75771, 76027, 76283 ],
            [ 75771, 76027, 76283, 76539 ],
            [ 76027, 76283, 76539, 76795 ],
            [ 76283, 76539, 76795, 77051 ],
            [ 76539, 76795, 77051, 77307 ],
            [ 76795, 77051, 77307, 77563 ],
            [ 77051, 77307, 77563, 77819 ],
            [ 77307, 77563, 77819, 78075 ],
            [ 77563, 77819, 78075, 78331 ],
            [ 77819, 78075, 78331, 78587 ],
            [ 78075, 78331, 78587, 78843 ],
            [ 78331, 78587, 78843, 79099 ],
            [ 78587, 78843, 79099, 79355 ],
            [ 78843, 79099, 79355, 79611 ],
            [ 79099, 79355, 79611, 79867 ],
            [ 79355, 79611, 79867, 80123 ],
            [ 79611, 79867, 80123, 80379 ],
            [ 79867, 80123, 80379, 80635 ],
            [ 80123, 80379, 80635, 80891 ],
            [ 80379, 80635, 80891, 81147 ],
            [ 80635, 80891, 81147, 81403 ],
            [ 80891, 81147, 81403, 81659 ],
            [ 81147, 81403, 81659, 81915 ],
            [ 81403, 81659, 81915, 82171 ],
            [ 81659, 81915, 82171, 82427 ],
            [ 81915, 82171, 82427, 82683 ],
            [ 82171, 82427, 82683, 82939 ],
            [ 82427, 82683, 82939, 83195 ],
            [ 82683, 82939, 83195, 83451 ],
            [ 82939, 83195, 83451, 83707 ],
            [ 83195, 83451, 83707, 83963 ],
            [ 83451, 83707, 83963, 84219 ]
          ];
        let x_I = []
        let n = x.length;
        // for(let i = 0; i < n; i++){
        //     x_I[i] = floatToQ(4,fracBits,x[i]);
        // }
  
        // console.log("==================== gelu ==========================");
        // for (let i = 0; i < n; i++) {
        //     log(gelu_(x[i]));
        // }
        console.log("==================== i-gelu ==========================");
        log(gelu_i_2d(x,fracBits)) ;

        
        console.log("==================== circom gelu ==========================");
        let out = await gelu(x,fracBits);
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < x[0].length; j++) {
                out[i] = (parseFloat(Fr.toString(out[i])));
            }
        }
        log(out);
        // log( parseFloat(Fr.toString(out))/(Math.pow(2,fracBits)));

        // log("==================== Circom ==========================");
        // let out = await gelu(x,fracBits);

    });
});