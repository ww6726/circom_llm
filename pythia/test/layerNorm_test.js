const chai = require("chai");
const path = require("path");
const { log } = require("console");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const {floatToQ} = require('../build_circuit/basic_components/util');
const {layerNorm2D,I_layerNorm2D} = require('../build_witness/basic_components/layerNorm');
const {layerNorm} = require('../build_circuit/basic_components/layerNorm');

describe("layerNorm test", function () {
    this.timeout(100000000);
    let fracBits = 16;

    it("testing", async () => {
        let x = [[1,2,3,4],[1,2,3,4]];
        let n = x.length;
        let x_I = [];
        for(let i=0;i<n;i++){
            x_I[i] = [];
            for(let j=0;j<x[0].length;j++){
                x_I[i][j] = floatToQ(4,fracBits,x[i][j]);

            }

        }

        log("==================== Real LayerNorm ==========================");
        log("Check python output");
        

        log("==================== LayerNorm Js ==========================");
        log("Input: ", x);
        let LM = layerNorm2D(x);
        log(LM);

        log("==================== I_LayerNorm ==========================");
        log("Input: ", x_I);
        let LM_I = I_layerNorm2D(x_I,fracBits);
        for(let i=0;i<LM_I.length;i++){
            for(let j=0;j<LM_I[0].length;j++){
                LM_I[i][j] = LM_I[i][j] /(Math.pow(2,fracBits));
            }
        }
        log(LM_I);

        log("==================== Circom ==========================");
        let out = await layerNorm(x_I,fracBits);
        for(let i=0;i<out.length;i++){
            for(let j=0;j<out[0].length;j++){
                out[i][j] = parseFloat(Fr.toString(out[i][j])) / (2**(fracBits));
            }
        }


        log(out);

    });
});