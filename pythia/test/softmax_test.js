const chai = require("chai");
const { log } = require("console");
const path = require("path");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ} = require('../build_circuit/basic_components/util');
const {softmaxArray,I_softmax2D} = require('../build_witness/basic_components/softmax');
const {softmax_i} = require('../build_witness/basic_components/softmax');
const {softmax} = require('../build_circuit/basic_components/softmax');

describe("vector softmax test", function () {
    this.timeout(100000000);

    it("check compare softmax results between actual and circom", async () => {
        var x_ = [
            73538452.75,  60105557.19391391,
     27541051.022579044,  6484063.331034027,
     20397786.444977496,  60962538.50160596,
       93350562.9423149,  87715839.50580847,
      48435213.21810214, 12561002.289283514,
     16630721.191182867,  61544018.48369352,
     109206074.01118118, 116349083.72078899,
      75542287.53711252,   24555429.6505488,
     13139338.235356972,  56380881.22009411,
     118349003.13676018, 143350613.04353827,
     107695370.79791251,  43861454.90290111,
     12651678.297660649,  47085618.90759831,
     119802516.94407108,  166003141.7187415,
     142873053.51388496,  70994319.00197506,
     17788726.841530576,  36039194.39775107,
      113544815.0656076,  181866620.5046348
   ];
        var x_I = [];
        const fracBits = 8;
        const num = x_.length;
       
        for(let i = 0;i<num;i++){
            x_I[i] = floatToQ(4,fracBits,x_[i]); 
        }
        console.log("==================== Actual ==========================");
        const out_ = softmaxArray(x_);
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