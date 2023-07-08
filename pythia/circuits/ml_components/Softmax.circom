pragma circom 2.0.0;
include "../circomlib/sign.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";
include "../circomlib/switcher.circom";
include "../util/max.circom";

template find_z_p(fracBits){
    signal input x_;
    signal input qln2;
    signal input qln2_inv;

    var scale = fracBits<<2;

    signal z <== -x_ * qln2_inv;
    signal p <== x_ + z*qln2;





    //put together output
    signal output out[2];
    out[0] <== 1;//z
    out[1] <== 2;//p

}
template Softmax(n, fracBits){
    signal input in[n];
    signal input qln2;
    signal input qln2_inv;

    component findMax = max(n, 32);
    findMax.in <== in;
    signal max_val <== findMax.out;

    signal q[n];
    for(var i =0;i<n;i++){
        q[i] <== in[i] - max_val;
    } 

    component zp = find_z_p(fracBits);
    zp.x_ <== q[0];
    zp.qln2 <== qln2;
    zp.qln2_inv <== qln2_inv;







    signal output out[n];
    for(var i =0;i<n;i++){
        out[i] <== 2;
    } 
}