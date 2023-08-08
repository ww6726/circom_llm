pragma circom 2.0.3;

include "ml_components/Linear.circom";
include "ml_components/Split.circom";
include "ml_components/LayerNorm.circom";
include "llm_components/attention.circom";
include "llm_components/GPTLayer.circom";

template Pythia(numLayer,n,m,p,attention_dim,mlp_Linear1_size,fracBits,numHead){
    
     signal input in[n][m];
    //attention weights, bias
    signal input weights[numLayer][m][p];
    signal input biases[numLayer][n][p];
    signal input weights_attn_final[numLayer][m][m];
    signal input biases_attn_final[numLayer][n][m];
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
    signal input weights_mlp_1st[numLayer][m][mlp_Linear1_size];
    signal input biases_mlp_1st[numLayer][n][mlp_Linear1_size];
    signal input weights_mlp_2nd[numLayer][mlp_Linear1_size][m];
    signal input biases_mlp_2nd[numLayer][n][m];
    //Gelu
    signal input q_root2_inv;
    signal input gelu_a;
    signal input gelu_b_neg;
    signal input gelu_b;
    signal input gelu_c;
    //freivalds
    signal input initialLinearLayerMMOut[numLayer][n][p];
    signal input keyQueryMM[numLayer][numHead][n][n];
    signal input keyQueryMM_aux[numLayer][numHead][n][n];
    var softmaxValue_aux_dim = p/numHead;
    softmaxValue_aux_dim = softmaxValue_aux_dim/3;
    signal input softmaxValue_aux[numLayer][numHead][n][softmaxValue_aux_dim];
    signal input finalLinearLayer_aux[numLayer][n][softmaxValue_aux_dim*numHead];

    signal input mlp_first_aux[numLayer][n][mlp_Linear1_size];
    signal input mlp_second_aux[numLayer][n][softmaxValue_aux_dim*numHead];


    //Begin
    component gptLayers[numLayer];
    signal gptLayerOutputs[numLayer+1][n][m];
    gptLayerOutputs[0] <== in;
    var idx = 0;
    for(var i =0;i<numLayer;i++){
        log("========= Layer i Done =============");
        gptLayers[i] = gptLayer(n,m,p,attention_dim,mlp_Linear1_size,fracBits,numHead);
        gptLayers[i].in <== gptLayerOutputs[idx];
        gptLayers[i].weight <== weights[i];
        gptLayers[i].bias <== biases[i];
        gptLayers[i].weight_attn_final <== weights_attn_final[i];
        gptLayers[i].bias_attn_final <== biases_attn_final[i];


        gptLayers[i].rope_cos <== rope_cos;
        gptLayers[i].rope_sin <== rope_sin;
        gptLayers[i].mask <== mask;
        gptLayers[i].qln2 <== qln2;
        gptLayers[i].a_sm <== a_sm;
        gptLayers[i].b_sm <== b_sm;
        gptLayers[i].c_sm <== c_sm;
        gptLayers[i].weight_mlp_1 <== weights_mlp_1st[i];
        gptLayers[i].bias_mlp_1 <== biases_mlp_1st[i];
        gptLayers[i].weight_mlp_2 <== weights_mlp_2nd[i];
        gptLayers[i].bias_mlp_2 <== biases_mlp_2nd[i];
        gptLayers[i].q_root2_inv <== q_root2_inv;
        gptLayers[i].gelu_a <== gelu_a;
        gptLayers[i].gelu_b_neg <== gelu_b_neg;
        gptLayers[i].gelu_b <== gelu_b;
        gptLayers[i].gelu_c <== gelu_c;
        //freivalds
        gptLayers[i].initialLinearLayerMMOut <== initialLinearLayerMMOut[i];
        gptLayers[i].keyQueryMM <== keyQueryMM[i];
        gptLayers[i].keyQueryMM_aux <== keyQueryMM_aux[i];
        gptLayers[i].softmaxValue_aux <== softmaxValue_aux[i];
        gptLayers[i].finalLinearLayer_aux <== finalLinearLayer_aux[i];
        gptLayers[i].mlp_first_aux <== mlp_first_aux[i];
        gptLayers[i].mlp_second_aux <== mlp_second_aux[i];


        idx = idx + 1;
        gptLayerOutputs[idx] <== gptLayers[i].out;
        
    }

    // add final LayerNorm
    component final_LM =  LayerNorm(n,m,fracBits);
    final_LM.in <== gptLayerOutputs[numLayer];

    //output
    signal output out[n][m] <== final_LM.out;

    // for(var i=0;i<n;i++){
    //     for(var j=0;j<m;j++){
    //         log(out[i][j]);
    //     }
    // }



  

    
}
