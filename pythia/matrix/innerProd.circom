pragma circom 2.0.0;
template innerProd(n){
    signal input a[n];
    signal input b[n];
    signal output out;

    var sum = 0;
    for(var i =0;i<n;i++){
        sum += a[i]*b[i]; 
    }
    out <-- sum;
    log(out);
    signal dummy;
    dummy <== a[0]*b[0];

}