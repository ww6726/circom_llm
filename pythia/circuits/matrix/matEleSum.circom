pragma circom 2.0.3;

//sum up all elements in a matrix
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

template matEleSumTwo(m,n){
    signal input a[m][n];
    signal input b[m][n];
    signal output out[m][n];
   
    for(var i =0;i<m;i++){
        for(var j=0;j<n;j++){
            out[i][j] <== a[i][j] + b[i][j];
        }
    }
}