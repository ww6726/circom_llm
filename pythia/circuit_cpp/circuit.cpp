#include <stdio.h>
#include <iostream>
#include <assert.h>
#include "circom.hpp"
#include "calcwit.hpp"
void matEleMul_0_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void matEleMul_0_run(uint ctx_index,Circom_CalcWit* ctx);
void matEleSum_1_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void matEleSum_1_run(uint ctx_index,Circom_CalcWit* ctx);
void Num2Bits_2_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void Num2Bits_2_run(uint ctx_index,Circom_CalcWit* ctx);
void LessThan_3_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void LessThan_3_run(uint ctx_index,Circom_CalcWit* ctx);
void GreaterEqThan_4_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void GreaterEqThan_4_run(uint ctx_index,Circom_CalcWit* ctx);
void absoluteValue_5_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void absoluteValue_5_run(uint ctx_index,Circom_CalcWit* ctx);
void Num2Bits_6_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void Num2Bits_6_run(uint ctx_index,Circom_CalcWit* ctx);
void truncate_7_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void truncate_7_run(uint ctx_index,Circom_CalcWit* ctx);
void matmul_8_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void matmul_8_run(uint ctx_index,Circom_CalcWit* ctx);
void matmultest_9_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather);
void matmultest_9_run(uint ctx_index,Circom_CalcWit* ctx);
Circom_TemplateFunction _functionTable[10] = { 
matEleMul_0_run,
matEleSum_1_run,
Num2Bits_2_run,
LessThan_3_run,
GreaterEqThan_4_run,
absoluteValue_5_run,
Num2Bits_6_run,
truncate_7_run,
matmul_8_run,
matmultest_9_run };
Circom_TemplateFunction _functionTableParallel[10] = { 
NULL,
NULL,
NULL,
NULL,
NULL,
NULL,
NULL,
NULL,
NULL,
NULL };
uint get_main_input_signal_start() {return 101;}

uint get_main_input_signal_no() {return 200;}

uint get_total_signal_no() {return 20501;}

uint get_number_of_components() {return 802;}

uint get_size_of_input_hashmap() {return 256;}

uint get_size_of_witness() {return 14201;}

uint get_size_of_constants() {return 12;}

uint get_size_of_io_map() {return 0;}

void release_memory_component(Circom_CalcWit* ctx, uint pos) {{

if (pos != 0){{

if(ctx->componentMemory[pos].subcomponents)
delete []ctx->componentMemory[pos].subcomponents;

if(ctx->componentMemory[pos].subcomponentsParallel)
delete []ctx->componentMemory[pos].subcomponentsParallel;

if(ctx->componentMemory[pos].outputIsSet)
delete []ctx->componentMemory[pos].outputIsSet;

if(ctx->componentMemory[pos].mutexes)
delete []ctx->componentMemory[pos].mutexes;

if(ctx->componentMemory[pos].cvs)
delete []ctx->componentMemory[pos].cvs;

if(ctx->componentMemory[pos].sbct)
delete []ctx->componentMemory[pos].sbct;

}}


}}


// function declarations
// template declarations
void matEleMul_0_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 0;
ctx->componentMemory[coffset].templateName = "matEleMul";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 20;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[0];
}

void matEleMul_0_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[3];
FrElement lvar[4];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[0]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[2],&circuitConstants[0]); // line circom 10
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[1]); // line circom 11
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &signalValues[mySignalStart + ((0 + (1 * Fr_toInt(&lvar[3]))) + 0)];
// load src
Fr_mul(&expaux[0],&signalValues[mySignalStart + ((0 + (1 * Fr_toInt(&lvar[3]))) + 10)],&signalValues[mySignalStart + ((0 + (1 * Fr_toInt(&lvar[3]))) + 20)]); // line circom 12
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
Fr_add(&expaux[0],&lvar[3],&circuitConstants[0]); // line circom 11
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[1]); // line circom 11
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[0]);
}
Fr_lt(&expaux[0],&lvar[2],&circuitConstants[0]); // line circom 10
}
for (uint i = 0; i < 0; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void matEleSum_1_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 1;
ctx->componentMemory[coffset].templateName = "matEleSum";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 10;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[0];
}

