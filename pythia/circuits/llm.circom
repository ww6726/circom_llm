pragma circom 2.0.3;

include "ml_components/Linear.circom";
include "ml_components/Split.circom";



template attention(n,m,p,fracbits){
    signal input in;
    signal input weight;
    signal input


    component linear_qkv = linear(n,m,p);

}

component main = attention(_arg);