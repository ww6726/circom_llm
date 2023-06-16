pragma circom 2.0.0;
include "../circomlib/sign.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";
include "../circomlib/switcher.circom";
template isPositive(){
    var num_bits = 8;
    signal input in;
    signal output out;
    component num2Bits = Num2Bits(num_bits);//same number of bits in sign()
    component sign = Sign();
    num2Bits.in <== in;
    for(var i =0;i<num_bits;i++){
        sign.in[i] <== num2Bits.out[i]; 
    }
    out <== 1 - sign.sign;
}