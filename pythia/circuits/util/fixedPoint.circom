pragma circom 2.0.3;
include "../circomlib/sign.circom";
include "../circomlib/bitify.circom";
include "../circomlib/comparators.circom";
include "../circomlib/switcher.circom";
include "../util/max.circom";
include "../util/min.circom";

include "isPositive.circom";
/**
    This code has circom implementation of some of the basic fixpoint operation 
    such as multiplication, truncation, abs, power of 2, shifting.
 */

// //deprecated
// template fixPointMultOld(n){
//     signal input a;
//     signal input b;
//     signal temp;
//     signal output out;
//     temp <== a*b;
    
//     component n2b = Num2Bits(n*2);//result has twice the bit. we need twice the bits to represent
//     component b2n = Bits2Num(n);// we cut out the left and right and only kept the middle.

//     n2b.in <== temp;
//     var aTimesB_after_truncate[n];
//     var idx = 0;
//     for(var i = n/2;i<n+n/2;i++){
//         aTimesB_after_truncate[idx] = n2b.out[i];
//         idx++;
//     }
//     for(var i =0;i<n;i++){
//         b2n.in[i] <== aTimesB_after_truncate[i];
//     }
//     out <== b2n.out;
     
// }

template absoluteValue(){
    signal input in;
    signal output out[2];
    
    component ispositive = isPositive();
    ispositive.in <== in;
    signal sign <== ispositive.out; // 0 - neg    1 - pos
    var abs_bit = 2*sign -1;
    out[0] <== abs_bit * in;
    out[1] <== sign;

}

