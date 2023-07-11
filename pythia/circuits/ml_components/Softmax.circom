pragma circom 2.0.0;
include "../circomlib/sign.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";
include "../circomlib/switcher.circom";
include "../util/max.circom";
include "../util/fixedPoint.circom";
template L_int(fracBits){
    signal input p;
    signal input a;
    signal input b;
    signal input c;

    signal med1 <== (p+b)*(p+b);
    signal med2 <== a*med1;
    signal output out <== med2 + c;

}

template find_z_p(fracBits){
    signal input x_;
    signal input qln2;
    signal input qln2_inv;

    signal input a;
    signal input b;
    signal input c;
    signal input p_out;
    signal input p_out_remainder;


    var scale = fracBits<<2;
    signal z <-- -x_ \ qln2;//quotient
    signal z_r <-- -x_ % qln2;
    -x_ === qln2*z + z_r;

    signal p <== x_ + z*qln2;
   
    component Lint = L_int(fracBits);
    Lint.p <== p;
    Lint.a <== a;
    Lint.b <== b;
    Lint.c <== c;
    signal p_l <== Lint.out;  
    signal z_2pow <-- 2**z;
    signal p_out2 <-- p_l \ z_2pow;
    signal p_out2_r <-- p_l % z_2pow;
    p_l === p_out2*z_2pow +p_out2_r; 
    p_l === p_out2 * (z_2pow);

    log(p_out2);


    //put together output
    signal output out[2];
    out[0] <== 1;//z
    out[1] <== 2;//p

}
template Softmax(n, fracBits){
    signal input in[n];
    //additional witness
    signal input qln2;
    signal input qln2_inv;
    signal input a;
    signal input b;
    signal input c;
    signal input p_exp[n];
    signal input p_exp_remainder[n];

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
    zp.a <== a;
    zp.b <== b;
    zp.c <== c;
    zp.p_out <== p_exp[0];
    zp.p_out_remainder <== p_exp_remainder[0];








    signal output out[n];
    for(var i =0;i<n;i++){
        out[i] <== 2;
    } 
}