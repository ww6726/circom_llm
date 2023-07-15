pragma circom 2.0.0;

include "../matrix/matmul.circom";
include "../util/fixedPoint.circom";

template avg(n){
    signal input in[n];
    
    component findSum = Sum(n);
    findSum.in <== in;
    signal sum <== findSum.out;
    signal output out <-- sum \ n;
    signal r <-- sum % n;
    sum === out*n + r;
}
template LayerNorm1D(n,fracbits){
    component po2 = powOfTwo(32);
    po2.in <== fracbits;
    signal scale <== po2.out;
    signal input in[n];

    component findAvg = avg(n);
    findAvg.in <== in;
    signal E <== findAvg.out;

    //find var
    signal inMinusE[n];
    for(var i =0;i<n;i++){
        inMinusE[i] <== (in[i] - E)*(in[i] - E);
    }
    
    component findSum = Sum(n);
    findSum.in <== inMinusE;
    signal sum_inMinusE <== findSum.out;
    signal varSquare <-- sum_inMinusE \ n;
    signal r <-- sum_inMinusE % n;
    sum_inMinusE === varSquare * n + r;

    component sqrt = squareRoot();
    sqrt.in <== varSquare;
    signal VAR <== sqrt.out;
    //compute output
    signal output out[n];
    signal in_E_scaled[n];// We need to scale it up to make sure that output is scaled. Otherwise, divide it by VAR will be unscaled
    
    //testing
    signal in_E_scaled_abs[n];
    component abs[n];
    signal out_[n];
    signal r_out[n];

    for(var i = 0;i<n;i++){
        in_E_scaled[i] <== scale * (in[i] - E);
        abs[i] = absoluteValue();
        abs[i].in <== in_E_scaled[i];
        in_E_scaled_abs[i] <== abs[i].out[0];
        out_[i] <-- (in_E_scaled_abs[i]) \ VAR;
        r_out[i] <-- (in_E_scaled_abs[i]) % VAR;
        (in_E_scaled_abs[i]) === out_[i] * VAR + r_out[i];
        out[i] <== out_[i] * abs[i].out[1];
    }

}

template LayerNorm(n,m,fracbits){
    signal input in[n][m];
    component LN1[n];
    signal output out[n][m];
    for(var i=0;i<n;i++){
        LN1[i] = LayerNorm1D(m,fracbits);
        LN1[i].in <== in[i];
        out[i] <== LN1[i].out;
    }

}