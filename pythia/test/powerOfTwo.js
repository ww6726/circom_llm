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
const {max} = require('../build_circuit/basic_components/max');
const { log } = require("console");


function Pow2(x, n) {
    let result = 1;
    let term = 1;
  
    for (let i = 1; i <= n; i++) {
      term *= (x * Math.log(2)) / i;
      result += term;
    }
  
    return result;
  }
function log2(x){
    let lo = x*(60 + 60*x+11*x**2)/(3*(20 + 30*x + 12*x**2 + x**3));
    let hi = x*(30 + 21*x+x**2)/(3*(10 + 12*x + 3*x**2));
    return [lo/Math.log(2),hi/Math.log(2)];

}
function logBase2Approx(num) {
    let x = num - 1;
    let result = 0;
    let sign = 1;
  
    for (let i = 1; i <= 10; i++) {
      result += sign * (x ** i) / i;
      sign *= -1;
    }
  
    return result / Math.log(2);
  }
describe("test Taylor series for 2^x", function () {
    this.timeout(100000000);
    it("test", async () => {
        // const circuit = await wasm_tester(path.join(__dirname, "circuits", "FixedPoint_test.circom"));
        let x = 4;

        log(Math.log(x))
        log(Math.log(x) / Math.log(2));
        log(log2(x));




    });
});