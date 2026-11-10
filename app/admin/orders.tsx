import React,{useCallback,useState} from 'react';
import { View,Text,ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect,useRouter } from 'expo-router';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button,Empty } from '@/components/UI';
import type { Order } from '@/types';
import { money } from '@/database/db';
import { useFeedback } from '@/context/FeedbackContext';

const transitions:Record<string,string[]>={
 'Chờ xác nhận':['Đang xử lý','Đã hủy'],
 'Đang xử lý':['Đang giao','Đã hủy'],
 'Đang giao':['Đã giao'],
 'Đã giao':[],
 'Đã hủy':[]
};

export default function AdminOrders(){
 const db=useSQLiteContext(),router=useRouter(),{user}=useApp(),{showFeedback,confirmFeedback}=useFeedback();const [rows,setRows]=useState<Order[]>([]);
 const load=async()=>setRows(await db.getAllAsync<Order>('SELECT o.*,u.name as customer_name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC'));
 useFocusEffect(useCallback(()=>{load().catch(error=>showFeedback('Không thể tải đơn hàng',error instanceof Error?error.message:'Đã xảy ra lỗi.','error'));},[db,showFeedback]));
 const update=async(order:Order,status:string)=>{
  const save=async()=>{try{
   await db.withTransactionAsync(async()=>{
    const current=await db.getFirstAsync<{status:string}>('SELECT status FROM orders WHERE id=?',order.id);
    if(!current||!transitions[current.status]?.includes(status))throw new Error('Trạng thái đơn hàng đã thay đổi. Hãy tải lại danh sách rồi thử lại.');
    const result=await db.runAsync('UPDATE orders SET status=? WHERE id=? AND status=?',status,order.id,current.status);
    if(result.changes!==1)throw new Error('Đơn hàng vừa được cập nhật ở nơi khác. Hãy tải lại danh sách.');
    if(status==='Đã hủy'){
     const items=await db.getAllAsync<{product_id:number;quantity:number}>('SELECT product_id,quantity FROM order_items WHERE order_id=?',order.id);
     for(const item of items)await db.runAsync('UPDATE products SET stock=stock+? WHERE id=?',item.quantity,item.product_id);
    }
   });
   await load();
   showFeedback(status==='Đã hủy'?'Đã hủy đơn hàng':'Đã cập nhật đơn hàng',`Đơn hàng #${order.id} hiện ở trạng thái “${status}”.`,'success');
  }catch(error){showFeedback('Không thể cập nhật đơn hàng',error instanceof Error?error.message:'Đã xảy ra lỗi.','error');}};
  if(status==='Đã hủy'&&!await confirmFeedback('Hủy đơn hàng',`Bạn có chắc muốn hủy đơn #${order.id}? Tồn kho sẽ được hoàn lại.`,'Hủy đơn'))return;
  await save();
 };
 if(user?.role!=='admin')return <Text style={{padding:24}}>Bạn không có quyền truy cập.</Text>;
 return <ScrollView contentContainerStyle={{padding:20,backgroundColor:C.cream,flexGrow:1}}>
  <Text onPress={()=>router.back()} style={{color:C.burgundy,fontWeight:'900',marginBottom:20}}>‹  ADMIN</Text>
  <Text style={{fontSize:25,fontWeight:'900',color:C.ink,marginBottom:18}}>Quản lý đơn hàng</Text>
  {rows.length===0?<Empty title="Chưa có đơn hàng" subtitle="Đơn hàng mới sẽ xuất hiện tại đây."/>:rows.map(order=>{
   const nextStatuses=transitions[order.status]||[];
   return <View key={order.id} style={{backgroundColor:C.white,borderRadius:15,padding:16,marginBottom:12}}>
    <Text style={{fontWeight:'900',color:C.ink}}>Đơn #{order.id} · {order.customer_name}</Text>
    <Text style={{color:C.muted,fontSize:12,marginTop:5}}>{order.created_at}</Text>
    <Text style={{color:C.muted,fontSize:12,marginTop:5}}>Địa chỉ: {order.address}</Text>
    <Text style={{fontSize:17,color:C.burgundy,fontWeight:'900',marginTop:9}}>{money(order.total)}</Text>
    <Text style={{marginVertical:9,color:C.green,fontWeight:'900'}}>Trạng thái: {order.status}</Text>
    {nextStatuses.map(status=><View key={status} style={{marginTop:8}}>
     <Button title={status==='Đã hủy'?'HỦY ĐƠN HÀNG':`CHUYỂN SANG ${status.toUpperCase()}`} variant={status==='Đã hủy'?'danger':'outline'} onPress={()=>update(order,status)}/>
    </View>)}
    {nextStatuses.length===0&&<Text style={{color:C.muted,fontSize:12}}>Đơn hàng đã kết thúc, không thể đổi trạng thái.</Text>}
   </View>;
  })}
 </ScrollView>;
}
