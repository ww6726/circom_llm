pragma circom 2.0.0;

include "../util/isPositive.circom";
template ReLU(){
    signal input in;
    signal output out;

    component ispositive = isPositive();
    
    ispositive.in <== in;
    out <== in*ispositive.out;
}