pragma circom 2.0.3;
include "../util/fixedPoint.circom";

template matEleMul(m,n){
    signal input a[m][n];
    signal input b[m][n];
    signal output out[m][n];

    component fixMul[m][n];
    for(var i=0;i<m;i++){
        for(var j=0;j<n;j++){

            // fixMul[i][j] = fixPointMultSigned();
            // fixMul[i][j].a <== a[i][j];
            // fixMul[i][j].b <== b[i][j];
            // out[i][j] <== fixMul[i][j].c;
            out[i][j] <== a[i][j] * b[i][j];

        }
    }
}