void matEleSum_1_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[5];
FrElement lvar[5];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[0]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 11];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + 1]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[0]); // line circom 10
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &lvar[4];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[4],&circuitConstants[1]); // line circom 11
while(Fr_isTrue(&expaux[0])){
Fr_gt(&expaux[0],&lvar[2],&circuitConstants[2]); // line circom 12
if(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[2])) + 11)];
// load src
Fr_sub(&expaux[2],&lvar[2],&circuitConstants[0]); // line circom 13
Fr_add(&expaux[0],&signalValues[mySignalStart + ((0 + (1 * Fr_toInt(&lvar[4]))) + 1)],&signalValues[mySignalStart + ((1 * Fr_toInt(&expaux[2])) + 11)]); // line circom 13
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
}
{
PFrElement aux_dest = &lvar[2];
// load src
Fr_add(&expaux[0],&lvar[2],&circuitConstants[0]); // line circom 15
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &lvar[4];
// load src
Fr_add(&expaux[0],&lvar[4],&circuitConstants[0]); // line circom 11
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[4],&circuitConstants[1]); // line circom 11
}
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[0]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[0]); // line circom 10
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 0];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + 20]);
}
for (uint i = 0; i < 0; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void Num2Bits_2_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 2;
ctx->componentMemory[coffset].templateName = "Num2Bits";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 1;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[0];
}

void Num2Bits_2_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[6];
FrElement lvar[4];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[4]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[0]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[4]); // line circom 32
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)];
// load src
Fr_shr(&expaux[1],&signalValues[mySignalStart + 65],&lvar[3]); // line circom 33
Fr_band(&expaux[0],&expaux[1],&circuitConstants[0]); // line circom 33
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_sub(&expaux[3],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)],&circuitConstants[0]); // line circom 34
Fr_mul(&expaux[1],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)],&expaux[3]); // line circom 34
Fr_eq(&expaux[0],&expaux[1],&circuitConstants[2]); // line circom 34
if (!Fr_isTrue(&expaux[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 34. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&expaux[0]));
{
PFrElement aux_dest = &lvar[1];
// load src
Fr_mul(&expaux[2],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)],&lvar[2]); // line circom 35
Fr_add(&expaux[0],&lvar[1],&expaux[2]); // line circom 35
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
Fr_add(&expaux[0],&lvar[2],&lvar[2]); // line circom 36
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
Fr_add(&expaux[0],&lvar[3],&circuitConstants[0]); // line circom 32
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[4]); // line circom 32
}
Fr_eq(&expaux[0],&lvar[1],&signalValues[mySignalStart + 65]); // line circom 38
if (!Fr_isTrue(&expaux[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 38. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&expaux[0]));
for (uint i = 0; i < 0; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void LessThan_3_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 3;
ctx->componentMemory[coffset].templateName = "LessThan";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 2;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[1]{0};
}

void LessThan_3_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[4];
FrElement lvar[1];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[5]);
}
{
uint aux_create = 0;
int aux_cmp_num = 0+ctx_index+1;
uint csoffset = mySignalStart+3;
for (uint i = 0; i < 1; i++) {
std::string new_cmp_name = "n2b";
Num2Bits_2_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 66 ;
aux_cmp_num += 1;
}
}
if (!Fr_isTrue(&circuitConstants[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 90. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&circuitConstants[0]));
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 65];
// load src
Fr_add(&expaux[1],&signalValues[mySignalStart + 1],&circuitConstants[6]); // line circom 96
Fr_sub(&expaux[0],&expaux[1],&signalValues[mySignalStart + 2]); // line circom 96
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
// need to run sub component
assert(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1));
Num2Bits_2_run(mySubcomponents[cmp_index_ref],ctx);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 0];
// load src
Fr_sub(&expaux[0],&circuitConstants[0],&ctx->signalValues[ctx->componentMemory[mySubcomponents[0]].signalStart + 64]); // line circom 98
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
for (uint i = 0; i < 1; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void GreaterEqThan_4_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 4;
ctx->componentMemory[coffset].templateName = "GreaterEqThan";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 2;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[1]{0};
}

