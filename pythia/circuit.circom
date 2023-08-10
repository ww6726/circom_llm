pragma circom 2.0.3;
include "circuits/matrix/innerProd.circom";
include "circuits/matrix/matmul.circom";
include "circuits/matrix/matmulNoTrunc.circom";

include "circuits/ml_components/ReLU.circom";
include "circuits/ml_components/Linear.circom";
include "circuits/util/fixedPoint.circom";
include "circuits/util/max.circom";
include "circuits/util/min.circom";

include "circuits/circomlib/comparators.circom";
include "circuits/matrix/concat.circom";
include "circuits/pythia.circom";
include "circuits/ml_components/Softmax.circom";
include "circuits/ml_components/GeLU.circom";
include "circuits/ml_components/LayerNorm.circom";

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
template abs_div_test(){
    signal input a;

    signal x <== 123123123;
    log(x \ 8);
    var bits_total = 32;
    
    component trun = truncate(bits_total, bits_total - 3);
    trun.in <== x;
    log(trun.out);
    log("=====================");
    signal output out <== 2;
}

template multi_concat_test(){
    signal input a;

    var numHead = 4;
    var n = 2;
    signal all[numHead][n][n];
    for(var i =0;i<numHead;i++){
        for(var j =0;j<2;j++){
            for(var k =0;k<2;k++){
                all[i][j][k] <== 2;
            }
        }
    }

    //merging deprecvated
    // var numMerge = numHead - 1;// EX: merge 4 elements takes 3 merge component
    // component merge[numMerge];
    // merge[0] = Concat(n,n,n);
    // merge[0].a <== all[0];
    // merge[0].b <== all[1];
    // var copy = 2;
    // for(var i = 1;i<numMerge;i++){
    //     merge[i] = Concat(n,n*copy,n);
    //     merge[i].a <== merge[i-1].out;
    //     merge[i].b <== all[i+1];
    //     copy = copy + 1;
    // }
    
    //merging
    signal mergedOut[n][numHead*n];
    var numMerge = numHead - 1;
    for(var i =0;i<n;i++){
        for(var j =0;j<numHead*n;j++){
            var blockIdx = j \ n;
            var idx = j%n;

            mergedOut[i][j] <== all[blockIdx][i][idx];
        }
    }

    signal output out <== 2;

}   
template small(){
    signal input a;
    signal input b;
    signal output out <== a*b;
}
template matmultest(n,m,p,fracBits){
    signal input a[n][m];
    signal input b[m][p];
    signal input c[n][p];
    component mm = matmul(n,m,p,fracBits);
    mm.a <== a;
    mm.b <== b;

    signal output out[n][p] <== mm.c;
    log(" ============== circuit eval completed =================");

}

template freidvalds_matmult(n,m,p,fracBits){
    signal input a[n][m];
    signal input b[m][p];
    signal input c[n][p];
    
    signal random[p][1];
    for (var i = 0; i < p; i++){
        random[i][0] <== i;
    }
    component mm1 = matmul(m,p,1,fracBits);
    mm1.a <== b;
    mm1.b <== random;
    component mm3 = matmul(n,m,1,fracBits);
    mm3.a <== a;
    mm3.b <== mm1.c;

    component mm2 = matmul(n,p,1,fracBits);
    mm2.a <== c;
    mm2.b <== random;
    for(var i = 0;i<n;i++){

        mm2.c[i][0] === mm3.c[i][0];

    }
    signal output out[n][p];
    for(var i=0;i<n;i++){
        for(var j=0;j<p;j++){
            out[i][j] <== c[i][j];
        }
    }
    // log("======= lhs ========");
    // for(var i=0;i<n;i++){
    //     log(mm3.c[i][0]);
    // }
    // log("======= rhs ========");
    // for(var i=0;i<n;i++){
    //     log(mm2.c[i][0]);
    // }
    log(" ============== circuit eval completed =================");
}

component main = freidvalds_matmult(2048,512,1536,8);
// component main = freidvalds_matmult(32,32,32,8);
// component main = Pythia(6,32,32,96,2,4,8,8);

// component main = Softmax(64,64,8);
// component main = Gelu2D(4,4,8);
// component main = LayerNorm(64,64,8);
// component main = matmul(1,1,1,8);
// component main = matmulNoTruncation(64,64,64,8);

//  component main = multi_concat_test();       