pragma circom 2.0.0;

include "../ml_components/Linear.circom";
include "../ml_components/Split.circom";
include "../matrix/Transpose.circom";
include "../matrix/matmul.circom";
include "../matrix/matmulNoTrunc.circom";

include "../matrix/matEleMul.circom";
include "../matrix/concat.circom";
include "../util/fixedPoint.circom";
include "../ml_components/Softmax.circom";
include "../ml_components/LayerNorm.circom";

include "../matrix/freivalds.circom";

template rotaryHalf(m,n){//this is wrong. split it vertically
    signal input in[m][n];
    var halfIndex = n/2;

    signal in_l[m][n/2];
    signal in_r[m][n/2];

    for(var i =0;i<m;i++){
        for(var j =0;j<halfIndex;j++){
            in_l[i][j] <== in[i][j];
            in_r[i][j] <== in[i][j+halfIndex];
        }
    }
    signal in_r_neg[m][n/2];
    for(var i =0;i<m;i++){
        for(var j =0;j<halfIndex;j++){
            in_r_neg[i][j] <== -1*in_r[i][j];
        }
    }
    signal output out[m][n];
    component concat = Concat(m,n/2,n/2);
    concat.a <== in_r_neg;
    concat.b <== in_l;
    out <== concat.out;
}

