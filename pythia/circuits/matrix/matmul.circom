pragma circom 2.0.3;
include "matEleMul.circom";
include "matEleSum.circom";
include "../util/fixedPoint.circom";
template matmul(m,n,p,fracbits){
    signal input a[m][n];
    signal input b[n][p];
    signal output c[m][p];
    signal temp[m][p];

    component matEleMulComponent[m][p];
    component matEleSumComponent[m][p];
    var idx = 0;
    for(var i=0;i<m;i++){
        for(var j=0;j<p;j++){
            matEleMulComponent[i][j] = matEleMul(1,n);
            matEleSumComponent[i][j] = matEleSum(1,n);

            for(var k =0;k < n;k++){
                matEleMulComponent[i][j].a[0][k] <== a[i][k];
                matEleMulComponent[i][j].b[0][k] <== b[k][j];                
            }
            for(var k = 0;k< n;k++){
                matEleSumComponent[i][j].a[0][k] <== matEleMulComponent[i][j].out[0][k];
            }
            temp[i][j] <== matEleSumComponent[i][j].out;
        }    
    }   

    //truncation
    var bitsTotal = 32;
    component trun[m][p];
    for(var i=0;i<m;i++){
        for(var j=0;j<p;j++){
            trun[i][j] = truncate(bitsTotal,bitsTotal-fracbits);
            trun[i][j].in <== temp[i][j];
            c[i][j] <== trun[i][j].out;

        }
    }
}