template truncate(bits_total, bits_want){

    signal input in;
    signal output out;
    component abs = absoluteValue();
    abs.in <== in;
    signal in_abs <== abs.out[0];
    signal sign <== abs.out[1];
    component n2b = Num2Bits(bits_total);//result has twice the bit. we need twice the bits to represent
    n2b.in <== in_abs;

    var afterTruncate[bits_want];
    var idx = bits_want-1;
    for(var i = bits_total-1; i>=bits_total - bits_want;i--){
        afterTruncate[idx] = n2b.out[i];
        idx--;
    }
    component b2n = Bits2Num(bits_want);
    for(var i =0;i<bits_want;i++){
        b2n.in[i] <== afterTruncate[i];
    }
    
    // var abs_bit = 2*sign -1;
    // out <-- in_abs>>4*abs_bit;


    var abs_bit = 2*sign -1;
    out <== b2n.out*abs_bit;


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

template fixPointMultSigned_old(n,m){
    signal input a;
    signal input b;
    signal output c;
    signal temp;
    temp <== a*b;
    component tc = truncate(2*(n+m),2*(n+m) -m);// first is how many bits in total. second is take left most how many
    tc.in <== temp;
    c <== tc.out;
}
template fixPointMultSigned(){
    signal input a;
    signal input b;
    signal output c;
    var n = 4;
    var m = 4;

    signal temp;
    temp <== a*b;
    component tc = truncate(2*(n+m),2*(n+m) -m);// first is how many bits in total. second is take left most how many
    tc.in <== temp;
    c <== tc.out;
}
template binLeftRightFlip(n){
    signal input in[n];
    signal output out[n];

    var idx = n-1;
    for(var i =0;i<n;i++){
        out[i] <== in[idx];
        idx--;
    }

}
template longDivision(n){
    signal input dividend[n];
    signal input divisor[n];
    signal output quotient[n];
    component flip1 = binLeftRightFlip(n);
    component flip2 = binLeftRightFlip(n);

    signal dividend_flip[n];
    signal divisor_flip[n];

    flip1.in <== dividend;
    flip2.in <== divisor;
    dividend_flip <== flip1.out;
    divisor_flip <== flip2.out;
    var remainder[n];
    component isZ[n];
    for(var i = 0 ;i < n; i++){//initialize remainder
        remainder[i] = dividend[i];
    }


    for(var i =0;i<n;i++){
        isZ[i] = IsZero();
        isZ[i].in <== remainder[i];
    }
}
template fixPointDivSigned(n,m){
    signal input dividend;
    signal input divisor;
    signal output quotient;

    component abs_1 = absoluteValue();
    component abs_2 = absoluteValue();
    
    signal dividend_abs;
    signal divisor_abs;

    abs_1.in <== dividend;
    abs_2.in <== divisor;

    dividend_abs <== abs_1.out;
    divisor_abs <== abs_2.out;


    var bits = n+m;
    component n2b_1 = Num2Bits(bits);
    component n2b_2 = Num2Bits(bits);
    
    n2b_1.in <== dividend_abs;
    n2b_2.in <== divisor_abs;

    signal dividend_bin[bits];
    signal divisor_bin[bits];

    for(var i = 0;i<bits;i++){
        dividend_bin[i] <== n2b_1.out[i];
        divisor_bin[i] <== n2b_2.out[i];
    }

    component longDiv = longDivision(bits);
    longDiv.dividend <== dividend_bin;
    longDiv.divisor <== divisor_bin;
    //waiting for output

}
template Sum(n){
    signal input in[n];
    signal output out;
    var sum = 0;
    for(var i = 0;i<n;i++){
        sum += in[i];
    }
    out <== sum;
}
template fixPointAddSigned(){
    signal input a;
    signal input b;
    signal output c;
    c <== a+b;
}

template fixPointSubSigned(){
    signal input a;
    signal input b;
    signal output c;

    c <== a - b;

}
template fixPointDiv(){
    signal input a;
    signal input b;
    signal input q;
    signal input r;

    component lt = LessThan(8);
    lt.in[0] <== r;
    lt.in[1] <== b;
    signal compare_result <== lt.out;
    compare_result === 1;
    a === q*b + r;
}



template powOfTwo(n){
    signal input in;
    signal bitRange[n];
    component eq[n];
    for(var i =0;i<n;i++){
        eq[i] = IsEqual();
        eq[i].in[0] <== i;
        eq[i].in[1] <== in;
        bitRange[i] <== eq[i].out;
    }
    
    component b2n = Bits2Num(n);
    b2n.in <== bitRange;
    signal out_ <== b2n.out;
    component isZeroA = IsZero();
    component isZeroB = IsZero();
    isZeroA.in <== in;
    isZeroB.in <== out_;

    signal output out <== isZeroB.out * (1- isZeroA.out)*999999 + out_;// if bits is too big, just replace it with 999999
}

template rightShift(n){//n - the max number of bit in the range to support. It is not the number of bits we want to shift
    signal input in;
    signal input bitsToShift;
    
    //check if bitsToShift is too many
    component leq = LessEqThan(64);
    leq.in[0] <== bitsToShift;
    leq.in[1] <== n;

    component pot = powOfTwo(n);
    pot.in <== bitsToShift;
    signal twoPowBitsToShift <== pot.out;

    signal output out <-- in \ twoPowBitsToShift;
    signal r <-- in % twoPowBitsToShift;
    in === out*twoPowBitsToShift + r;

}

template findMSB(n){
    signal input in;
    component n2b = Num2Bits(n);
    n2b.in <== in;
    signal in_bin[n] <== n2b.out;
    signal indicesTimeVal[n];
    for(var i =0;i<n;i++){
        indicesTimeVal[i] <== in_bin[i]*i;
    }
    component findMax = max(n,32);
    findMax.in <==indicesTimeVal;
    signal output out <== findMax.out;
}
template ceil(){//if remainder == 0, then no need to add one. Otherwise, add one
    signal input in;
    signal input remainder;
    component eqZero = IsZero();
    eqZero.in <== remainder;
    
    signal output out <== 1 + in - eqZero.out;

}
template squareRoot(){
    signal input in;
    var size = 32;

    //find Bits(n)/2
    component msb = findMSB(64);
    msb.in <== in;
    signal numBits <== msb.out + 1;
    signal pow_temp <-- numBits \2;
    signal r <-- numBits % 2;
    numBits === pow_temp*2 + r;
    component findCeil = ceil();
    findCeil.in <== pow_temp;
    findCeil.remainder <== r;
    signal pow <== findCeil.out;

    //start computing x_0 and so on
    component pow2 = powOfTwo(32);
    pow2.in <== pow;
    signal x[size];
    x[0] <== pow2.out;
    var i = 0;
    signal temp1[size];
    signal r1[size];
    signal temp2[size];
    signal r2[size];

    while(i < 11){
        temp1[i] <-- in \ x[i];
        r1[i] <-- in % x[i];
        in === x[i]*temp1[i] + r1[i];
        temp2[i] <== x[i] + temp1[i];

        x[i+1] <-- temp2[i] \ 2;
        r2[i] <-- temp2[i] % 2;
        temp2[i] === 2*x[i+1] + r2[i];
        i++;
        
    }
    signal out2[2];
    out2[0] <== x[i];
    out2[1] <== x[i-1];
    component findMax = min(2,32);
    findMax.in <== out2;
    signal output out <== findMax.out;
}