#!/bin/bash


#compile the code and generate circuit
# circom build_circuit/circom_runner/pythia.circom --r1cs --wasm --sym --c 
circuit_eval_start=$(date +%s)
circom circuit.circom --r1cs  --c 
circuit_eval_end=$(date +%s)
circuit_eval_time=$((circuit_eval_end - circuit_eval_start))

#generate the witness file
# cd circuit_js
# cd ..
#create an input file in circuit_js


# json_content='{
#   "a": "4",
#   "b": "32"
# }'

# echo "$json_content" > input.json
# auto-generate input for mm
node generate_matrix.js
# cp input.json circuit_js
# cd circuit_js
# node generate_witness.js circuit.wasm input.json witness.wtns
#enter circuit_cpp and compute the witness; make sure to move input.json here as well
cd circuit_cpp
make
cp ../input.json .
cp ../circuit.r1cs .
./circuit input.json witness.wtns


#Phase 1, this step is independent of circuit, start and participate in the ceremony of tau#
# this can only run once?
snarkjs powersoftau new bn128 21 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v


# use this if above is commented
# cp ../pot12_final.ptau .
#Phase 2
generate_key_start=$(date +%s)
snarkjs groth16 setup circuit.r1cs pot12_final.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json
generate_key_end=$(date +%s)
key_gen_time=$((generate_key_end - generate_key_start))

#prover generate proof
generate_proof_start=$(date +%s)
snarkjs groth16 prove circuit_0001.zkey witness.wtns proof.json public.json
generate_proof_end=$(date +%s)
proof_gen_time=$((generate_proof_end - generate_proof_start))
#verifier verify
snarkjs groth16 verify verification_key.json public.json proof.json



#Tuntime breakdown
echo "Circuit evaluation time: ${circuit_eval_time} seconds"
echo "Eval, Verify keygen time: ${key_gen_time} seconds"
echo "Proof Gen time: ${proof_gen_time} seconds"


#clean up
# rm ../*.r1cs
# rm ../*.sym
cd ..
# rm -rf circuit_js/
# rm -rf circuit_cpp/


