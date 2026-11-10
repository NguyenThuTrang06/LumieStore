import React,{useState} from 'react';
import { View,Text,ScrollView } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button,Field } from '@/components/UI';
import { C } from '@/constants/colors';
import { useFeedback } from '@/context/FeedbackContext';

export default function Signup(){
 const {signup}=useApp(),router=useRouter(),params=useLocalSearchParams<{returnTo?:string}>(),{showFeedback}=useFeedback();const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false);
 const returnTo=params.returnTo==='/checkout'||params.returnTo==='/orders'?params.returnTo:'/';
 const submit=async()=>{if(busy)return;if(!name.trim()||!email.trim()||!password){showFeedback('Thiếu thông tin','Vui lòng điền đầy đủ thông tin.','warning');return;}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){showFeedback('Email chưa hợp lệ','Vui lòng kiểm tra lại địa chỉ email.','warning');return;}if(password.length<6){showFeedback('Mật khẩu chưa hợp lệ','Mật khẩu cần ít nhất 6 ký tự.','warning');return;}if(password!==confirm){showFeedback('Mật khẩu không khớp','Vui lòng nhập lại mật khẩu xác nhận.','warning');return;}try{setBusy(true);await signup(name,email,password);router.replace(returnTo);showFeedback('Tạo tài khoản thành công','Tài khoản của bạn đã sẵn sàng sử dụng.','success');}catch(e){showFeedback('Không thể đăng ký',e instanceof Error?e.message:'Đã xảy ra lỗi, vui lòng thử lại.','error');}finally{setBusy(false);}};
 return <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',padding:24,backgroundColor:C.cream}}>
  <Text onPress={()=>router.replace('/')} style={{color:C.burgundy,fontWeight:'800',marginBottom:28}}>‹  LUMIÉ STORE</Text>
  <Text style={{fontSize:12,color:C.rose,fontWeight:'900',letterSpacing:2}}>JOIN OUR COMMUNITY</Text>
  <Text style={{fontSize:31,fontWeight:'900',color:C.ink,marginTop:8}}>Tạo tài khoản</Text>
  <Text style={{color:C.muted,marginTop:8,marginBottom:26}}>Bắt đầu hành trình mua sắm của bạn.</Text>
  <Field label="Họ và tên" value={name} onChangeText={setName} placeholder="Nguyễn Văn A"/>
  <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="name@example.com"/>
  <Field label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="Tối thiểu 6 ký tự"/>
  <Field label="Xác nhận mật khẩu" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Nhập lại mật khẩu"/>
  <Button title={busy?'ĐANG TẠO TÀI KHOẢN...':'TẠO TÀI KHOẢN'} onPress={submit} disabled={busy}/>
  <Text style={{textAlign:'center',color:C.muted,marginTop:22}}>Đã có tài khoản? <Text onPress={()=>router.push({pathname:'/login',params:{returnTo}})} style={{color:C.burgundy,fontWeight:'900'}}>Đăng nhập</Text></Text>
 </ScrollView>;
}
