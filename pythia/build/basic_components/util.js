// helperFunction.js
function addNumbers(a, b) {
    return a + b;
}
function floatToQ8_8(value) {
    return Math.floor(value * (2**8));
}  
function q16_16ToFloat(value) {
    return (value / (2**16));
}  
function print(a){
    console.log(a);
}
function multiplyTwoExtended(binaryString1, binaryString2, n) {
    // Convert binary strings to decimal numbers
    const number1 = parseInt(binaryString1, 2);
    const number2 = parseInt(binaryString2, 2);
  
    // Perform multiplication
    const result = number1 * number2;
    // Convert result back to binary string
    const resultBinary = result.toString(2).padStart(n, '0');
    // Extract the rightmost n bits
    const truncatedResult = resultBinary.slice(-n);

    return truncatedResult;
  }
function signExtend(binaryString, originalLength) {
    const extendedLength = originalLength * 2;
    
    // Determine the sign bit
    const signBit = binaryString.charAt(0);
    
    // Repeat the sign bit to extend the binary string
    const extendedString = signBit.repeat(extendedLength - originalLength) + binaryString;
    
    return extendedString;
  }
function UintToBits(n,value) {

    var binaryString = value.toString(2).padStart(n, '0');
    return binaryString;
}
function intToTwosComplement(number, numBits) {
    // Determine the range of values that can be represented
    const maxValue = Math.pow(2, numBits - 1) - 1;
    const minValue = -Math.pow(2, numBits - 1);
  
    // Check if the number is within the representable range
    if (number < minValue || number > maxValue) {
      throw new Error(`Number ${number} is out of range for ${numBits}-bit two's complement representation.`);
    }
  
    // Convert the number to its two's complement representation
    const binary = (number >>> 0).toString(2);
    const paddedBinary = binary.padStart(numBits, number < 0 ? '1' : '0');
    
    return paddedBinary.slice(-numBits);
}
function twosComplementToBinary(twosComplement) {
    const isNegative = twosComplement.charAt(0) === '1';
  
    if (!isNegative) {
      // The number is already in normal binary representation
      return twosComplement;
    }
    // Invert all the bits
    let inverted = '';
    for (let i = 0; i < twosComplement.length; i++) {
      inverted += twosComplement.charAt(i) === '0' ? '1' : '0';
    }
    const inverted_number = parseInt(inverted, 2)+1;
    const binary = inverted_number.toString(2).padStart(twosComplement.length, '0');

    return binary;
  }
  
function floatToQ_signed(N, M,value) {
    var ret= Math.floor(value * (2**M));
    
    if(value <0){
        //get its 2'complment
        bits_2C = intToTwosComplement(ret,N+M+1);//gives the signed extended version
        ret = parseInt(bits_2C, 2);
    }
    return ret;
  }
  

function floatToQ(N,M,value) {

    return Math.floor(value * (2**M));
}  
function QToFloat(N, M, q_fixed) {
    var bits = UintToBits(N+M,q_fixed);
    // print(q_fixed);
    // print(bits);
    // print(N);
    var ret = 0;
    var power = N + M - 1 - M;

    for (var i = 0; i < bits.length; i++) {
        var bit = bits.charAt(i);

        if (bit === '1') {
            ret += Math.pow(2, power);
        }

        power--;
    }

    return ret;
}
//q_fixed has bit size (N+M)*2. We need to cut it to N+M accordingly
function truncation(N,M,bits){
    var truncate_bits = bits.substring(0, N+M);
    var decimalNumber = parseInt(truncate_bits, 2);
    return decimalNumber;
}

// const a = 0.25;
// const b = 0.14;


function test_conversion_old(){
    const N = 4;
    const M = 4;
    
    const a = 2.5;
    const b = 3.4;
    
    var aValue = floatToQ(N,M,a);
    var bValue = floatToQ(N,M,b);
    
    
    var cValue = aValue * bValue;
    var cbits = cValue.toString(2).padStart(2*(N+M), '0');
    cValue = truncation(N,M,cbits);

    var int_bitFinal = 2*N;
    var frac_bitFinal = N+M-int_bitFinal;
    var c = QToFloat(int_bitFinal,frac_bitFinal,cValue);
    
    console.log(`QN.M aValue: ${aValue}`);
    console.log(`QN.M bValue: ${bValue}`);
    console.log(`QN.M cValue: ${cValue}`);
    console.log(`QN.M representation: ${c}`);
}

function test_conversion(){
    const N = 6;
    const M = 8;

    const a = 0.5;
    const b = 0.5;
    const sign = (a>=0 && b>=0) || (a<0 && b<0) ? 1: -1;  
    //step1 convert to 2's complement
    var aValue = floatToQ_signed(N,M,a);
    var bValue = floatToQ_signed(N,M,b);
    print(aValue);
    print(bValue);

    //step2 sign-extend to twice of (N+M+1)
    var aValue_bit = signExtend(UintToBits(N+M+1,aValue),N+M+1);
    var bValue_bit = signExtend(UintToBits(N+M+1,bValue),N+M+1);
    //step3: get the right most twice bit length after multiplication
    var cValue_bit = multiplyTwoExtended(aValue_bit,bValue_bit,2*(N+M+1));
    //step4: get convert from 2s complement back to fix-point representation
    cValue_bit = twosComplementToBinary(cValue_bit);

    //step5: find desired bits for int and float and done;
    var cValue = sign* parseInt(cValue_bit,2)/2**16;

    console.log(`QN.M aValue: ${aValue_bit}`);
    console.log(`QN.M bValue: ${bValue_bit}`);
    console.log(`QN.M cValue: ${cValue_bit}`);
    console.log(`QN.M cValue: ${cValue}`);

}

// test_conversion_old();


//===================for unit tests===========================
module.exports = {
    floatToQ,
    QToFloat,
    floatToQ_signed
    
};