template addRoPE(n, dim,fracbits){
    signal input q[n][dim];
    signal input k[n][dim];
    signal input cos[n][dim];
    signal input sin[n][dim];
  
    // signal gather_indices[n][dim];
    // for(var i =0;i<n;i++){
    //     for(var j =0;j<dim;j++){
    //         gather_indices[i][j] <== i;
    //     }
    // }
    // signal cos_gather[n][dim];
    // signal sin_gather[n][dim];
    // for(var i =0;i<n;i++){
    //     for(var j =0;j<dim;j++){
    //         var idx = gather_indices[i][j];
    //         cos_gather[i][j] <== cos[idx][j]; 
    //         sin_gather[i][j] <== sin[idx][j]; 
    //     }
    // }
    //Compute q_emb



    component matEleMulQ[2];
    matEleMulQ[0] = matEleMul(n,dim);
    matEleMulQ[1] = matEleMul(n,dim);
    matEleMulQ[0].a <== q;
    matEleMulQ[0].b <== cos;
    component rotaryHalfQ = rotaryHalf(n,dim);
    rotaryHalfQ.in <== q;
    signal q_rotate[n][dim] <== rotaryHalfQ.out;
    matEleMulQ[1].a <== q_rotate;
    matEleMulQ[1].b <== sin;
    component matEleSumTwoQ = matEleSumTwo(n,dim);
    matEleSumTwoQ.a <== matEleMulQ[0].out;
    matEleSumTwoQ.b <== matEleMulQ[1].out;
    signal q_embed[n][dim] <== matEleSumTwoQ.out;

    //Compute k_emb
    component matEleMulK[2];
    matEleMulK[0] = matEleMul(n,dim);
    matEleMulK[1] = matEleMul(n,dim);
    matEleMulK[0].a <== k;
    matEleMulK[0].b <== cos;
    component rotaryHalfK = rotaryHalf(n,dim);
    rotaryHalfK.in <== k;
    signal k_rotate[n][dim] <== rotaryHalfK.out;
    matEleMulK[1].a <== k_rotate;
    matEleMulK[1].b <== sin;
    component matEleSumTwoK = matEleSumTwo(n,dim);
    matEleSumTwoK.a <== matEleMulK[0].out;
    matEleSumTwoK.b <== matEleMulK[1].out;
    signal k_embed[n][dim] <== matEleSumTwoK.out;

    //truncation
    var bitsTotal = 90;
    component trunQ[n][dim];
    signal output q_embed_trunc[n][dim];
    for(var i=0;i<n;i++){
        for(var j=0;j<dim;j++){
            trunQ[i][j] = truncate(bitsTotal,bitsTotal-fracbits);
            trunQ[i][j].in <== q_embed[i][j];
            q_embed_trunc[i][j] <== trunQ[i][j].out;
        }
    }
  
    component trunK[n][dim];
    signal output k_embed_trunc[n][dim];
    for(var i=0;i<n;i++){
        for(var j=0;j<dim;j++){
            trunK[i][j] = truncate(bitsTotal,bitsTotal-fracbits);
            trunK[i][j].in <== k_embed[i][j];
            k_embed_trunc[i][j] <== trunK[i][j].out;
        }
    }

 
}
template attention_single_head(n,headSize,dim,fracBits){
    signal input head[n][headSize];
    //witness
    signal input rope_cos[n][dim];
    signal input rope_sin[n][dim];
    signal input mask[n][n];
    //for softmax
    signal input qln2;
    signal input a_sm;
    signal input b_sm;
    signal input c_sm;

    //freivalds
    signal input keyQueryMM[n][n];//deprecated
    signal input keyQueryMM_aux[n][n];//original for freivalds



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

    component RoPE = addRoPE(n,dim,fracBits);
    RoPE.q <== query_rot;
    RoPE.k <== key_rot;
    RoPE.cos <== rope_cos;
    RoPE.sin <== rope_sin;

    signal query_embed[n][dim] <== RoPE.q_embed_trunc;
    signal key_embed[n][dim] <== RoPE.k_embed_trunc;



    signal query_new[n][sizeQKV];
    signal key_new[n][sizeQKV];
    component concatQ = Concat(n,dim,sizeQKV-dim);
    concatQ.a <== query_embed;
    concatQ.b <== query_pass;
    query_new <== concatQ.out;
    component concatK = Concat(n,dim,sizeQKV-dim);
    concatK.a <== key_embed;
    concatK.b <== key_pass;
    key_new <== concatK.out;

    //compute key transpose
    component trans = Transpose(n,sizeQKV);
    trans.in <== key_new;
    signal keyT[sizeQKV][n] <== trans.out;

    // //OLD: compute Q*KT
    // component mm_QKT = matmul(n,sizeQKV,n,fracBits);
    // mm_QKT.a <== query_new;
    // mm_QKT.b <== keyT;
    // signal QKT[n][n] <== mm_QKT.c;


    //NEW freivalds
    component fv_qkt = FreivaldsWithUntruncatedResult(n,sizeQKV,n,fracBits);
    fv_qkt.a <== query_new;
    fv_qkt.b <== keyT;
    fv_qkt.c <== keyQueryMM_aux;
    signal QKT[n][n] <== fv_qkt.out;

    log("finish head");



    // elementwise divide by 8 which is same as  truncate right 3 bits
    signal QKT_div_8[n][n];
    signal QKT_div_8_r[n][n];
    var bits_total = 32;
    component trun[n][n]; 
    for(var i=0;i<n;i++){
        for(var j=0;j<n;j++){
            trun[i][j] = truncate(bits_total, bits_total - 3);
            trun[i][j].in <== QKT[i][j];
            QKT_div_8[i][j] <== trun[i][j].out; 

        }
    }  
        

    // add mask
    signal QKT_MASKED[n][n];
    for(var i=0;i<n;i++){
        for(var j=0;j<n;j++){
            QKT_MASKED[i][j] <== QKT_div_8[i][j] + mask[i][j]; 
        }
    }  

    
    //compute softmax
    component sm = Softmax(n,n,fracBits);
    sm.in <== QKT_MASKED;
    sm.qln2 <== qln2;
    sm.a_sm <== a_sm;
    sm.b_sm <== b_sm;
    sm.c_sm <== c_sm;


    signal softmax_out[n][n] <== sm.out;
  

    //multiply with V
    component mm = matmul(n,n,sizeQKV,fracBits);
    mm.a <== softmax_out;
    mm.b <== value;
    
    signal output out[n][sizeQKV] <== mm.c;

}
template attention(n,m,p,dim,fracbits,numHead){
    signal input in_first_layer[n][m];
    signal input weights_first_layer[m][p];
    signal input bias_first_layer[n][p];
    signal input weight_attn_final[m][m];
    signal input bias_attn_final[n][m];

    //witness
    signal input rope_cos[n][dim];
    signal input rope_sin[n][dim];
    signal input mask[n][n];

    //witness for softmax
    signal input qln2;
    signal input a_sm;
    signal input b_sm;
    signal input c_sm;

    //freivalds
    signal input initialLinearLayerMMOut[n][p];
    signal input keyQueryMM[numHead][n][n];
    signal input keyQueryMM_aux[numHead][n][n];

    // //old
    // component linear_qkv = Linear(n,m,p,fracbits);
    // linear_qkv.in <== in_first_layer;
    // linear_qkv.weights <== weights_first_layer;
    // linear_qkv.bias <== bias_first_layer;
    // signal query_key_value[n][p] <== linear_qkv.out;

    //new freivald optimization
    component fv_initialLinearLayer = Freivalds(n,m,p,fracbits);
    fv_initialLinearLayer.a <== in_first_layer;
    fv_initialLinearLayer.b <== weights_first_layer;
    fv_initialLinearLayer.c <== initialLinearLayerMMOut;
    component addBias_initialLinearLayer = matEleSumTwo(n,p);
    addBias_initialLinearLayer.a <== fv_initialLinearLayer.out;
    addBias_initialLinearLayer.b <== bias_first_layer;
    signal query_key_value[n][p] <== addBias_initialLinearLayer.out;
    log("finish first Linear Layer");

   
    //split into heads
    component splitHeads = Split(n,p,numHead);
    splitHeads.in <== query_key_value;
    
    var headSize = p/numHead;
    signal headsAll[numHead][n][headSize] <== splitHeads.out;
    
    //split into q ,k ,v
    component attn_head[numHead]; 
    var sizeQKV = headSize/3;
    signal multiHeadAttnOut[numHead][n][sizeQKV];
    for(var head_i=0;head_i<numHead;head_i++){
        attn_head[head_i]= attention_single_head(n,headSize,dim,fracbits);
        attn_head[head_i].head <== headsAll[head_i];
        attn_head[head_i].rope_cos <== rope_cos;
        attn_head[head_i].rope_sin <== rope_sin;
        attn_head[head_i].mask <== mask;
        attn_head[head_i].qln2 <== qln2;
        attn_head[head_i].a_sm <== a_sm;
        attn_head[head_i].b_sm <== b_sm;
        attn_head[head_i].c_sm <== c_sm;
        //freivalds
        attn_head[head_i].keyQueryMM <== keyQueryMM[head_i];
        attn_head[head_i].keyQueryMM_aux <== keyQueryMM_aux[head_i];

        multiHeadAttnOut[head_i] <== attn_head[head_i].out;
    }
    //merge all heads
    signal mergedOut[n][numHead*sizeQKV];
    for(var i =0;i<n;i++){
        for(var j =0;j<numHead*sizeQKV;j++){
            var headIdx = j \ sizeQKV;
            var idx = j % sizeQKV;
            mergedOut[i][j] <== multiHeadAttnOut[headIdx][i][idx];
        }
    }
    //final linear layer
    component linear_final = Linear(n, numHead*sizeQKV,numHead*sizeQKV,fracbits);
    linear_final.in <== mergedOut;
    linear_final.weights <== weight_attn_final;
    linear_final.bias <== bias_attn_final;

    signal output out[n][numHead*sizeQKV] <== linear_final.out;

}

// component main {public [in]} = attention(_arg);