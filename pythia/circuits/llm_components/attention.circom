pragma circom 2.0.0;

include "../ml_components/Linear.circom";
include "../ml_components/Split.circom";
include "../matrix/Transpose.circom";
include "../matrix/matmul.circom";



template attention(n,m,p,fracbits){
    signal input in_first_layer[n][m];
    signal input weights_first_layer[m][p];
    signal input bias_first_layer[n][p];
    signal output out[n][n];
    component linear_qkv = Linear(n,m,p,fracbits);

    linear_qkv.in <== in_first_layer;
    linear_qkv.weights <== weights_first_layer;
    linear_qkv.bias <== bias_first_layer;
    signal query_key_value[n][p] <== linear_qkv.out;

    //split into heads
    var numHeads = 8;
    component splitHeads = Split(n,p,numHeads);
    splitHeads.in <== query_key_value;
    
    var headSize = p/numHeads;
    signal headsAll[numHeads][n][headSize] <== splitHeads.out;

    //split into q ,k ,v
    // for(var i=0;i<1;i++){

        signal head[n][headSize] <== headsAll[0];
        component splitQKV = Split(n,headSize,3);
        splitQKV.in <== head;
        var sizeQKV = headSize/3;
        //split into key, query, and value
        signal q_k_v[3][n][sizeQKV] <== splitQKV.out;
        signal query[n][sizeQKV] <== q_k_v[0];
        signal key[n][sizeQKV] <== q_k_v[1];
        signal value[n][sizeQKV] <== q_k_v[2];

        //compute key transpose
        component trans = Transpose(n,sizeQKV);
        trans.in <== key;
        signal keyT[sizeQKV][n] <== trans.out;

        //compute Q*KT
        component mm_QKT = matmul(n,sizeQKV,n,fracbits);
        mm_QKT.a <== query;
        mm_QKT.b <== keyT;
        signal QKT[n][n]  <== mm_QKT.c;

    // }
    log("output is done");
    out <== QKT;

}

// component main {public [in]} = attention(_arg);