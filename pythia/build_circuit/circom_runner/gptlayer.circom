pragma circom 2.0.0;
include "../../circuits/llm_components/GPTLayer.circom";

component main = gptLayer(32,32,96,2,128,8);