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
template test(){

    signal input a;
    signal input b;
    signal input q;
    signal input r;
    signal output out;
    component div = fixPointDiv();
    div.a <== a;
    div.b <== b;
    div.q <== q;
    div.r <== r;
    out <== q;



}
 component main = test();       