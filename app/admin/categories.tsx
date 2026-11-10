import React,{useCallback,useState} from 'react';
import { View,Text,ScrollView,Modal } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect,useRouter } from 'expo-router';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Button,Field } from '@/components/UI';
import type { Category } from '@/types';
import { useFeedback } from '@/context/FeedbackContext';

export default function Categories(){
 const db=useSQLiteContext(),router=useRouter(),{user}=useApp(),{showFeedback,confirmFeedback}=useFeedback();const [rows,setRows]=useState<Category[]>([]),[visible,setVisible]=useState(false),[editing,setEditing]=useState<number|null>(null),[name,setName]=useState(''),[description,setDescription]=useState('');
 const load=async()=>setRows(await db.getAllAsync<Category>('SELECT * FROM categories ORDER BY id DESC'));
 useFocusEffect(useCallback(()=>{load().catch(error=>showFeedback('Không thể tải danh mục',error instanceof Error?error.message:'Đã xảy ra lỗi.','error'));},[db,showFeedback]));
 const open=(c?:Category)=>{setEditing(c?.id||null);setName(c?.name||'');setDescription(c?.description||'');setVisible(true);};
 const save=async()=>{if(!name.trim()){showFeedback('Thiếu tên danh mục','Vui lòng nhập tên danh mục.','warning');return;}try{const wasEditing=editing!==null;if(editing)await db.runAsync('UPDATE categories SET name=?,description=? WHERE id=?',name.trim(),description.trim(),editing);else await db.runAsync('INSERT INTO categories(name,description) VALUES(?,?)',name.trim(),description.trim());setVisible(false);await load();showFeedback(wasEditing?'Đã cập nhật danh mục':'Đã thêm danh mục',`Danh mục “${name.trim()}” đã được ${wasEditing?'cập nhật':'tạo'}.`,'success');}catch(error){showFeedback('Không thể lưu danh mục',error instanceof Error?error.message:'Tên danh mục có thể đã tồn tại.','error');}};
 const del=async(c:Category)=>{if(!await confirmFeedback('Xóa danh mục',`Xóa “${c.name}”? Chỉ xóa được danh mục chưa có sản phẩm.`,'Xóa danh mục'))return;try{await db.runAsync('DELETE FROM categories WHERE id=?',c.id);await load();showFeedback('Đã xóa danh mục',`Danh mục “${c.name}” đã được xóa.`,'success');}catch(error){showFeedback('Không thể xóa',error instanceof Error?error.message:'Danh mục có thể đang chứa sản phẩm. Hãy chuyển hoặc xóa sản phẩm trước.','error');}};
 if(user?.role!=='admin')return <Text style={{padding:24}}>Bạn không có quyền truy cập.</Text>;
 return <ScrollView contentContainerStyle={{padding:20,backgroundColor:C.cream,flexGrow:1}}><Text onPress={()=>router.back()} style={{color:C.burgundy,fontWeight:'900',marginBottom:20}}>‹  ADMIN</Text><Text style={{fontSize:25,fontWeight:'900',color:C.ink,marginBottom:16}}>Quản lý danh mục</Text><Button title="+ THÊM DANH MỤC" onPress={()=>open()}/>
 {rows.map(c=><View key={c.id} style={{backgroundColor:C.white,padding:15,borderRadius:14,marginTop:12}}><Text style={{fontWeight:'900',fontSize:15,color:C.ink}}>{c.name}</Text><Text style={{color:C.muted,fontSize:12,marginTop:5}}>{c.description}</Text><View style={{flexDirection:'row',gap:8,marginTop:12}}><View style={{flex:1}}><Button title="Sửa" variant="outline" onPress={()=>open(c)}/></View><View style={{flex:1}}><Button title="Xóa" variant="danger" onPress={()=>del(c)}/></View></View><Text onPress={()=>router.push({pathname:'/admin/products',params:{categoryId:String(c.id)}})} style={{color:C.burgundy,fontWeight:'900',marginTop:13}}>+ Thêm sản phẩm cho danh mục này</Text></View>)}
 <Modal visible={visible} transparent animationType="slide" onRequestClose={()=>setVisible(false)}><View style={{flex:1,backgroundColor:'#0007',justifyContent:'flex-end'}}><View style={{backgroundColor:C.cream,padding:22,borderTopLeftRadius:22,borderTopRightRadius:22}}><Text style={{fontSize:21,fontWeight:'900',marginBottom:18,color:C.ink}}>{editing?'Cập nhật danh mục':'Thêm danh mục'}</Text><Field label="Tên danh mục" value={name} onChangeText={setName}/><Field label="Mô tả" value={description} onChangeText={setDescription} multiline/><Button title="LƯU DANH MỤC" onPress={save}/><View style={{marginTop:8}}><Button title="ĐÓNG" variant="outline" onPress={()=>setVisible(false)}/></View></View></View></Modal>
 </ScrollView>;
}
