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
const {outlierDetection} = require('../build_circuit/outlierDetection');

const {max} = require('../build_circuit/basic_components/max');
const { log } = require("console");

describe("truncate test", function () {
    this.timeout(100000000);
    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        let fracBits = 8;
         let numWeights = 10;
         let numNeighbor = 1;
         let numMalicious = 2;

         let n = 500;
         let m = 500;
 
         let dim = 2;
         //weights, biases 
         let weights = [];
         for(var i =0;i<numWeights;i++){
          weights[i] =[];
          for(var j =0;j<n;j++){
            weights[i][j] = [];
            for(var k = 0;k<m;k++){
              if(i==3){
                weights[i][j][k] = Math.floor(Math.random() * 20) + 1;

              }else{
                weights[i][j][k] = Math.floor(Math.random() * 10) + 1;
              }
            }
          }
         }
        



        log("============= circom ===============");
        
        let out = await outlierDetection(weights,numWeights,n,m,numMalicious,numNeighbor,fracBits);
        out = parseFloat(Fr.toString(out));
        //circom


    });
});