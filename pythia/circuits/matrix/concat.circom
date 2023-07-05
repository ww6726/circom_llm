pragma circom 2.0.0;


//concat two matrix with same number of row
template Concat(m,n,p){
    signal input a[m][n];
    signal input b[m][p];

    signal output out[m][n+p];

    for(var i =0;i<m;i++){
        for(var j = 0;j<n;j++){
            out[i][j] <== a[i][j];
        }
    }
    for(var i =0;i<m;i++){
        var idx = 0;
        for(var j = n;j<n+p;j++){
            out[i][j] <== b[i][idx];
            idx++;
        }
    }
}