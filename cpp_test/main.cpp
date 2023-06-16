#include <iostream>
#include <cmath>
using namespace std;
uint32_t floatToQ8_8(float value) {
    return static_cast<int>(value * pow(2,8));
}
float q16_16ToFloat(uint32_t value){
    return static_cast<float>(value / pow(2,16));

}

template <int N, int M>
uint32_t FloatToQ(float value) {
    uint32_t q_fixed = static_cast<uint32_t>(std::round(value * std::pow(2, M))); // Multiply by 2^M to shift the decimal point
    return q_fixed;
}
std::string Uint32ToBits(uint32_t value) {
    std::string result;
    for (int i = 31; i >= 0; --i) {
        result += ((value >> i) & 1) ? '1' : '0';
    }
    return result;
}

template <int N, int M>
float QToFloat(uint32_t q_fixed) {
    // float value = static_cast<float>(q_fixed) / std::pow(2, M); // Divide by 2^M to shift the decimal point back
    std::string bits = Uint32ToBits(q_fixed);
    float ret = 0;
    int power = N+M - 1 - M;
    for(char bit: bits){

        if(bit == '1'){
            ret += std::pow(2, power);
        }
        --power;
    }

    return ret;
}
int main() {
    // Example usage
    float a = 3.5;
    float b = 2.5;
    
    uint32_t a_q = FloatToQ<6,10>(a);
    uint32_t b_q = FloatToQ<6,10>(b);

    cout<<Uint32ToBits(a_q)<<endl;
    cout<<Uint32ToBits(b_q)<<endl;

    cout<<a_q<<endl;
    cout<<b_q<<endl;

    uint32_t aTimesB_q = a_q*b_q;
    cout<<aTimesB_q<<endl;
    float aTimesB = QToFloat<12,4>(aTimesB_q);

    std::cout << "Float value: " << aTimesB << std::endl;

    return 0;
}
