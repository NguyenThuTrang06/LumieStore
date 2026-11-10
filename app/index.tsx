import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect,useRouter } from 'expo-router';
import { useCallback } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { SectionTitle } from '@/components/UI';
import { C } from '@/constants/colors';
import { money } from '@/database/db';
import type { Product, Category } from '@/types';
import { useApp } from '@/context/AppContext';
import { useFeedback } from '@/context/FeedbackContext';

export default function Home(){
 const db=useSQLiteContext(), router=useRouter(), {addToCart,user,cart}=useApp(),{showFeedback}=useFeedback();
 const [products,setProducts]=useState<Product[]>([]),[categories,setCategories]=useState<Category[]>([]),[loading,setLoading]=useState(true);
 const [search,setSearch]=useState(''),[category,setCategory]=useState(0),[min,setMin]=useState(''),[max,setMax]=useState('');
 const load=async()=>{
  try{
   const cats=await db.getAllAsync<Category>('SELECT * FROM categories ORDER BY name');
   const ps=await db.getAllAsync<Product>('SELECT p.*,c.name as category_name FROM products p JOIN categories c ON c.id=p.category_id ORDER BY p.id DESC');
   setCategories(cats);setProducts(ps);
  }catch(error){showFeedback('Không thể tải cửa hàng',error instanceof Error?error.message:'Đã xảy ra lỗi khi tải dữ liệu.','error');}
  finally{setLoading(false);}
 };
 useFocusEffect(useCallback(()=>{setLoading(true);load();},[db]));
 const minValue=min.trim()?Number(min):null,maxValue=max.trim()?Number(max):null;
 const invalidPrice=!!((minValue!==null&&(!Number.isFinite(minValue)||minValue<0))||(maxValue!==null&&(!Number.isFinite(maxValue)||maxValue<0))||(minValue!==null&&maxValue!==null&&minValue>maxValue));
 const filtered=useMemo(()=>invalidPrice?[]:products.filter(p=>
  (category===0||p.category_id===category)&&
  (p.name.toLowerCase().includes(search.toLowerCase())||(p.category_name||'').toLowerCase().includes(search.toLowerCase()))&&
  (minValue===null||p.price>=minValue)&&(maxValue===null||p.price<=maxValue)
 ),[products,category,search,minValue,maxValue,invalidPrice]);
 return <View style={{flex:1,backgroundColor:C.cream}}>
  <Header/>
  <ScrollView contentContainerStyle={{paddingBottom:22}}>
   <View style={{marginHorizontal:18,marginTop:8,backgroundColor:C.burgundy,borderRadius:22,padding:22,overflow:'hidden'}}>
    <Text style={{color:'#F5DDE2',fontSize:11,fontWeight:'800',letterSpacing:2}}>THE NEW COLLECTION</Text>
    <Text style={{color:C.white,fontSize:27,fontWeight:'900',marginTop:9,lineHeight:33}}>Elegance is{'\n'}an attitude.</Text>
    <Text style={{color:'#F5E9E8',fontSize:12,marginTop:9,width:'75%',lineHeight:18}}>Khám phá những lựa chọn tinh tế dành riêng cho phong cách của bạn.</Text>
    <TouchableOpacity onPress={()=>{setCategory(0);setSearch('');}} style={{marginTop:17,backgroundColor:C.white,alignSelf:'flex-start',paddingHorizontal:17,paddingVertical:10,borderRadius:10}}>
     <Text style={{color:C.burgundy,fontWeight:'900',fontSize:12}}>KHÁM PHÁ NGAY  →</Text>
    </TouchableOpacity>
    <Text style={{position:'absolute',right:14,bottom:0,fontSize:90,color:'#FFFFFF18'}}>✧</Text>
   </View>
   <View style={{paddingHorizontal:18,marginTop:23}}>
    <Text style={{fontSize:11,color:C.rose,fontWeight:'900',letterSpacing:2}}>CURATED FOR YOU</Text>
    <Text style={{fontSize:24,color:C.ink,fontWeight:'900',marginTop:4}}>Tìm điều bạn yêu thích</Text>
    <TextInput value={search} onChangeText={setSearch} placeholder="Tìm theo tên hoặc danh mục..." placeholderTextColor={C.muted} style={{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:13,padding:13,marginTop:15,color:C.ink}}/>
    <View style={{flexDirection:'row',gap:8,marginTop:10}}>
     <TextInput value={min} onChangeText={setMin} keyboardType="numeric" placeholder="Giá từ (VND)" style={{flex:1,backgroundColor:C.white,borderRadius:10,padding:10,borderWidth:1,borderColor:C.line,fontSize:12}}/>
     <TextInput value={max} onChangeText={setMax} keyboardType="numeric" placeholder="Giá đến (VND)" style={{flex:1,backgroundColor:C.white,borderRadius:10,padding:10,borderWidth:1,borderColor:C.line,fontSize:12}}/>
    </View>
    {invalidPrice&&<Text style={{color:C.red,fontSize:12,marginTop:7}}>Khoảng giá không hợp lệ. Hãy kiểm tra lại mức giá từ/đến.</Text>}
   </View>
   <View style={{marginTop:23,paddingLeft:18}}>
    <SectionTitle title="Danh mục sản phẩm"/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight:18,gap:8}}>
     <TouchableOpacity onPress={()=>setCategory(0)} style={{paddingHorizontal:16,paddingVertical:10,borderRadius:20,backgroundColor:category===0?C.burgundy:C.white}}><Text style={{color:category===0?C.white:C.ink,fontWeight:'700',fontSize:12}}>Tất cả</Text></TouchableOpacity>
     {categories.map(c=><TouchableOpacity key={c.id} onPress={()=>setCategory(c.id)} style={{paddingHorizontal:16,paddingVertical:10,borderRadius:20,backgroundColor:category===c.id?C.burgundy:C.white}}><Text style={{color:category===c.id?C.white:C.ink,fontWeight:'700',fontSize:12}}>{c.name}</Text></TouchableOpacity>)}
    </ScrollView>
   </View>
   <View style={{paddingHorizontal:18,marginTop:24}}>
    <SectionTitle title="Sản phẩm dành cho bạn"/>
    {loading?<Text style={{textAlign:'center',color:C.muted,padding:25}}>Đang tải sản phẩm...</Text>:<View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
     {filtered.map(p=>{
      const quantity=cart.find(item=>item.id===p.id)?.quantity||0;
      const canAdd=p.stock>0&&quantity<p.stock;
      return <View key={p.id} style={{width:'48%',backgroundColor:C.white,borderRadius:16,overflow:'hidden',marginBottom:14}}>
       <TouchableOpacity accessibilityRole="button" onPress={()=>router.push(`/product/${p.id}` as any)}>
        <Image source={{uri:p.image}} style={{width:'100%',height:160,backgroundColor:C.roseLight}} resizeMode="cover"/>
        <View style={{paddingHorizontal:11,paddingTop:11}}>
         <Text style={{color:C.muted,fontSize:10}}>{p.category_name}</Text>
         <Text numberOfLines={1} style={{fontWeight:'800',color:C.ink,marginTop:4}}>{p.name}</Text>
         <Text style={{color:C.burgundy,fontWeight:'900',marginTop:6}}>{money(p.price)}</Text>
        </View>
       </TouchableOpacity>
       <TouchableOpacity disabled={!canAdd} onPress={()=>{if(!canAdd){showFeedback(p.stock<=0?'Tạm hết hàng':'Đã đủ số lượng','Số lượng trong giỏ đã đạt tồn kho hiện có.','warning');return;}addToCart(p);showFeedback('Đã thêm vào giỏ',`${p.name} đã được thêm vào giỏ hàng.`,'success');}} style={{margin:9,marginTop:6,backgroundColor:canAdd?C.roseLight:C.line,borderRadius:9,padding:9,alignItems:'center',opacity:canAdd?1:.7}}>
        <Text style={{color:canAdd?C.burgundy:C.muted,fontWeight:'800',fontSize:11}}>{p.stock<=0?'Tạm hết hàng':quantity>=p.stock?'Đã đủ số lượng':'+ Thêm vào giỏ'}</Text>
       </TouchableOpacity>
      </View>;
     })}
    </View>}
    {!loading&&invalidPrice&&<Text style={{textAlign:'center',color:C.muted,padding:25}}>Nhập khoảng giá hợp lệ để xem sản phẩm.</Text>}
    {!loading&&!invalidPrice&&filtered.length===0&&<Text style={{textAlign:'center',color:C.muted,padding:25}}>Không tìm thấy sản phẩm phù hợp.</Text>}
   </View>
   {user?.role==='admin'&&<TouchableOpacity onPress={()=>router.push('/admin')} style={{margin:18,padding:16,borderRadius:14,backgroundColor:C.burgundy}}><Text style={{color:C.white,fontWeight:'800',textAlign:'center'}}>MỞ TRANG QUẢN TRỊ ADMIN →</Text></TouchableOpacity>}
  </ScrollView>
  <BottomNav/>
 </View>;
}
