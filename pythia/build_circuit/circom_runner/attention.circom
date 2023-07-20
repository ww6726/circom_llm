pragma circom 2.0.0;
include "../../circuits/llm_components/attention.circom";

component main = attention(32,32,96,2,8);