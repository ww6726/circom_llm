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
const {linear} = require('../basic_components/linear');
const {split} = require('../basic_components/split');
const {transpose} = require('../basic_components/transpose');
const { matmul } = require("../basic_components/matmul");

function splitToHeads(qkv, headNum) {
  const heads = [];
  const rows = qkv.length;
  const columns = qkv[0].length;
  const splitSize = Math.ceil(columns / headNum);

  for (let i = 0; i < headNum; i++) {
    const head = [];
    for (let j = 0; j < rows; j++) {
      head.push(qkv[j].slice(i * splitSize, (i + 1) * splitSize));
    }
    heads.push(head);
  }

  return heads;
}


function permute(data){
  //todo: implement permutation for input
}
function splitQKV(qkv_head) {
  const numRows = qkv_head.length;
  const numColumns = qkv_head[0].length;

  const sectionSize = Math.floor(numColumns / 3);

  const q_k_v = [
    qkv_head.map(row => row.slice(0, sectionSize)),
    qkv_head.map(row => row.slice(sectionSize, 2 * sectionSize)),
    qkv_head.map(row => row.slice(2 * sectionSize, numColumns))
  ];

  return q_k_v;
}
async function attn(input, weight, bias,n,inNum, outNum, fracBits) {
  const query_key_value = await linear(input, weight, bias,n,inNum, outNum,fracBits);
  const headsAll = await split(query_key_value,query_key_value.length,query_key_value[0].length,8);
  for(let i = 0;i < 1;i++){
    const head = headsAll[i];
    const q_k_v = await split(head,head.length,head[0].length,3);
    const query = q_k_v[0];
    const key   = q_k_v[1];
    const value = q_k_v[2];
    const keyT = await transpose(key);
    const queryKT = await matmul(query,keyT,fracBits);
    console.log(getShape(queryKT));
  }
  // const heads = splitToHeads(query_key_value,8);
  // const qkv_head = heads[0];
  // const q_k_v = splitQKV(qkv_head);
  // const q = q_k_v[0];
  // const k = q_k_v[1];
  // const v = q_k_v[2];


}
module.exports = {
  attn,
};