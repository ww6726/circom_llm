pragma circom 2.0.0;
include "matEleMul.circom";
include "matEleSum.circom";
template matmul(m,n,p){
    signal input a[m][n];
    signal input b[n][p];
    signal output c[m][p];


    for(var i=0;i<m;i++){
        for(var j=0;j<n;j++){
            for(var k =0;k < p;k++){
                c[i][j] += a[i][k]*b[k][j];
            }
        }    
    }   
}