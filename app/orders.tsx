import React,{useCallback,useState} from 'react';
import { View,Text,ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect,useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { C } from '@/constants/colors';
import { money } from '@/database/db';
import type { Order } from '@/types';
import { Button,Empty,Loading } from '@/components/UI';

export default function Orders(){
 const db=useSQLiteContext(),{user}=useApp(),router=useRouter();const [orders,setOrders]=useState<Order[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null);
 useFocusEffect(useCallback(()=>{
  let active=true;
  if(!user){setOrders([]);setError(null);setLoading(false);return()=>{active=false;};}
  setLoading(true);setError(null);
  db.getAllAsync<Order>('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC',user.id)
   .then(rows=>{if(active)setOrders(rows);})
   .catch(reason=>{if(active)setError(reason instanceof Error?reason.message:'Không thể tải lịch sử đơn hàng.');})
   .finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};
 },[db,user?.id]));
 return <ScrollView contentContainerStyle={{padding:20,backgroundColor:C.cream,flexGrow:1}}>
  <Text onPress={()=>router.back()} style={{color:C.burgundy,fontWeight:'900',marginBottom:20}}>‹  QUAY LẠI</Text>
  <Text style={{fontSize:26,fontWeight:'900',color:C.ink,marginBottom:18}}>Lịch sử mua hàng</Text>
  {!user?<><Empty title="Đăng nhập để xem đơn hàng" subtitle="Lịch sử mua sắm được lưu theo tài khoản của bạn."/><View style={{marginTop:14}}><Button title="ĐĂNG NHẬP" onPress={()=>router.push({pathname:'/login',params:{returnTo:'/orders'}})}/></View></>:loading?<Loading/>:error?<Empty title="Không thể tải đơn hàng" subtitle={error}/>:!orders.length?<><Empty title="Chưa có đơn hàng" subtitle="Đơn hàng của bạn sẽ xuất hiện tại đây."/><View style={{marginTop:14}}><Button title="TIẾP TỤC MUA SẮM" onPress={()=>router.replace('/')}/></View></>:orders.map(o=><View key={o.id} style={{backgroundColor:C.white,borderRadius:15,padding:16,marginBottom:12}}>
   <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontWeight:'900',color:C.ink}}>Đơn hàng #{o.id}</Text><Text style={{color:C.green,fontWeight:'800',fontSize:12}}>{o.status}</Text></View>
   <Text style={{color:C.muted,fontSize:12,marginTop:7}}>{o.created_at}</Text>
   <Text style={{color:C.muted,fontSize:12,marginTop:5}}>Giao đến: {o.address}</Text>
   <Text style={{color:C.burgundy,fontWeight:'900',fontSize:17,marginTop:10}}>{money(o.total)}</Text>
  </View>)}
 </ScrollView>;
}
