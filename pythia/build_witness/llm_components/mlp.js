const chai = require("chai");
const { log } = require("console");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);
const F = exports.p;
const assert = chai.assert;
const {getShape,floatToQ,QToFloat,floatToQ_signed} = require('../basic_components/util');
const {matrixMultiplication,linear} = require('../basic_components/linear');
const {layerNorm} = require('../basic_components/layerNorm');
const {softmax} = require('../basic_components/softmax');

const fs = require('fs');
const { exit } = require("process");


function gelu(x) {
    const sqrt2 = Math.sqrt(2);
    const erf = (x) => {
      const t = 1 / (1 + 0.5 * Math.abs(x));
      const erfApproximation =
        1 -
        t *
          Math.exp(
            -x * x -
              1.26551223 +
              t *
                (1.00002368 +
                  t *
                    (0.37409196 +
                      t *
                        (0.09678418 +
                          t *
                            (-0.18628806 +
                              t *
                                (0.27886807 +
                                  t *
                                    (-1.13520398 +
                                      t *
                                        (1.48851587 +
                                          t *
                                            (-0.82215223 +
                                              t * 0.17087277))))))))
          );
      return x >= 0 ? erfApproximation : -erfApproximation;
    };
    
    const cdf = 0.5 * (1.0 + erf(x / sqrt2));
    return x * cdf;
}
function L(x){
  const a = -0.2888;
  const b = -1.769;

  var x_abs = Math.abs(x);
  const b_neg = b*-1; 
  if(x_abs >= b_neg){
    x_abs = b_neg;
  }
  const ret = Math.sign(x) * (a* ((x_abs + b)**2) + 1);
  return ret;

}
function gelu_poly(x){
    const L_in = x/(Math.sqrt(2));
    const L_out = L(L_in);
    return x*0.5*(1 + L_out);
}

  module.exports = {
    gelu,
    gelu_poly,
  };
  