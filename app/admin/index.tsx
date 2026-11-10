import React from 'react';
import { View,Text,ScrollView,TouchableOpacity,Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { C } from '@/constants/colors';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';

const tiles=[
 {title:'Quản lý người dùng',sub:'Xem tài khoản và phân quyền',route:'/admin/users',icon:'♙'},
 {title:'Quản lý danh mục',sub:'Thêm, sửa, xóa danh mục',route:'/admin/categories',icon:'▦'},
 {title:'Quản lý sản phẩm',sub:'Quản lý kho và thông tin sản phẩm',route:'/admin/products',icon:'◇'},
 {title:'Quản lý đơn hàng',sub:'Theo dõi và cập nhật trạng thái',route:'/admin/orders',icon:'▤'}
];
export default function AdminHome(){
 const router=useRouter(),{user}=useApp();
 if(!user||user.role!=='admin')return <View style={{flex:1,justifyContent:'center',padding:24,backgroundColor:C.cream}}><Text style={{fontSize:22,fontWeight:'900',marginBottom:12}}>Khu vực dành cho Admin</Text><Text style={{color:C.muted,marginBottom:20}}>Vui lòng đăng nhập bằng tài khoản quản trị.</Text><Text onPress={()=>router.replace('/login')} style={{color:C.burgundy,fontWeight:'900'}}>ĐĂNG NHẬP ADMIN →</Text></View>;
 return <View style={{flex:1,backgroundColor:C.cream}}><Header title="LUMIÉ ADMIN" showCart={false}/><ScrollView contentContainerStyle={{padding:20}}>
  <View style={{backgroundColor:C.burgundy,borderRadius:18,padding:20,marginBottom:22}}><Text style={{color:'#F4DDE2',fontSize:11,fontWeight:'900',letterSpacing:2}}>ADMIN DASHBOARD</Text><Text style={{fontSize:25,color:C.white,fontWeight:'900',marginTop:8}}>Xin chào, {user.name}</Text><Text style={{color:'#F5E8EA',marginTop:6,fontSize:12}}>Quản trị cửa hàng LUMIÉ STORE</Text></View>
  <Text style={{fontSize:21,fontWeight:'900',color:C.ink,marginBottom:14}}>Trung tâm quản trị</Text>
  {tiles.map(t=><TouchableOpacity key={t.route} onPress={()=>router.push(t.route as any)} style={{backgroundColor:C.white,padding:18,borderRadius:15,marginBottom:12,flexDirection:'row',alignItems:'center'}}>
   <View style={{width:48,height:48,borderRadius:14,backgroundColor:C.roseLight,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:24,color:C.burgundy}}>{t.icon}</Text></View>
   <View style={{flex:1,marginLeft:13}}><Text style={{fontWeight:'900',color:C.ink,fontSize:15}}>{t.title}</Text><Text style={{fontSize:12,color:C.muted,marginTop:4}}>{t.sub}</Text></View><Text style={{color:C.burgundy,fontSize:20}}>›</Text>
  </TouchableOpacity>)}
  <TouchableOpacity onPress={()=>router.replace('/')} style={{padding:15,alignItems:'center'}}><Text style={{color:C.burgundy,fontWeight:'900'}}>← VỀ TRANG CHỦ NGƯỜI DÙNG</Text></TouchableOpacity>
 </ScrollView><BottomNav admin/></View>;
}
