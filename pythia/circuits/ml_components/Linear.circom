pragma circom 2.0.0;

include "../matrix/matmul.circom";

template Linear(nInputs,nOutputs){
    signal input in[1][nInputs];
    signal input weights[nInputs][nOutputs];
    signal input bias[1][nOutputs];
    signal output out[1][nOutputs];

    component mm = matmul(1,nInputs,nOutputs);

    mm.a <== in;
    mm.b <== weights;
    for(var i=0;i<nOutputs;i++){
        out[0][i] <== mm.c[0][i] + bias[0][i]*2**4;
    }

}