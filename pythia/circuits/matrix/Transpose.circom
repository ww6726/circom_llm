pragma circom 2.0.0;


template Transpose(m,n){
    signal input in[m][n];
    signal output out[n][m];

    for(var i =0;i<m;i++){
        for(var j = 0;j<n;j++){
            out[j][i] <== in[i][j];
        }
    }
}