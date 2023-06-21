pragma circom 2.0.3;

template matEleSum(m,n){
    signal input a[m][n];
    signal output out;
    signal sum[m*n];//signal defines constraints
    sum[0] <== a[0][0];
    var idx = 0;
    for(var i =0;i<m;i++){
        for(var j=0;j<n;j++){
            if(idx>0){
                sum[idx] <== a[i][j] + sum[idx-1];
            }
            idx++;
        }
    }
    out <== sum[m*n-1];


}