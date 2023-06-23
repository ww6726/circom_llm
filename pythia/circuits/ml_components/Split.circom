pragma circom 2.0.0;

/*
    input:[32][96]
    output:[8][32][12]
*/
template Split(n,m,outputNum){
    signal input in[n][m];
    var mNew= m/outputNum;
    signal output out[outputNum][n][mNew];

    for(var i =0;i<outputNum;i++){
        for(var j = 0;j<n;j++){
            for(var k =0;k<mNew;k++){
                out[i][j][k] <== in[j][i*mNew + k]; 
            }
        }
    }


}