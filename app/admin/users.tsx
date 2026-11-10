import React,{useCallback,useState} from 'react';
import { View,Text,ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect,useRouter } from 'expo-router';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button,Empty } from '@/components/UI';
import type { User } from '@/types';
import { useFeedback } from '@/context/FeedbackContext';

export default function Users(){
 const db=useSQLiteContext(),router=useRouter(),{user}=useApp(),{showFeedback,confirmFeedback}=useFeedback();const [rows,setRows]=useState<User[]>([]);
 const load=async()=>setRows(await db.getAllAsync<User>('SELECT id,name,email,phone,address,role FROM users ORDER BY id DESC'));
 useFocusEffect(useCallback(()=>{load().catch(error=>showFeedback('Không thể tải người dùng',error instanceof Error?error.message:'Đã xảy ra lỗi.','error'));},[db,showFeedback]));
 if(user?.role!=='admin')return <Text style={{padding:24}}>Bạn không có quyền truy cập.</Text>;
 const toggle=async(u:User)=>{if(u.id===user.id){showFeedback('Không thể đổi vai trò','Bạn không thể tự thay đổi vai trò của mình.','warning');return;}try{const role=u.role==='admin'?'user':'admin';await db.runAsync('UPDATE users SET role=? WHERE id=?',role,u.id);await load();showFeedback('Đã đổi vai trò',`${u.name} hiện có vai trò ${role==='admin'?'quản trị viên':'khách hàng'}.`,'success');}catch(error){showFeedback('Không thể đổi vai trò',error instanceof Error?error.message:'Đã xảy ra lỗi.','error');}};
 const del=async(u:User)=>{if(!await confirmFeedback('Xóa người dùng',`Bạn có chắc muốn xóa tài khoản ${u.name}?`,'Xóa người dùng'))return;try{const orders=await db.getFirstAsync<{count:number}>('SELECT COUNT(*) as count FROM orders WHERE user_id=?',u.id);if((orders?.count||0)>0){showFeedback('Không thể xóa người dùng','Tài khoản này có lịch sử đơn hàng. Hãy giữ tài khoản để bảo toàn thông tin đơn.','warning');return;}await db.runAsync('DELETE FROM users WHERE id=? AND role=?',u.id,'user');await load();showFeedback('Đã xóa người dùng',`Tài khoản ${u.name} đã được xóa.`,'success');}catch(error){showFeedback('Không thể xóa người dùng',error instanceof Error?error.message:'Đã xảy ra lỗi.','error');}};
 return <ScrollView contentContainerStyle={{padding:20,backgroundColor:C.cream,flexGrow:1}}><Text onPress={()=>router.back()} style={{color:C.burgundy,fontWeight:'900',marginBottom:20}}>‹  ADMIN</Text><Text style={{fontSize:25,fontWeight:'900',color:C.ink,marginBottom:18}}>Quản lý người dùng</Text>
 {rows.length===0?<Empty title="Chưa có người dùng"/>:rows.map(u=><View key={u.id} style={{backgroundColor:C.white,borderRadius:15,padding:15,marginBottom:12}}><Text style={{fontWeight:'900',fontSize:15,color:C.ink}}>{u.name}</Text><Text style={{color:C.muted,marginTop:4,fontSize:12}}>{u.email}</Text><Text style={{color:u.role==='admin'?C.burgundy:C.green,fontWeight:'900',fontSize:11,marginTop:8}}>VAI TRÒ: {u.role.toUpperCase()}</Text><View style={{flexDirection:'row',gap:8,marginTop:12}}><View style={{flex:1}}><Button title="Đổi vai trò" variant="outline" disabled={u.id===user.id} onPress={()=>toggle(u)}/></View>{u.role==='user'&&<View style={{flex:1}}><Button title="Xóa user" variant="danger" onPress={()=>del(u)}/></View>}</View></View>)}
 </ScrollView>;
}
