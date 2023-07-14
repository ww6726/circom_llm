pragma circom 2.0.3;
include "circuits/matrix/innerProd.circom";
include "circuits/matrix/matmul.circom";
include "circuits/ml_components/ReLU.circom";
include "circuits/ml_components/Linear.circom";
include "circuits/util/fixedPoint.circom";
include "circuits/util/max.circom";
include "circuits/util/min.circom";

include "circuits/circomlib/comparators.circom";
/*
    This code is a playground to test circuit correctness for numerous operations.
    Every computation needs to work here first prior being put into larger circuits.

*/

// template mm() {
//     var m = 128;
//     var n = 128;
//     var p = 128;
//     signal input a[m][n];
//     signal input b[n][p];
//     signal output c[m][p];
//     component mm = matmul(m,n,p);
//     mm.a <== a;
//     mm.b <== b;
//     c <== mm.c;
// }

// template relu(){
//     signal input a;
//     signal output out;
//     component relu = ReLU();
//     relu.in <== a;
//     out <== relu.out;
// }
// template Linear_test(){

//     signal input in[1][2];
//     signal input weights[2][3];
//     signal input bias[1][3];
//     signal output out[1][3];

//     component linear = Linear(2,3);
//     linear.in <== in;
//     linear.weights <== weights;
//     linear.bias <== bias;

//     out <== linear.out;
   
// }

// template bitDecompose_test(){
//     var n = 16;
//     signal input a;
//     signal input b;
//     signal output out[n];
//     signal dummy;
//     component decomp = Num2Bits(n);
//     decomp.in <== a;
//     for(var i =0;i<n;i++){
//         out[i] <== decomp.out[i];
//     }   
// }

// template mulThenAddtest(){

//     var numBits = 16;

//     var n = 8;
//     var m = 8;
//     signal input a;
//     signal input b;

//     signal output out;
//     component fpm = fixPointMult(n,m);
//     fpm.a <== a;
//     fpm.b <== b;
//     out <== fpm.out;
// }
// function matmul_func(a,b){
//     var m = 2;
//     var n = 2;
//     var p = 3;
//     var c[m][p];
//     for(var i =0;i<m;i++){
//         for(var j=0;j<p;j++){
//             c[i][j] = 0;
//         }
//     }
  
//     return c;
// }

template div_test2(){
    signal input x;
    signal input y;
    signal input z;
    signal input b;
    signal input q;
    signal input r;
    signal temp;
    temp <== x*y;
    signal a <== temp + z; 
    signal output out;
    component div = fixPointDiv();
    div.a <== a;
    div.b <== b;
    div.q <== q;
    div.r <== r;
    out <== a;
}

template div_test(){
    signal input a;
    signal input b;
    
    signal output out;
    out <-- a\b;
    signal r <-- a % b;
    a === b*out + r;

}
function log_ceil(n) {
   var n_temp = n;
   for (var i = -1; i < 254; i++) {
       if (n_temp == 0) {
          return i;
       }
       n_temp = n_temp \ 2;
   }
   return 254;
}
   

template shift_test(){ //right shift a by b bits === a/(2^b)
    signal input a;
    signal input b;
    
    var n = 32;
    component rs = rightShift(n);
    rs.in <== a;
    rs.bitsToShift <== b;
    signal output out <== rs.out;
}

template sqrt_test(){
    signal input a;
    signal in <== 29999;

    component sqrt = squareRoot();
    sqrt.in <== in;
    
    signal output out <== sqrt.out;
    log(out);



    // signal root <== 2;
    // signal root_plus_one <== root+1;

    // component lt1 = LessEqThan(64);
    // component lt2 = LessEqThan(64);

    // lt1.in[0] <== root * root;
    // lt1.in[1] <== in;

    // lt2.in[0] <== root_plus_one * root_plus_one;
    // lt2.in[1] <== in;

    // 1 === lt1.out + lt2.out;

}
 component main = sqrt_test();       