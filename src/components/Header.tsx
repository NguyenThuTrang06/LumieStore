import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { useFeedback } from '@/context/FeedbackContext';

export default function Header({title='LUMIÉ STORE',showCart=true}:{title?:string;showCart?:boolean}) {
  const {user,logout,cart}=useApp(); const router=useRouter(),{showFeedback}=useFeedback();
  const cartCount=cart.reduce((total,item)=>total+item.quantity,0);
  return <View style={{backgroundColor:C.cream,paddingHorizontal:20,paddingTop:8,paddingBottom:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
    <View style={{flex:1}}>
      <Text style={{fontSize:20,fontWeight:'900',letterSpacing:1.4,color:C.burgundy}}>{title}</Text>
      <Text style={{fontSize:11,color:C.muted,marginTop:2}}>{user?`Xin chào, ${user.name}`:'A little elegance in every day'}</Text>
    </View>
    <View style={{flexDirection:'row',alignItems:'center',gap:14}}>
      {showCart&&<TouchableOpacity accessibilityRole="button" accessibilityLabel={`Giỏ hàng, ${cartCount} sản phẩm`} onPress={()=>router.push('/cart')} style={{width:38,height:38,alignItems:'center',justifyContent:'center'}}>
        <Ionicons name="bag-handle-outline" size={23} color={C.ink}/>
        {cartCount>0&&<View style={{position:'absolute',right:-3,top:-2,minWidth:17,height:17,borderRadius:9,backgroundColor:C.burgundy,alignItems:'center',justifyContent:'center',paddingHorizontal:4}}>
          <Text style={{color:C.white,fontSize:10,fontWeight:'900'}}>{cartCount>99?'99+':cartCount}</Text>
        </View>}
      </TouchableOpacity>}
      {user?<><TouchableOpacity onPress={()=>router.push('/profile')}><Text style={{fontSize:12,color:C.burgundy,fontWeight:'800'}}>Hồ sơ</Text></TouchableOpacity><TouchableOpacity onPress={()=>{void logout().then(()=>{router.replace('/');showFeedback('Đã đăng xuất','Bạn đã đăng xuất khỏi tài khoản.','success');}).catch(error=>showFeedback('Không thể đăng xuất',error instanceof Error?error.message:'Đã xảy ra lỗi.','error'));}}><Text style={{fontSize:12,color:C.burgundy,fontWeight:'800'}}>Đăng xuất</Text></TouchableOpacity></>:<TouchableOpacity onPress={()=>router.push('/login')}><Text style={{fontSize:12,color:C.burgundy,fontWeight:'800'}}>Đăng nhập</Text></TouchableOpacity>}
    </View>
  </View>;
}
