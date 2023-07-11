pragma circom 2.0.3;
include "circuits/matrix/innerProd.circom";
include "circuits/matrix/matmul.circom";
include "circuits/ml_components/ReLU.circom";
include "circuits/ml_components/Linear.circom";
include "circuits/util/fixedPoint.circom";


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
   
// function powOfTwo(n){
    
// }
template shift_test(){//right shift a by b bits === a/(2^b)
    signal input a;
    signal input b;
    

    signal b_2pow2 <-- 2<<b;
    var bitlen = 16;
    component n2b = Num2Bits(bitlen);
    n2b.in <== b_2pow2;
    signal q_out[bitlen];
    var idx = 0;
    for(var i = 4;i<bitlen;i++){
        q_out[idx] <-- n2b.out[i];
        log(q_out[idx]);     
        idx++;
    }
    component b2n = Bits2Num(bitlen);
    b2n.in <== q_out;
    signal q <== b2n.out;


    // signal output out <-- a \ b_2pow;
    // signal r <-- a % b_2pow;
    // a === out * b_2pow + r;

    signal output out <== 2;
    
}
 component main = shift_test();       