pragma circom 2.0.0;

include "../ml_components/Linear.circom";
include "../ml_components/Split.circom";
include "../matrix/Transpose.circom";
include "../matrix/matmul.circom";

template addRoPE(n, dim){
    signal input q[n][dim];
    signal input k[n][dim];
    signal input cos[n][dim];
    signal input sin[n][dim];

    signal gather_indices[n][dim];
    for(var i =0;i<n;i++){
        for(var j =0;j<dim;j++){
            gather_indices[i][j] <== i;
            log(gather_indices[i][j] );

        }
    }

}

template attention(n,m,p,dim,fracbits){
    signal input in_first_layer[n][m];
    signal input weights_first_layer[m][p];
    signal input bias_first_layer[n][p];

    //witness
    signal input rope_cos[n][dim];
    signal input rope_sin[n][dim];
    signal input mask[n][n];

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

        //add RoPE positional embedding
        signal query_rot[n][dim];
        signal query_pass[n][sizeQKV - dim];
        signal key_rot[n][dim];
        signal key_pass[n][sizeQKV - dim];
        for(var i =0;i<n;i++){
            for(var j =0;j<dim;j++){
                query_rot[i][j] <== query[i][j];
                key_rot[i][j] <== key[i][j];
            }
        }
        for(var i =0;i<n;i++){
            var idx = 0;
            for(var j =dim;j<sizeQKV;j++){
                query_pass[i][idx] <== query[i][j];
                key_pass[i][idx] <== key[i][j];
                idx++;
            }
        }
        component RoPE = addRoPE(n,dim);
        RoPE.q <== query_rot;
        RoPE.k <== key_rot;
        RoPE.cos <== rope_cos;
        RoPE.sin <== rope_sin;


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