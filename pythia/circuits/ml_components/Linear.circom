pragma circom 2.0.0;

include "../matrix/matmul.circom";

template Linear(n,nInputs,nOutputs,scaleBits){
    signal input in[n][nInputs];
    signal input weights[nInputs][nOutputs];
    signal input bias[n][nOutputs];
    signal output out[n][nOutputs];

    component mm = matmul(n,nInputs,nOutputs);

    mm.a <== in;
    mm.b <== weights;
    for(var j=0;j<n;j++){
        for(var i=0;i<nOutputs;i++){
            out[j][i] <== mm.c[j][i] + bias[j][i]*2**scaleBits;
        }
    }

}
