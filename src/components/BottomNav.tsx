import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function BottomNav({admin=false}:{admin?:boolean}) {
 const router=useRouter(), path=usePathname(); const {user}=useApp();
 const isAdmin=admin||user?.role==='admin';
 const items=isAdmin
  ? [{label:'Cửa hàng',route:'/',icon:'storefront-outline'},{label:'Quản trị',route:'/admin',icon:'grid-outline'},{label:'Đơn hàng',route:'/admin/orders',icon:'receipt-outline'},{label:'Hồ sơ',route:'/profile',icon:'person-outline'}]
  : [{label:'Trang chủ',route:'/',icon:'home-outline'},{label:'Giỏ hàng',route:'/cart',icon:'bag-handle-outline'},...(user?[{label:'Đơn hàng',route:'/orders',icon:'receipt-outline'},{label:'Hồ sơ',route:'/profile',icon:'person-outline'}]:[{label:'Đăng nhập',route:'/login',icon:'person-outline'}])];
 return <View style={{flexDirection:'row',backgroundColor:C.white,borderTopWidth:1,borderTopColor:C.line,paddingTop:8,paddingBottom:10,justifyContent:'space-around'}}>
 {items.map(item=>{
  const active=path===item.route||(item.route!=='/'&&path.startsWith(`${item.route}/`));
  return <TouchableOpacity key={item.label} accessibilityRole="button" accessibilityLabel={item.label} onPress={()=>router.push(item.route as any)} style={{alignItems:'center',justifyContent:'center',minWidth:62,minHeight:42,gap:3}}>
  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={active?C.burgundy:C.muted}/>
  <Text style={{fontSize:10,fontWeight:active?'900':'700',color:active?C.burgundy:C.muted}}>{item.label}</Text>
 </TouchableOpacity>;
 })}
 </View>;
}
