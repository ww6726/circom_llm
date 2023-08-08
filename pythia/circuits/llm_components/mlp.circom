pragma circom 2.0.0;
include "../ml_components/Linear.circom";
include "../ml_components/GeLU.circom";
template MLP(n,m,p,fracBits){
    signal input in[n][m];
    //first Linear
    signal input weight1[m][p];
    signal input bias1[n][p];
    //Gelu
    signal input q_root2_inv;
    signal input gelu_a;
    signal input gelu_b_neg;
    signal input gelu_b;
    signal input gelu_c;
    //second Linear
    signal input weight2[p][m];
    signal input bias2[n][m];

    //freivalds;
    signal input mlp_first_aux[n][p];
    signal input mlp_second_aux[n][m];


    // //OLD: compute first layer
    // component l1 = Linear(n,m,p,fracBits);
    // l1.in <== in;
    // l1.weights <== weight1;
    // l1.bias <== bias1;

   //NEW freivalds mlp1
    component fv_mlp1 = FreivaldsWithUntruncatedResult(n,m,p,fracBits);
    fv_mlp1.a <== in;
    fv_mlp1.b <== weight1;
    fv_mlp1.c <== mlp_first_aux;
    component addBias_mlp1 = matEleSumTwo(n,p);
    addBias_mlp1.a <== fv_mlp1.out;
    addBias_mlp1.b <== bias1;
    
   
    //compute 2d gelu
    component gelu = Gelu2D(n,p,fracBits);
    gelu.in <== addBias_mlp1.out;
    gelu.q_root2_inv <== q_root2_inv;
    gelu.gelu_a <== gelu_a;
    gelu.gelu_b_neg <== gelu_b_neg;
    gelu.gelu_b <== gelu_b;
    gelu.gelu_c <== gelu_c;



    // //compute second layer
    // component l2 = Linear(n,p,m,fracBits);
    // l2.in <== gelu.out;
    // l2.weights <== weight2;
    // l2.bias <== bias2;

     //NEW freivalds mlp2
    component fv_mlp2 = FreivaldsWithUntruncatedResult(n,p,m,fracBits);
    fv_mlp2.a <== gelu.out;
    fv_mlp2.b <== weight2;
    fv_mlp2.c <== mlp_second_aux;
    component addBias_mlp2 = matEleSumTwo(n,m);
    addBias_mlp2.a <== fv_mlp2.out;
    addBias_mlp2.b <== bias2;

   
    signal output out[n][m] <== addBias_mlp2.out;

  


}