pragma circom 2.0.3;

include "ml_components/Linear.circom";
include "ml_components/Split.circom";
include "ml_components/LayerNorm.circom";
include "llm_components/attention.circom";
include "llm_components/GPTLayer.circom";


template outlier_detect(num,n,m,fracBits){
    signal input weights[num][n][m] ;
    
    signal output out[n][m];
}