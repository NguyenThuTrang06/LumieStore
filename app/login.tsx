import React,{useState} from 'react';
import { View,Text,TouchableOpacity,KeyboardAvoidingView,Platform,ScrollView } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Button,Field } from '@/components/UI';
import { C } from '@/constants/colors';
import { useFeedback } from '@/context/FeedbackContext';

export default function Login(){
 const {login}=useApp(),router=useRouter(),params=useLocalSearchParams<{returnTo?:string}>(),{showFeedback}=useFeedback();const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[showDemo,setShowDemo]=useState(false);
 const returnTo=params.returnTo==='/checkout'||params.returnTo==='/orders'?params.returnTo:'/';
 const submit=async()=>{if(busy)return;if(!email.trim()||!password){showFeedback('Thiếu thông tin','Vui lòng nhập email và mật khẩu.','warning');return;}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){showFeedback('Email chưa hợp lệ','Vui lòng kiểm tra lại địa chỉ email.','warning');return;}try{setBusy(true);await login(email,password);router.replace(returnTo);showFeedback('Đăng nhập thành công','Chào mừng bạn quay lại LUMIÉ STORE.','success');}catch(e){showFeedback('Đăng nhập không thành công',e instanceof Error?e.message:'Đã xảy ra lỗi, vui lòng thử lại.','error');}finally{setBusy(false);}};
 return <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={{flex:1,backgroundColor:C.cream}}>
  <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',padding:24}}>
   <Text onPress={()=>router.replace('/')} style={{color:C.burgundy,fontWeight:'800',marginBottom:30}}>‹  LUMIÉ STORE</Text>
   <Text style={{fontSize:12,color:C.rose,fontWeight:'900',letterSpacing:2}}>WELCOME BACK</Text>
   <Text style={{fontSize:32,fontWeight:'900',color:C.ink,marginTop:8}}>Đăng nhập</Text>
   <Text style={{color:C.muted,marginTop:8,marginBottom:28}}>Đăng nhập để tiếp tục trải nghiệm mua sắm.</Text>
   <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="name@example.com"/>
   <Field label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="Nhập mật khẩu"/>
   <Button title={busy?'ĐANG XỬ LÝ...':'ĐĂNG NHẬP'} onPress={submit} disabled={busy}/>
   <Text style={{textAlign:'center',color:C.muted,marginTop:22}}>Chưa có tài khoản? <Text onPress={()=>router.push({pathname:'/signup',params:{returnTo}})} style={{color:C.burgundy,fontWeight:'900'}}>Đăng ký ngay</Text></Text>
   <View style={{marginTop:28,padding:15,backgroundColor:C.roseLight,borderRadius:12}}>
    <TouchableOpacity accessibilityRole="button" accessibilityState={{expanded:showDemo}} onPress={()=>setShowDemo(value=>!value)}>
     <Text style={{fontWeight:'900',color:C.burgundy}}>{showDemo?'Ẩn tài khoản demo':'Xem tài khoản demo'} <Text>{showDemo?'−':'+'}</Text></Text>
    </TouchableOpacity>
    {showDemo&&<View style={{marginTop:12,gap:12}}>
     <View style={{backgroundColor:C.white,borderRadius:10,padding:11}}>
      <Text style={{fontWeight:'900',color:C.ink,fontSize:12}}>Quản trị viên</Text>
      <Text selectable style={{color:C.muted,fontSize:12,marginTop:6}}>Email: admin@lumie.store</Text>
      <Text selectable style={{color:C.muted,fontSize:12,marginTop:3}}>Mật khẩu: admin123</Text>
      <TouchableOpacity accessibilityRole="button" onPress={()=>{setEmail('admin@lumie.store');setPassword('admin123');}} style={{alignSelf:'flex-start',marginTop:9,paddingVertical:7,paddingHorizontal:10,backgroundColor:C.roseLight,borderRadius:8}}>
       <Text style={{fontSize:11,fontWeight:'900',color:C.burgundy}}>ĐIỀN TÀI KHOẢN ADMIN</Text>
      </TouchableOpacity>
     </View>
     <View style={{backgroundColor:C.white,borderRadius:10,padding:11}}>
      <Text style={{fontWeight:'900',color:C.ink,fontSize:12}}>Khách hàng mẫu</Text>
      <Text selectable style={{color:C.muted,fontSize:12,marginTop:6}}>Email: user@lumie.store</Text>
      <Text selectable style={{color:C.muted,fontSize:12,marginTop:3}}>Mật khẩu: user123</Text>
      <TouchableOpacity accessibilityRole="button" onPress={()=>{setEmail('user@lumie.store');setPassword('user123');}} style={{alignSelf:'flex-start',marginTop:9,paddingVertical:7,paddingHorizontal:10,backgroundColor:C.roseLight,borderRadius:8}}>
       <Text style={{fontSize:11,fontWeight:'900',color:C.burgundy}}>ĐIỀN TÀI KHOẢN KHÁCH</Text>
      </TouchableOpacity>
     </View>
     <Text style={{color:C.muted,fontSize:11}}>Nhấn giữ email hoặc mật khẩu để sao chép, hoặc chọn nút điền nhanh.</Text>
    </View>}
   </View>
  </ScrollView>
 </KeyboardAvoidingView>;
}
