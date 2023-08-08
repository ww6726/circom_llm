pragma circom 2.0.3;
include "../util/fixedPoint.circom";

template matEleMulTruncation(m,n){
    signal input a[m][n];
    signal input b[m][n];
    signal output out[m][n];
    signal temp[m][n];


    for(var i=0;i<m;i++){
        for(var j=0;j<n;j++){
            temp[i][j] <== a[i][j] * b[i][j];

        }
    }

    //truncation
    var bitsTotal = 32;
    component trun[m][p];
    for(var i=0;i<m;i++){
        for(var j=0;j<p;j++){
            trun[i][j] = truncate(bitsTotal,bitsTotal-fracbits);
            trun[i][j].in <== temp[i][j];
            out[i][j] <== trun[i][j].out;
        }
    }
}