pragma circom 2.0.3;
include "matEleMul.circom";
include "matEleSum.circom";
include "../util/fixedPoint.circom";
include "matmul.circom";
include "matmulNoTrunc.circom";

template Freivalds(n,m,p,fracBits){
    signal input a[n][m];
    signal input b[m][p];
    signal input c[n][p];
    
    signal random[p][1];// change this part to witness input later
    for (var i = 0; i < p; i++){
        random[i][0] <== 1;
    }
    component mm1 = matmulNoTruncation(m,p,1,fracBits);
    mm1.a <== b;
    mm1.b <== random;
    component mm3 = matmul(n,m,1,2*fracBits);
    mm3.a <== a;
    mm3.b <== mm1.c;

    component mm2 = matmul(n,p,1,fracBits);
    mm2.a <== c;
    mm2.b <== random;
    for(var i = 0;i<n;i++){
        // log(mm2.c[i][0] );
        // log(mm3.c[i][0] );
        // log("============================");
        mm2.c[i][0] === mm3.c[i][0];
    }
    signal output out[n][p];
    for(var i=0;i<n;i++){
        for(var j=0;j<p;j++){
            out[i][j] <== c[i][j];
        }
    }
}
template FreivaldsWithUntruncatedResult(n,m,p,fracBits){
    signal input a[n][m];
    signal input b[m][p];
    signal input c[n][p];
    
    signal random[p][1];// change this part to witness input later
    for (var i = 0; i < p; i++){
        random[i][0] <== 1;
    }
    component mm1 = matmulNoTruncation(m,p,1,fracBits);
    mm1.a <== b;
    mm1.b <== random;
    component mm3 = matmulNoTruncation(n,m,1,fracBits);
    mm3.a <== a;
    mm3.b <== mm1.c;

    component mm2 = matmulNoTruncation(n,p,1,fracBits);
    mm2.a <== c;
    mm2.b <== random;
    for(var i = 0;i<n;i++){
        // log(mm2.c[i][0] );
        // log(mm3.c[i][0] );
        // log("============================");
        mm2.c[i][0] === mm3.c[i][0];
    }
    component truncMM = truncateMatrix(n,p,fracBits);
    truncMM.in <== c;
    signal output out[n][p] <== truncMM.out;

}