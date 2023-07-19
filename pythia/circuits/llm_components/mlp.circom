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


    //compute first layer
    component l1 = Linear(n,m,p,fracBits);
    l1.in <== in;
    l1.weights <== weight1;
    l1.bias <== bias1;
    //compute 2d gelu
    component gelu = Gelu2D(n,p,fracBits);
    gelu.in <== l1.out;
    gelu.q_root2_inv <== q_root2_inv;
    gelu.gelu_a <== gelu_a;
    gelu.gelu_b_neg <== gelu_b_neg;
    gelu.gelu_b <== gelu_b;
    gelu.gelu_c <== gelu_c;
    //compute second layer
    component l2 = Linear(n,p,m,fracBits);
    l2.in <== gelu.out;
    l2.weights <== weight2;
    l2.bias <== bias2;

    signal output out[n][m] <== l2.out;




}