pragma circom 2.0.0;
include "../circomlib/sign.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";
include "../circomlib/switcher.circom";
include "../util/max.circom";
include "../util/fixedPoint.circom";
template L_int(fracBits){
    signal input p;
    signal a <== 91;//hardcoded 4-bits quantization
    signal b <== 21;
    signal c <== 22544;

    signal med1 <== (p+b)*(p+b);
    signal med2 <== a*med1;
    signal output out <== med2 + c;

}

template find_z_p(fracBits){
    signal input x_;
    signal input qln2;

    var scale = fracBits<<2;
    signal z <-- -x_ \ qln2;//quotient
    signal z_r <-- -x_ % qln2;
    -x_ === qln2*z + z_r;

    signal p <== x_ + z*qln2;
   
    component Lint = L_int(fracBits);
    Lint.p <== p;

    signal p_l <== Lint.out;  
    
    //compute p_l >> z
    var bitsRange = 32;
    component rs = rightShift(bitsRange);
    rs.in <== p_l;
    rs.bitsToShift <== z;
    signal p_out <== rs.out;



    //put together output
    signal output out <== p_out;
    // out[0] <== 1;//z
    // out[1] <== p_out;//p

}
/*

 The implementation is based on method in paper
 "I-BERT: Integer-only BERT Quantization"
 */
template Softmax(n, fracBits){
    component po2 = powOfTwo(32);
    po2.in <== fracBits;
    signal scale <== po2.out;// we can modify this part to ensure non-zero integer softmax value

    signal input in[n];
    //additional witness
    signal input qln2;


    component findMax = max(n, 32);
    findMax.in <== in;
    signal max_val <== findMax.out;

    signal q[n];
    for(var i =0;i<n;i++){
        q[i] <== in[i] - max_val;
    } 

    component zp[n];
    signal q_exp[n];
    for(var i = 0;i<n;i++){
        zp[i] = find_z_p(fracBits);
        zp[i].x_ <== q[i];
        zp[i].qln2 <== qln2;
        q_exp[i] <== zp[i].out;
    }
    component findSum = Sum(n);
    findSum.in <== q_exp;
    signal sum <== findSum.out;

    
    signal q_temp[n];
    signal r[n];//remainder
    signal output out[n];
    for(var i = 0;i<n;i++){
        q_temp[i] <== q_exp[i]*scale;
        out[i] <-- q_temp[i] \ sum;
        r[i] <-- q_temp[i] % sum;
        q_temp[i] === out[i] * sum + r[i];
    }


    // for(var i = 0;i<n;i++){
    //   log(out[i]);
    // }
}