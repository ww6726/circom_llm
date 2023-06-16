pragma circom 2.0.3;
include "../circomlib/sign.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";
include "../circomlib/switcher.circom";

/**
 * Calculates the fixpoint sum of two fix point number represented by 8 bits each.
 *
 * @param n The number of bits to represent each operand.
 * @return The product.
 */
template fixPointAdd(){//n is the number of bits to represent this floating point
    signal input a;
    signal input b;
    signal temp;
    signal output out;

    temp <== a+b;
    out <== temp;
    log(out);

}

/**
 * Calculates the fixpoint product of two fix point number represented by 8 bits each.
 *
 * @param n The number of bits to represent each operand.
 * @return The product.
 */
template fixPointMultOld(n){
    signal input a;
    signal input b;
    signal temp;
    signal output out;
    temp <== a*b;
    
    component n2b = Num2Bits(n*2);//result has twice the bit. we need twice the bits to represent
    component b2n = Bits2Num(n);// we cut out the left and right and only kept the middle.

    n2b.in <== temp;
    var aTimesB_after_truncate[n];
    var idx = 0;
    for(var i = n/2;i<n+n/2;i++){
        aTimesB_after_truncate[idx] = n2b.out[i];
        idx++;
    }
    for(var i =0;i<n;i++){
        b2n.in[i] <== aTimesB_after_truncate[i];
    }
    out <== b2n.out;
     
}
//qn.m fixpoint
template fixPointMult(n,m){
    signal input a;
    signal input b;
    signal temp;
    signal output out;
    temp <== a*b;
    
    component n2b = Num2Bits((n+m)*2);//result has twice the bit. we need twice the bits to represent
    component b2n = Bits2Num(n+m);// 
 
    n2b.in <== temp;
    for(var i=0;i<(n+m)*2;i++){
        //log(n2b.out[i]);
    }
    var intBitNum = 2*n;
    var floatBitNum = n+m - intBitNum;



    var aTimesB_after_truncate[n+m];
    var idx = n+m-1;
    for(var i = (n+m)*2-1; i>=n+m;i--){
        aTimesB_after_truncate[idx] = n2b.out[i];
        idx--;
    }

    for(var i =0;i<n+m;i++){
        b2n.in[i] <== aTimesB_after_truncate[i];
    }
    out <== b2n.out;
}
template fixPointDiv(n,m){
    signal input a;
    signal input b;
    var temp;
    signal output out;
    temp = a/b;
    log("============");
    log(temp);
   
    out <== temp;
}