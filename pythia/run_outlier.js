const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {floatToQ,floatToQ_matrix,floatToQ_multiD} = require('./build_circuit/basic_components/util');
const {add,sub,mul,div,sqrt} = require('./build_circuit/basic_components/arithmetics');
const {linear} = require('./build_circuit/basic_components/linear');
const {gptLayer} = require('./build_circuit/llm_components/gptLayer');
const {attn} = require('./build_circuit/llm_components/attention');
const {mlp} = require('./build_circuit/llm_components/mlp');
const {outlierDetect} = require('./build_circuit/pythia');

const { log } = require("console");

const fs = require('fs');
const { exit } = require("process");
const { matrixMultiplication } = require("./build_witness/basic_components/util");

function getShape(data) {
    if (Array.isArray(data)) {
      var shape = [];
      var currentLevel = data;
      while (Array.isArray(currentLevel)) {
        shape.push(currentLevel.length);
        currentLevel = currentLevel[0];
      }
  
      return shape;
    } else {
      return [];
    }
  }
  function fieldToReal(input,fracBits){
    const out = []
    for (let i = 0; i < input.length; i++) {
        out[i] = [];
        for (let j = 0; j < input[0].length; j++) {
            out[i][j] = parseFloat(Fr.toString(input[i][j])) / (2**(fracBits));
        }
    }
    return out;
  }
  function readWitness(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.trim().split('\n');
    const matrix = lines.map(line => line.split(' ').map(Number));
    return matrix;
  }
  async function read3DWitness(filePath) {
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (err) {
      throw err;
    }
  }

  function krum_avg(weights, numNeighbor, numMalicious){
    log(getShape(weights));

    Sk = [];
    m = numNeighbor;
    f = numMalicious;
    for(var i =0;i<weights.length;i++){
        Sk.push(compute_krum_score(weights,i,m,f));
    }
    //find avg model
    weights_avg = [];
    numWeights = weights.length;
    n = weights[0].length;
    m = weights[0][0].length;
    for(var i =0;i<n;i++){
      weights_avg[i] = [];
      for(var j = 0; j<m;j++){
        let vec_all = 0;
        for(var k = 0;k<numWeights;k++){
          vec_all += weights[k][i][j];
        }

        weights_avg[i][j] = Math.trunc(vec_all / numWeights);
      }
     }
     return weights_avg;
  }

  function compute_krum_score(weights,i,m,f){
    
    d = [];
    L = weights.length;
    for(var j =0;j<L;j++){
      if(j!=i){
        d.push(l2(weights[i],weights[j]))
      }
        weight_i = weights[i];
    }
    d = d.sort();
    //compute score
    score_i = sumVector(d,L-f-3);

    return score_i;
  }
  function sumVector(vector,n) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += vector[i];
    }
    return sum;
    }
  function l2(matrixA, matrixB) {
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error("Matrices must have the same dimensions.");
    }

    let squaredDiffsSum = 0;
    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixA[0].length; j++) {
            squaredDiffsSum += Math.pow(matrixA[i][j] - matrixB[i][j], 2);
        }
    }
    const distance = Math.sqrt(squaredDiffsSum);
    return distance;
}
function gaussian(scores){
  n = scores.length;
  mu = sumVector(scores) / n;

  let sigma_denom = n -1;
  let sigma_numerator = 0;
  for(var i =0;i<n;i++){
    sigma_numerator += (scores[i] - mu)**2
  }
  var sigma = Math.sqrt(sigma_numerator / sigma_denom);
  return [mu,sigma];

}
describe("main function for building circuit", function () {
    this.timeout(100000000);
    it("test", async () => {
         //make each input, witness 3D.
         let fracBits = 8;
         let numWeights = 7;
         let numNeighbor = 1;
         let numMalicious = 2;

         let n = 32;
         let m = 32;
 
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
        

 
        weight_avg = krum_avg(weights,numNeighbor,numMalicious);
        scores = [];
        for(var i =0;i<numWeights;i++){
          scores[i] = l2(weights[i],weight_avg);
        }
        let gauss = gaussian(scores);
        mu = gauss[0];
        sigma = gauss[1];
        
        let mu_plus_sigma = mu + sigma;

        for(var i =0;i<numWeights;i++){
          log(scores[i], mu_plus_sigma);
        }

 

        //circom
        

    });
});