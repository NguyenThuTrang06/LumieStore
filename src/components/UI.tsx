import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { C } from '@/constants/colors';

export function Button({title,onPress,variant='primary',disabled=false}:{title:string;onPress:()=>void;variant?:'primary'|'outline'|'soft'|'danger';disabled?:boolean}) {
  return <TouchableOpacity activeOpacity={0.85} disabled={disabled} onPress={onPress} style={[s.button,variant==='outline'&&s.outline,variant==='soft'&&s.soft,variant==='danger'&&s.danger,disabled&&{opacity:.5}]}>
    <Text style={[s.buttonText,variant==='outline'&&{color:C.burgundy},variant==='soft'&&{color:C.burgundy}]}>{title}</Text>
  </TouchableOpacity>;
}
export function Field({label,value,onChangeText,placeholder,secureTextEntry,keyboardType,multiline}:{label:string;value:string;onChangeText:(v:string)=>void;placeholder?:string;secureTextEntry?:boolean;keyboardType?:any;multiline?:boolean}) {
  return <View style={{marginBottom:14}}>
    <Text style={s.label}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder||label} placeholderTextColor={C.muted} secureTextEntry={secureTextEntry} keyboardType={keyboardType} multiline={multiline} style={[s.input,multiline&&{height:90,textAlignVertical:'top'}]}/>
  </View>;
}
export function SectionTitle({title,action,onAction}:{title:string;action?:string;onAction?:()=>void}) {
  return <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
    <Text style={{fontSize:19,fontWeight:'800',color:C.ink}}>{title}</Text>
    {action&&<Text onPress={onAction} style={{color:C.burgundy,fontWeight:'700'}}>{action}</Text>}
  </View>;
}
export function Empty({title,subtitle}:{title:string;subtitle?:string}) {
  return <View style={{padding:32,alignItems:'center',backgroundColor:C.white,borderRadius:18}}>
    <Text style={{fontSize:36,marginBottom:10}}>♡</Text><Text style={{fontSize:16,fontWeight:'800',color:C.ink}}>{title}</Text>
    {!!subtitle&&<Text style={{color:C.muted,textAlign:'center',marginTop:6}}>{subtitle}</Text>}
  </View>;
}
export function ProductImage({uri}:{uri:string}) {
  return <Image source={{uri}} style={{width:'100%',height:'100%'}} resizeMode="cover" onError={()=>{}}/>;
}
export function Loading(){return <View style={{padding:30}}><ActivityIndicator color={C.burgundy}/></View>}
const s=StyleSheet.create({
  button:{backgroundColor:C.burgundy,paddingVertical:14,paddingHorizontal:18,borderRadius:13,alignItems:'center',justifyContent:'center'},
  outline:{backgroundColor:C.white,borderWidth:1,borderColor:C.burgundy},
  soft:{backgroundColor:C.roseLight},
  danger:{backgroundColor:C.red},
  buttonText:{color:C.white,fontWeight:'800',fontSize:14},
  label:{fontSize:12,fontWeight:'800',color:C.ink,marginBottom:7},
  input:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:12,paddingHorizontal:14,paddingVertical:13,color:C.ink,fontSize:14}
});
