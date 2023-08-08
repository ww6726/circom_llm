pragma circom 2.0.0;
  include "../../circuits/ml_components/LayerNorm.circom";
  
  component main = LayerNorm(2,4,8);