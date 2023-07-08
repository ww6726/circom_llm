pragma circom 2.0.0;
include "../circomlib/sign.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";
include "../circomlib/switcher.circom";

template max(num,n){
    signal input in[num];
    signal temp [num];
    temp[0] <== in[0];
    component gt[num-1];
    var com_idx = 0;
    var temp_idx = 0;
    for(var i =1;i < num;i++){
        gt[com_idx] = GreaterEqThan(n);
        var op_l = temp[temp_idx];
        var op_r = in[i];
        gt[com_idx].in[0] <== op_l;
        gt[com_idx].in[1] <== op_r;

        temp_idx++;

        // temp[temp_idx] <== (op_l* gt[com_idx].out) + op_r *(1 - gt[com_idx].out);
        temp[temp_idx] <== (op_l-op_r)*gt[com_idx].out + op_r;
        com_idx++;
    }
    signal output out <== temp[num-1];
}