void GreaterEqThan_4_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[3];
FrElement lvar[1];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[5]);
}
{
uint aux_create = 0;
int aux_cmp_num = 0+ctx_index+1;
uint csoffset = mySignalStart+3;
for (uint i = 0; i < 1; i++) {
std::string new_cmp_name = "lt";
LessThan_3_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 69 ;
aux_cmp_num += 2;
}
}
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 1];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + 2]);
}
// no need to run sub component
assert(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1);
}
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 2];
// load src
Fr_add(&expaux[0],&signalValues[mySignalStart + 1],&circuitConstants[0]); // line circom 137
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
// need to run sub component
assert(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1));
LessThan_3_run(mySubcomponents[cmp_index_ref],ctx);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 0];
// load src
// end load src
Fr_copy(aux_dest,&ctx->signalValues[ctx->componentMemory[mySubcomponents[0]].signalStart + 0]);
}
for (uint i = 0; i < 1; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void absoluteValue_5_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 5;
ctx->componentMemory[coffset].templateName = "absoluteValue";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 1;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[1]{0};
}

void absoluteValue_5_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[5];
FrElement lvar[0];
uint sub_component_aux;
uint index_multiple_eq;
{
uint aux_create = 0;
int aux_cmp_num = 0+ctx_index+1;
uint csoffset = mySignalStart+4;
for (uint i = 0; i < 1; i++) {
std::string new_cmp_name = "geq";
GreaterEqThan_4_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 72 ;
aux_cmp_num += 3;
}
}
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 1];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + 2]);
}
// no need to run sub component
assert(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1);
}
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
// need to run sub component
assert(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1));
GreaterEqThan_4_run(mySubcomponents[cmp_index_ref],ctx);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 3];
// load src
Fr_mul(&expaux[1],&circuitConstants[7],&ctx->signalValues[ctx->componentMemory[mySubcomponents[0]].signalStart + 0]); // line circom 48
Fr_sub(&expaux[0],&expaux[1],&circuitConstants[0]); // line circom 48
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 0];
// load src
Fr_mul(&expaux[0],&signalValues[mySignalStart + 3],&signalValues[mySignalStart + 2]); // line circom 49
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 1];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + 3]);
}
for (uint i = 0; i < 1; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void Num2Bits_6_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 6;
ctx->componentMemory[coffset].templateName = "Num2Bits";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 1;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[0];
}

