import React from 'react';
import { Text,View } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/UI';
import { C } from '@/constants/colors';

export default function OrderSuccess(){
 const router=useRouter(),{orderId}=useLocalSearchParams<{orderId?:string}>();
 return <View style={{flex:1,backgroundColor:C.cream,justifyContent:'center',padding:24}}>
  <View style={{width:104,height:104,borderRadius:52,backgroundColor:C.greenLight,alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:24}}>
   <Ionicons name="checkmark-circle" size={76} color={C.green}/>
  </View>
  <Text style={{fontSize:27,fontWeight:'900',color:C.ink,textAlign:'center'}}>Đặt hàng thành công!</Text>
  <Text style={{fontSize:15,color:C.muted,lineHeight:23,textAlign:'center',marginTop:12}}>Đơn hàng{orderId?` #${orderId}`:''} đã được ghi nhận. Cảm ơn bạn đã mua sắm tại LUMIÉ STORE.</Text>
  <View style={{marginTop:30,gap:12}}>
   <Button title="TIẾP TỤC MUA SẮM" onPress={()=>router.replace('/')}/>
   <Button title="XEM ĐƠN HÀNG" variant="outline" onPress={()=>router.replace('/orders')}/>
  </View>
 </View>;
}
