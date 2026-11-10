import React from 'react';
import { View,Text,ScrollView,Image,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button,Empty } from '@/components/UI';
import { C } from '@/constants/colors';
import { money } from '@/database/db';
import { Ionicons } from '@expo/vector-icons';
import { useFeedback } from '@/context/FeedbackContext';

export default function Cart(){
 const {cart,changeQty,removeFromCart,user}=useApp(),router=useRouter(),{showFeedback}=useFeedback();
 const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
 return <View style={{flex:1,backgroundColor:C.cream}}>
  <Text onPress={()=>router.back()} style={{padding:20,color:C.burgundy,fontWeight:'900'}}>‹  GIỎ HÀNG</Text>
  <ScrollView contentContainerStyle={{padding:18}}>
   <View style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:18}}><Ionicons name="bag-handle-outline" size={27} color={C.burgundy}/><Text style={{fontSize:25,fontWeight:'900',color:C.ink}}>Giỏ hàng</Text></View>
   {cart.length===0?<><Empty title="Giỏ hàng đang trống" subtitle="Hãy khám phá và chọn món đồ bạn yêu thích nhé."/><View style={{marginTop:16}}><Button title="TIẾP TỤC MUA SẮM" onPress={()=>router.replace('/')}/></View></>:cart.map(i=><View key={i.id} style={{flexDirection:'row',backgroundColor:C.white,padding:12,borderRadius:15,marginBottom:12}}>
    <Image source={{uri:i.image}} style={{width:88,height:100,borderRadius:10,backgroundColor:C.roseLight}}/>
    <View style={{flex:1,marginLeft:12,justifyContent:'space-between'}}>
     <View><Text style={{fontWeight:'900',color:C.ink}}>{i.name}</Text><Text style={{color:C.burgundy,fontWeight:'900',marginTop:5}}>{money(i.price)}</Text><Text style={{color:C.muted,fontSize:11,marginTop:3}}>Còn {i.stock} sản phẩm</Text></View>
     <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      <View style={{flexDirection:'row',alignItems:'center',gap:13}}><TouchableOpacity accessibilityLabel="Giảm số lượng" onPress={()=>changeQty(i.id,-1)}><Text style={{fontSize:20,color:C.burgundy}}>−</Text></TouchableOpacity><Text style={{fontWeight:'900'}}>{i.quantity}</Text><TouchableOpacity accessibilityLabel="Tăng số lượng" disabled={i.quantity>=i.stock} onPress={()=>changeQty(i.id,1)}><Text style={{fontSize:20,color:i.quantity>=i.stock?C.muted:C.burgundy}}>+</Text></TouchableOpacity></View>
      <Text style={{color:C.ink,fontSize:12,fontWeight:'800'}}>{money(i.price*i.quantity)}</Text>
     </View>
     <TouchableOpacity onPress={()=>{removeFromCart(i.id);showFeedback('Đã xóa sản phẩm',`${i.name} đã được xóa khỏi giỏ hàng.`,'success');}} style={{alignSelf:'flex-end',marginTop:6}}><Text style={{color:C.red,fontSize:12,fontWeight:'800'}}>Xóa khỏi giỏ</Text></TouchableOpacity>
    </View>
   </View>)}
   {cart.length>0&&<View style={{backgroundColor:C.white,borderRadius:16,padding:18,marginTop:8}}>
    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:14}}><Text style={{color:C.muted}}>Tạm tính</Text><Text style={{fontWeight:'900',color:C.ink}}>{money(total)}</Text></View>
    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:18}}><Text style={{fontSize:16,fontWeight:'900'}}>Tổng thanh toán</Text><Text style={{fontSize:17,fontWeight:'900',color:C.burgundy}}>{money(total)}</Text></View>
    <Button title="TIẾN HÀNH THANH TOÁN" onPress={()=>{if(!user)router.push({pathname:'/login',params:{returnTo:'/checkout'}});else router.push('/checkout');}}/>
    {!user&&<Text style={{color:C.muted,fontSize:12,textAlign:'center',marginTop:10}}>Bạn sẽ đăng nhập trước khi xác nhận đơn hàng.</Text>}
   </View>}
  </ScrollView>
 </View>;
}
