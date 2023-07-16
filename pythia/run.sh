#!/bin/bash
#compile the code and generate circuit
circom circuit.circom --r1cs --wasm --sym --c 


#generate the witness file
cd circuit_js
#create an input file in circuit_js


json_content='{
  "a": "4"
}'

# json_content='{
#   "x": "1",
#   "y": "1",
#   "z": "3",
#   "b": "3",
#   "q": "1",
#   "r": "1"
# }'
echo "$json_content" > input.json

# # auto-generate input for mm
# node ../generate_input.js
# cp ../input.json .

node generate_witness.js circuit.wasm input.json witness.wtns
#enter circuit_cpp and compute the witness; make sure to move input.json here as well
cd ../circuit_cpp
make
cp ../circuit_js/input.json .
./circuit input.json witness.wtns


#Phase 1, this step is independent of circuit, start and participate in the ceremony of tau
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v


#Phase 2
cp ../circuit.r1cs .
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
snarkjs groth16 setup circuit.r1cs pot12_final.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json


#prover generate proof
snarkjs groth16 prove circuit_0001.zkey witness.wtns proof.json public.json
#verifier verify
snarkjs groth16 verify verification_key.json public.json proof.json


#clean up
rm ../*.r1cs
rm ../*.sym
cd ..
rm -rf circom_js/
rm -rf circom_cpp/


