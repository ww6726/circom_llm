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
const {getShape,truncate} = require('./util');

const fs = require('fs');
const { exit } = require("process");
function initializeArray(n) {
    var arr = new Array(n);  // Create a new array with size n
    arr.fill(0);             // Fill the array with 0
    return arr;
}
function bitLen(n) {
    return (n >>> 0).toString(2).length;
}
function squareRoot(input, fracBits) {
    var size = 32;
    let x = initializeArray(size);    
    let pow = Math.ceil(bitLen(input)/2);
    x[0] = Math.pow(2,pow);
    let i = 0;
    let x_prev = 0;
    do{
        x[i+1]  = Math.floor((x[i] + (Math.floor(input / x[i])))/2);
        x_prev = x[i];
        i = i + 1;
        log(x[i],x_prev);
    }while(i<10);

    return x_prev;
}

function squareRoot_i(){

}
module.exports = {
    squareRoot,
    squareRoot_i,

};