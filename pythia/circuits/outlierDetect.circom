pragma circom 2.0.3;

include "ml_components/Linear.circom";
include "ml_components/Split.circom";
include "ml_components/LayerNorm.circom";
include "llm_components/attention.circom";
include "llm_components/GPTLayer.circom";
include "circomlib/comparators.circom";
include "util/fixedPoint.circom";
include "matrix/matDotMat.circom";
template sumVector(num){
    signal input in[num];
    signal sum[num];
    sum[0] <== in[0];
    for(var i = 0;i<num;i++){
        if(i>0){
            sum[i] <== in[i] + sum[i-1];
        }
    }
    signal output out <== sum[num-1];
}
template L2_norm(n,m,fracBits){
    signal input in[n][m];
    signal sum[n*m];
    sum[0] = in[0][0]*in[0][0];
    var idx = 0;
    for(var i=0;i<n;i++){
        for(var j=0;j<m;j++){
           if(idx>0){
            sum[idx] <== sum[idx-1] + in[i][j] * in[i][j];
           }
           idx++;
        }
    }
    component sqrt = squareRoot();
    sqrt.in <== sum[n*m-1];
    signal output out <== sqrt.out;

}
template L2_distance(n,m,fracBits){
    signal input a[n][m];
    signal input b[n][m];
    // component powerOf2[n][m];
    signal sum[n*m];
    sum[0] <== (a[0][0] - b[0][0]) * (a[0][0] - b[0][0]);
    var idx = 0;
    for(var i=0;i<n;i++){
        for(var j=0;j<m;j++){
            // powerOf2[i][j] = powOfTwo(5);
            // powerOf2[i][j].in <== a[i][j] - b[i][j];
            if(idx>0){
    
                sum[idx] <== sum[idx-1] + (a[i][j] - b[i][j]) * (a[i][j] - b[i][j]);
                // sum[idx] <== sum[idx-1] + powerOf2[i][j].out;

            }
            idx++;
        }
    }
    // component sqrt = squareRoot();
    // sqrt.in <== sum[n*m-1];

    signal distance <== sum[0];
    signal output out <== distance;
}
template compute_krum_score(num,n,m,numNeighbors,numMalicious,idx,fracBits){
    signal input weights[num][n][m];
    signal d[num];
    component compare[num];
    component L2s[num];
    for(var i=0;i<num;i++){
        compare[i] = IsEqual();
        compare[i].in[0] <== i;
        compare[i].in[1] <== idx;

        L2s[i] = L2_distance(n,m,fracBits);
        L2s[i].a <== weights[i];
        L2s[i].b <== weights[idx];
        d[i] <== (1 - compare[i].out) * L2s[i].out;
    }
    component sumDistance = sumVector(num);
    sumDistance.in <== d;
    signal output out <== sumDistance.out;
   
}
template krum_avg(num,n,m,numNeighbors,numMalicious,fracBits){
    signal input weights[num][n][m];
    signal sk[num];
    component cks[num];
    for(var i=0;i<num;i++){
        cks[i] = compute_krum_score(num,n,m,numNeighbors,numMalicious,i,fracBits);
        cks[i].weights <== weights;
        sk[i] <== cks[i].out;
    }

    //find model_avg
    signal weight_avg[n][m];
    signal weight_avg_remainder[n][m];
    for(var i=0;i<n;i++){
        for(var j=0;j<m;j++){
            var sum = 0;
            for(var k=0;k<num;k++){
                sum += weights[k][i][j];
            }
            weight_avg[i][j] <-- sum \ num;
            weight_avg_remainder[i][j] <-- sum % num;
            sum === weight_avg[i][j] * num + weight_avg_remainder[i][j];
        }
    }
    signal output out[n][m] <== weight_avg;
}
template gaussian(num){
    signal input in[num];
    component sumV = sumVector(num);
    sumV.in <== in;
    signal sumScore <== sumV.out;
    signal mu <-- sumScore \ num;
    signal mu_remainder <-- sumScore % num;
    sumScore === mu * num + mu_remainder;
    signal sigma_denom <== num - 1;

    signal sigma_numerators[num];// we'll only take the last one
    sigma_numerators[0] <== (in[0] - mu)*(in[0] - mu);
    for(var i =0;i<num;i++){
        if(i>0){
            sigma_numerators[i] <== sigma_numerators[i-1] + (in[i] - mu)*(in[i] - mu);
        }
    }
    signal sigma_numerator <== sigma_numerators[num-1];
    component sqrt = squareRoot();
    signal sqrt_in <-- sigma_numerator \ sigma_denom;
    signal sqrt_in_remainder <-- sigma_numerator % sigma_denom;
    sigma_numerator === sqrt_in * sigma_denom + sqrt_in_remainder;
    sqrt.in <== sqrt_in;
    signal sigma <== sqrt.out;

    signal output out[2];
    out[0]<==mu;
    out[1]<==sigma;

}
template cosine_similarity(n,m,fracBits){
    signal input a[n][m];
    signal input b[n][m];
    component matrixDotMatrix = matDotMat(n,m,fracBits);
    matrixDotMatrix.a <== a;
    matrixDotMatrix.b <== b;
    signal innerProdMatrx <== matrixDotMatrix.out;

}
template outlierDetect(num,n,m,numMalicious,numNeighbors,fracBits){
    signal input weights[num][n][m] ;
    signal output out[n][m];
    component krumAvg = krum_avg(num,n,m,numNeighbors,numMalicious,fracBits);
    krumAvg.weights <== weights;
    signal weight_avg[n][m] <== krumAvg.out;

    //compute_L2_score
    signal scores[num];
    component compute_L2_score[num];
    for(var i=0;i<num;i++){
        compute_L2_score[i] = L2_distance(n,m,fracBits);
        compute_L2_score[i].a <== weights[i];
        compute_L2_score[i].b <== weight_avg;
        scores[i] <== compute_L2_score[i].out;
    }

    component gauss = gaussian(num);
    gauss.in <== scores;
    signal mu <== gauss.out[0];
    signal sigma <== gauss.out[1];

    log(mu);
    log(sigma);

}