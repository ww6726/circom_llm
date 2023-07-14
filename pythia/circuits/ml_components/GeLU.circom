include "../util/fixedPoint.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";


template L_i(fracBits){
    signal input x;
    //witness; these values are the fixpoint number of the approx polynomial.
    // signal a <== -18927;
    // signal b_neg <== 452;
    // signal b <== -453;
    // signal c <== 4294967296;
    signal input a;
    signal input b_neg;
    signal input b;
    signal input c;



    component abs = absoluteValue();
    abs.in <== x;
    signal x_abs <== abs.out[0];
    signal sign <== abs.out[1]; //pos - 1; neg - 0

    signal sign_actual <== 2*sign -1;
    component geq = GreaterEqThan(64);
    geq.in[0] <== x_abs;
    geq.in[1] <== b_neg;
    // signal x_ <== geq.out * b_neg + (1 - geq.out) * x_abs;
    signal x_ <== x_abs + geq.out*(b_neg - x_abs);

    signal med1 <== (x_ + b)*(x_ + b);
    signal med2 <== a*med1;
    signal med3 <== med2 + c;
    signal output out <== sign_actual * med3; 
    // signal output out <== sign_actual * (a * ((x_ + b)*(x_ + b)) + c);


}

template Gelu(n,fracBits){
    signal input in;
    //witness
    signal input q_root2_inv;
    signal input gelu_a;
    signal input gelu_b_neg;
    signal input gelu_b;
    signal input gelu_c;

    signal L_in_temp <== in * q_root2_inv;
    component trunc = truncate(96,96 - fracBits);
    trunc.in <== L_in_temp;
    signal L_in <== trunc.out;

    component li = L_i(fracBits);
    li.x <== L_in;
    li.a <== gelu_a;
    li.b_neg <== gelu_b_neg;
    li.b <== gelu_b;
    li.c <== gelu_c;

    signal L_out_4_time_fracBits <== li.out;
    component trunc2 = truncate(96,96 - 3*fracBits);
    trunc2.in <== L_out_4_time_fracBits;

    component po2 = powOfTwo(64);
    po2.in <== fracBits;
    signal one_scale <== po2.out;
    signal half <-- one_scale \ 2;
    signal r <-- half % 2;
    one_scale === 2*half + r;
    signal x_half <== in * half; //twice


    signal out_temp <== x_half * (one_scale + trunc2.out);// 3 times bits

    component trunc3 = truncate(96,96 - 2*fracBits);
    trunc3.in <== out_temp;

    //    return x*0.5*(1 + L_out);
    signal output out <== trunc3.out;

}