void Num2Bits_6_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[6];
FrElement lvar[4];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[5]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[0]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[5]); // line circom 32
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)];
// load src
Fr_shr(&expaux[1],&signalValues[mySignalStart + 64],&lvar[3]); // line circom 33
Fr_band(&expaux[0],&expaux[1],&circuitConstants[0]); // line circom 33
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_sub(&expaux[3],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)],&circuitConstants[0]); // line circom 34
Fr_mul(&expaux[1],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)],&expaux[3]); // line circom 34
Fr_eq(&expaux[0],&expaux[1],&circuitConstants[2]); // line circom 34
if (!Fr_isTrue(&expaux[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 34. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&expaux[0]));
{
PFrElement aux_dest = &lvar[1];
// load src
Fr_mul(&expaux[2],&signalValues[mySignalStart + ((1 * Fr_toInt(&lvar[3])) + 0)],&lvar[2]); // line circom 35
Fr_add(&expaux[0],&lvar[1],&expaux[2]); // line circom 35
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
Fr_add(&expaux[0],&lvar[2],&lvar[2]); // line circom 36
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
Fr_add(&expaux[0],&lvar[3],&circuitConstants[0]); // line circom 32
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[3],&circuitConstants[5]); // line circom 32
}
Fr_eq(&expaux[0],&lvar[1],&signalValues[mySignalStart + 64]); // line circom 38
if (!Fr_isTrue(&expaux[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 38. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&expaux[0]));
for (uint i = 0; i < 0; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void truncate_7_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 7;
ctx->componentMemory[coffset].templateName = "truncate";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 1;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[2]{0};
}

void truncate_7_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[6];
FrElement lvar[4];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[8]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[9]);
}
{
uint aux_create = 0;
int aux_cmp_num = 0+ctx_index+1;
uint csoffset = mySignalStart+6;
for (uint i = 0; i < 1; i++) {
std::string new_cmp_name = "abs";
absoluteValue_5_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 76 ;
aux_cmp_num += 4;
}
}
{
uint aux_create = 1;
int aux_cmp_num = 4+ctx_index+1;
uint csoffset = mySignalStart+82;
for (uint i = 0; i < 1; i++) {
std::string new_cmp_name = "n2b";
Num2Bits_6_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 65 ;
aux_cmp_num += 1;
}
}
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 2];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + 1]);
}
// need to run sub component
assert(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1));
absoluteValue_5_run(mySubcomponents[cmp_index_ref],ctx);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 2];
// load src
// end load src
Fr_copy(aux_dest,&ctx->signalValues[ctx->componentMemory[mySubcomponents[0]].signalStart + 0]);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 3];
// load src
// end load src
Fr_copy(aux_dest,&ctx->signalValues[ctx->componentMemory[mySubcomponents[0]].signalStart + 1]);
}
{
uint cmp_index_ref = 1;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 64];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + 2]);
}
// need to run sub component
assert(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1));
Num2Bits_6_run(mySubcomponents[cmp_index_ref],ctx);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[10]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[11]);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 4];
// load src
Fr_idiv(&expaux[0],&signalValues[mySignalStart + 2],&circuitConstants[11]); // line circom 73
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 5];
// load src
Fr_mod(&expaux[0],&signalValues[mySignalStart + 2],&circuitConstants[11]); // line circom 74
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_mul(&expaux[3],&signalValues[mySignalStart + 4],&circuitConstants[11]); // line circom 75
Fr_add(&expaux[2],&expaux[3],&signalValues[mySignalStart + 5]); // line circom 75
Fr_eq(&expaux[0],&signalValues[mySignalStart + 2],&expaux[2]); // line circom 75
if (!Fr_isTrue(&expaux[0])) std::cout << "Failed assert in template/function " << myTemplateName << " line 75. " <<  "Followed trace of components: " << ctx->getTrace(myId) << std::endl;
assert(Fr_isTrue(&expaux[0]));
{
PFrElement aux_dest = &signalValues[mySignalStart + 0];
// load src
Fr_mul(&expaux[0],&signalValues[mySignalStart + 4],&signalValues[mySignalStart + 3]); // line circom 78
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
for (uint i = 0; i < 2; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void matmul_8_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 8;
ctx->componentMemory[coffset].templateName = "matmul";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 200;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[300]{0};
}

void matmul_8_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[3];
FrElement lvar[8];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[10]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
uint aux_create = 0;
int aux_cmp_num = 0+ctx_index+1;
uint csoffset = mySignalStart+400;
uint aux_dimensions[2] = {10,10};
for (uint i = 0; i < 100; i++) {
std::string new_cmp_name = "matEleMulComponent"+ctx->generate_position_array(aux_dimensions, 2, i);
matEleMul_0_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 30 ;
aux_cmp_num += 1;
}
}
{
uint aux_create = 100;
int aux_cmp_num = 100+ctx_index+1;
uint csoffset = mySignalStart+3400;
uint aux_dimensions[2] = {10,10};
for (uint i = 0; i < 100; i++) {
std::string new_cmp_name = "matEleSumComponent"+ctx->generate_position_array(aux_dimensions, 2, i);
matEleSum_1_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 21 ;
aux_cmp_num += 1;
}
}
{
uint aux_create = 200;
int aux_cmp_num = 200+ctx_index+1;
uint csoffset = mySignalStart+5500;
uint aux_dimensions[2] = {10,10};
for (uint i = 0; i < 100; i++) {
std::string new_cmp_name = "trun"+ctx->generate_position_array(aux_dimensions, 2, i);
truncate_7_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 147 ;
aux_cmp_num += 6;
}
}
{
PFrElement aux_dest = &lvar[4];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
{
PFrElement aux_dest = &lvar[5];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[5],&circuitConstants[1]); // line circom 14
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &lvar[6];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[6],&circuitConstants[1]); // line circom 15
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &lvar[7];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[7],&circuitConstants[1]); // line circom 19
while(Fr_isTrue(&expaux[0])){
{
uint cmp_index_ref = (((10 * Fr_toInt(&lvar[5])) + (1 * Fr_toInt(&lvar[6]))) + 0);
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + ((0 + (1 * Fr_toInt(&lvar[7]))) + 10)];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + (((10 * Fr_toInt(&lvar[5])) + (1 * Fr_toInt(&lvar[7]))) + 100)]);
}
// run sub component if needed
if(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1)){
matEleMul_0_run(mySubcomponents[cmp_index_ref],ctx);

}
}
{
uint cmp_index_ref = (((10 * Fr_toInt(&lvar[5])) + (1 * Fr_toInt(&lvar[6]))) + 0);
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + ((0 + (1 * Fr_toInt(&lvar[7]))) + 20)];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + (((10 * Fr_toInt(&lvar[7])) + (1 * Fr_toInt(&lvar[6]))) + 200)]);
}
// run sub component if needed
if(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1)){
matEleMul_0_run(mySubcomponents[cmp_index_ref],ctx);

}
}
{
PFrElement aux_dest = &lvar[7];
// load src
Fr_add(&expaux[0],&lvar[7],&circuitConstants[0]); // line circom 19
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[7],&circuitConstants[1]); // line circom 19
}
{
PFrElement aux_dest = &lvar[7];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[7],&circuitConstants[1]); // line circom 23
while(Fr_isTrue(&expaux[0])){
{
uint cmp_index_ref = (((10 * Fr_toInt(&lvar[5])) + (1 * Fr_toInt(&lvar[6]))) + 100);
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + ((0 + (1 * Fr_toInt(&lvar[7]))) + 1)];
// load src
// end load src
Fr_copy(aux_dest,&ctx->signalValues[ctx->componentMemory[mySubcomponents[(((10 * Fr_toInt(&lvar[5])) + (1 * Fr_toInt(&lvar[6]))) + 0)]].signalStart + ((0 + (1 * Fr_toInt(&lvar[7]))) + 0)]);
}
// run sub component if needed
if(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1)){
matEleSum_1_run(mySubcomponents[cmp_index_ref],ctx);

}
}
{
PFrElement aux_dest = &lvar[7];
// load src
Fr_add(&expaux[0],&lvar[7],&circuitConstants[0]); // line circom 23
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[7],&circuitConstants[1]); // line circom 23
}
{
PFrElement aux_dest = &signalValues[mySignalStart + (((10 * Fr_toInt(&lvar[5])) + (1 * Fr_toInt(&lvar[6]))) + 300)];
// load src
// end load src
Fr_copy(aux_dest,&ctx->signalValues[ctx->componentMemory[mySubcomponents[(((10 * Fr_toInt(&lvar[5])) + (1 * Fr_toInt(&lvar[6]))) + 100)]].signalStart + 0]);
}
{
PFrElement aux_dest = &lvar[6];
// load src
Fr_add(&expaux[0],&lvar[6],&circuitConstants[0]); // line circom 15
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[6],&circuitConstants[1]); // line circom 15
}
{
PFrElement aux_dest = &lvar[5];
// load src
Fr_add(&expaux[0],&lvar[5],&circuitConstants[0]); // line circom 14
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[5],&circuitConstants[1]); // line circom 14
}
{
PFrElement aux_dest = &lvar[5];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[8]);
}
{
PFrElement aux_dest = &lvar[6];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[6],&circuitConstants[1]); // line circom 33
while(Fr_isTrue(&expaux[0])){
{
PFrElement aux_dest = &lvar[7];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[2]);
}
Fr_lt(&expaux[0],&lvar[7],&circuitConstants[1]); // line circom 34
while(Fr_isTrue(&expaux[0])){
{
uint cmp_index_ref = (((10 * Fr_toInt(&lvar[6])) + (1 * Fr_toInt(&lvar[7]))) + 200);
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 1];
// load src
// end load src
Fr_copy(aux_dest,&signalValues[mySignalStart + (((10 * Fr_toInt(&lvar[6])) + (1 * Fr_toInt(&lvar[7]))) + 300)]);
}
// run sub component if needed
if(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 1)){
truncate_7_run(mySubcomponents[cmp_index_ref],ctx);

}
}
{
PFrElement aux_dest = &signalValues[mySignalStart + (((10 * Fr_toInt(&lvar[6])) + (1 * Fr_toInt(&lvar[7]))) + 0)];
// load src
// end load src
Fr_copy(aux_dest,&ctx->signalValues[ctx->componentMemory[mySubcomponents[(((10 * Fr_toInt(&lvar[6])) + (1 * Fr_toInt(&lvar[7]))) + 200)]].signalStart + 0]);
}
{
PFrElement aux_dest = &lvar[7];
// load src
Fr_add(&expaux[0],&lvar[7],&circuitConstants[0]); // line circom 34
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[7],&circuitConstants[1]); // line circom 34
}
{
PFrElement aux_dest = &lvar[6];
// load src
Fr_add(&expaux[0],&lvar[6],&circuitConstants[0]); // line circom 33
// end load src
Fr_copy(aux_dest,&expaux[0]);
}
Fr_lt(&expaux[0],&lvar[6],&circuitConstants[1]); // line circom 33
}
for (uint i = 0; i < 300; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void matmultest_9_create(uint soffset,uint coffset,Circom_CalcWit* ctx,std::string componentName,uint componentFather){
ctx->componentMemory[coffset].templateId = 9;
ctx->componentMemory[coffset].templateName = "matmultest";
ctx->componentMemory[coffset].signalStart = soffset;
ctx->componentMemory[coffset].inputCounter = 200;
ctx->componentMemory[coffset].componentName = componentName;
ctx->componentMemory[coffset].idFather = componentFather;
ctx->componentMemory[coffset].subcomponents = new uint[1]{0};
}

void matmultest_9_run(uint ctx_index,Circom_CalcWit* ctx){
FrElement* signalValues = ctx->signalValues;
u64 mySignalStart = ctx->componentMemory[ctx_index].signalStart;
std::string myTemplateName = ctx->componentMemory[ctx_index].templateName;
std::string myComponentName = ctx->componentMemory[ctx_index].componentName;
u64 myFather = ctx->componentMemory[ctx_index].idFather;
u64 myId = ctx_index;
u32* mySubcomponents = ctx->componentMemory[ctx_index].subcomponents;
bool* mySubcomponentsParallel = ctx->componentMemory[ctx_index].subcomponentsParallel;
FrElement* circuitConstants = ctx->circuitConstants;
std::string* listOfTemplateMessages = ctx->listOfTemplateMessages;
FrElement expaux[2];
FrElement lvar[4];
uint sub_component_aux;
uint index_multiple_eq;
{
PFrElement aux_dest = &lvar[0];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[10]);
}
{
PFrElement aux_dest = &lvar[1];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
PFrElement aux_dest = &lvar[2];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
PFrElement aux_dest = &lvar[3];
// load src
// end load src
Fr_copy(aux_dest,&circuitConstants[1]);
}
{
uint aux_create = 0;
int aux_cmp_num = 0+ctx_index+1;
uint csoffset = mySignalStart+300;
for (uint i = 0; i < 1; i++) {
std::string new_cmp_name = "mm";
matmul_8_create(csoffset,aux_cmp_num,ctx,new_cmp_name,myId);
mySubcomponents[aux_create+i] = aux_cmp_num;
csoffset += 20200 ;
aux_cmp_num += 801;
}
}
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 100];
// load src
// end load src
Fr_copyn(aux_dest,&signalValues[mySignalStart + 100],100);
}
// no need to run sub component
assert(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 100);
}
{
uint cmp_index_ref = 0;
{
PFrElement aux_dest = &ctx->signalValues[ctx->componentMemory[mySubcomponents[cmp_index_ref]].signalStart + 200];
// load src
// end load src
Fr_copyn(aux_dest,&signalValues[mySignalStart + 200],100);
}
// need to run sub component
assert(!(ctx->componentMemory[mySubcomponents[cmp_index_ref]].inputCounter -= 100));
matmul_8_run(mySubcomponents[cmp_index_ref],ctx);
}
{
PFrElement aux_dest = &signalValues[mySignalStart + 0];
// load src
// end load src
Fr_copyn(aux_dest,&ctx->signalValues[ctx->componentMemory[mySubcomponents[0]].signalStart + 0],100);
}
for (uint i = 0; i < 1; i++){
uint index_subc = ctx->componentMemory[ctx_index].subcomponents[i];
if (index_subc != 0)release_memory_component(ctx,index_subc);
}
}

void run(Circom_CalcWit* ctx){
matmultest_9_create(1,0,ctx,"main",0);
matmultest_9_run(0,ctx);
}

