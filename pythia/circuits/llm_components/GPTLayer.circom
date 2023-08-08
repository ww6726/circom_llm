pragma circom 2.0.0;
include "../llm_components/attention.circom";
include "../llm_components/mlp.circom";
include "../ml_components/LayerNorm.circom";
include "../matrix/matEleSum.circom";

template gptLayer(n,m,p,attention_dim,mlp_Linear1_size,fracBits,numHead){
    signal input in[n][m];
    //attention weights, bias
    signal input weight[m][p];
    signal input bias[n][p];
    signal input weight_attn_final[m][m];
    signal input bias_attn_final[n][m];
    //attention RoPE
    signal input rope_cos[n][attention_dim];
    signal input rope_sin[n][attention_dim];
    signal input mask[n][n];
    //softmax
    signal input qln2;
    signal input a_sm;
    signal input b_sm;
    signal input c_sm;


    //MLP layer weights, bias 
    signal input weight_mlp_1[m][mlp_Linear1_size];
    signal input bias_mlp_1[n][mlp_Linear1_size];
    signal input weight_mlp_2[mlp_Linear1_size][m];
    signal input bias_mlp_2[n][m];
    //Gelu
    signal input q_root2_inv;
    signal input gelu_a;
    signal input gelu_b_neg;
    signal input gelu_b;
    signal input gelu_c;
    //freivalds
    signal input initialLinearLayerMMOut[n][p];
    signal input keyQueryMM[numHead][n][n];
    signal input keyQueryMM_aux[numHead][n][n];
    var softmaxValue_aux_dim = p/numHead;
    softmaxValue_aux_dim = softmaxValue_aux_dim/3;
    signal input softmaxValue_aux[numHead][n][softmaxValue_aux_dim];
    signal input finalLinearLayer_aux[n][softmaxValue_aux_dim*numHead];
    signal input mlp_first_aux[n][mlp_Linear1_size];
    signal input mlp_second_aux[n][softmaxValue_aux_dim*numHead];


    //1st LayerNorm layer
    component lm_1st = LayerNorm(n,m,fracBits);
    lm_1st.in <== in;
    signal lm_1st_out[n][m] <== lm_1st.out;
    //attention layer
    component attn =  attention(n,m,p,attention_dim,fracBits,numHead);
    attn.in_first_layer <== lm_1st_out;
    attn.weights_first_layer <== weight;
    attn.bias_first_layer <== bias;
    attn.weight_attn_final <== weight_attn_final;
    attn.bias_attn_final <== bias_attn_final;

    attn.rope_cos <== rope_cos;
    attn.rope_sin <== rope_sin;
    attn.mask <== mask;
    attn.qln2 <== qln2;
    attn.a_sm <== a_sm;
    attn.b_sm <== b_sm;
    attn.c_sm <== c_sm;

    //freivalds
    attn.initialLinearLayerMMOut <== initialLinearLayerMMOut;
    attn.keyQueryMM <== keyQueryMM;
    attn.keyQueryMM_aux <== keyQueryMM_aux;
    attn.softmaxValue_aux <== softmaxValue_aux;
    attn.finalLinearLayer_aux <== finalLinearLayer_aux;

    

    signal attn_out[n][softmaxValue_aux_dim*numHead] <== attn.out;//this is also needed in residual connection



    //2nd LayerNorm layer
    component lm_2nd = LayerNorm(n,softmaxValue_aux_dim*numHead,fracBits);
    lm_2nd.in <== attn_out;
    signal lm_2nd_out[n][softmaxValue_aux_dim*numHead] <== lm_2nd.out;




    // MLP Layer
    component mlp = MLP(n,softmaxValue_aux_dim*numHead,mlp_Linear1_size,fracBits);
    mlp.in <== lm_2nd_out;
    mlp.weight1 <== weight_mlp_1;
    mlp.bias1 <== bias_mlp_1;
    mlp.q_root2_inv <== q_root2_inv;
    mlp.gelu_a <== gelu_a;
    mlp.gelu_b_neg <== gelu_b_neg;
    mlp.gelu_b <== gelu_b;
    mlp.gelu_c <== gelu_c;
    mlp.weight2 <== weight_mlp_2;
    mlp.bias2 <== bias_mlp_2;

    //freivalds
    mlp.mlp_first_aux <== mlp_first_aux;
    mlp.mlp_second_aux <== mlp_second_aux;

    //add residual layer
    component residual = matEleSumTwo(n,m);
    residual.a <== attn_out;
    residual.b <== mlp.out;

    signal output out[n][m] <== residual.out;

     

}