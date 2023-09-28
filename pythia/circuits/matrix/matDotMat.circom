pragma circom 2.0.3;
include "../util/fixedPoint.circom";

template matDotMat(n,m,fracBits){
    signal input a[n][m];
    signal input b[n][m];
    signal output out;
    signal sum[n*m];
    sum[0] <== a[0][0]*b[0][0];
    var idx =0;
    for(var i=0;i<n;i++){
        for(var j=0;j<m;j++){
            if(idx>0){
                sum[idx]<==sum[idx-1] + a[i][j]*b[i][j];
            }
            idx++;
        }
    }
    out<== sum[n*m -1];
}