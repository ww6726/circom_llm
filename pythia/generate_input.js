const fs = require('fs');



const m = 4;
const n = 4;
const p = 4;

const matrixA = [];
const matrixB = [];

// Create matrixA
for (let i = 0; i < m; i++) {
    matrixA[i] = [];
    for (let j = 0; j < n; j++) {
        matrixA[i][j] = i * n + j + 1;
    }
}
// Create matrixB
for (let i = 0; i < n; i++) {
    matrixB[i] = [];
    for (let j = 0; j < p; j++) {
        matrixB[i][j] = i + j + 1;
    }
}
const input = {
    a: matrixA,
    b: matrixB
  };

  const inputJson = JSON.stringify(input);

  fs.writeFile('input.json', inputJson, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Input data written to file successfully!');
    }
  });