import React,{useState,useEffect} from 'react';
import { View,Text,ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button,Field } from '@/components/UI';
import { C } from '@/constants/colors';
import { useFeedback } from '@/context/FeedbackContext';

export default function Profile(){
 const db=useSQLiteContext(),router=useRouter(),{user,refreshUser,logout}=useApp(),{showFeedback}=useFeedback();
 const [name,setName]=useState(user?.name||''),[phone,setPhone]=useState(user?.phone||''),[address,setAddress]=useState(user?.address||''),[busy,setBusy]=useState(false);
 useEffect(()=>{setName(user?.name||'');setPhone(user?.phone||'');setAddress(user?.address||'');},[user]);
 if(!user)return <View style={{flex:1,justifyContent:'center',padding:24,backgroundColor:C.cream}}><Text style={{fontSize:24,fontWeight:'900',marginBottom:18}}>Hồ sơ cá nhân</Text><Button title="ĐĂNG NHẬP" onPress={()=>router.push('/login')}/></View>;
 const save=async()=>{if(busy)return;if(!name.trim()){showFeedback('Thiếu họ tên','Vui lòng nhập họ tên của bạn.','warning');return;}try{setBusy(true);await db.runAsync('UPDATE users SET name=?,phone=?,address=? WHERE id=?',name.trim(),phone.trim(),address.trim(),user.id);await refreshUser();showFeedback('Đã cập nhật hồ sơ','Thông tin cá nhân của bạn đã được lưu.','success');}catch(error){showFeedback('Không thể lưu hồ sơ',error instanceof Error?error.message:'Đã xảy ra lỗi, vui lòng thử lại.','error');}finally{setBusy(false);}};
 return <ScrollView contentContainerStyle={{padding:22,backgroundColor:C.cream,flexGrow:1}}>
  <Text onPress={()=>router.back()} style={{color:C.burgundy,fontWeight:'900',marginBottom:22}}>‹  QUAY LẠI</Text>
  <Text style={{fontSize:27,fontWeight:'900',color:C.ink,marginBottom:8}}>Hồ sơ của tôi</Text>
  <Text style={{color:C.muted,marginBottom:22}}>{user.email} · {user.role}</Text>
  <Field label="Họ và tên" value={name} onChangeText={setName}/>
  <Field label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
  <Field label="Địa chỉ" value={address} onChangeText={setAddress} multiline/>
  <Button title={busy?'ĐANG LƯU...':'LƯU THAY ĐỔI'} onPress={save} disabled={busy}/>
  <View style={{marginTop:12}}><Button title="LỊCH SỬ MUA HÀNG" variant="outline" onPress={()=>router.push('/orders')}/></View>
  <View style={{marginTop:12}}><Button title="ĐĂNG XUẤT" variant="danger" onPress={()=>{void logout().then(()=>{router.replace('/');showFeedback('Đã đăng xuất','Bạn đã đăng xuất khỏi tài khoản.','success');}).catch(error=>showFeedback('Không thể đăng xuất',error instanceof Error?error.message:'Đã xảy ra lỗi.','error'));}}/></View>
 </ScrollView>;
}
