import React,{useEffect,useState} from 'react';
import { View,Text,Image,ScrollView } from 'react-native';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import type { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/UI';
import { C } from '@/constants/colors';
import { money } from '@/database/db';
import { useFeedback } from '@/context/FeedbackContext';

export default function ProductDetail(){
 const {id}=useLocalSearchParams<{id:string}>(),db=useSQLiteContext(),router=useRouter(),{addToCart,cart}=useApp(),{showFeedback}=useFeedback();const [p,setP]=useState<Product|null>(null),[error,setError]=useState(false);
 useEffect(()=>{let active=true;setP(null);setError(false);const productId=Number(id);if(!Number.isInteger(productId)||productId<=0){setError(true);return()=>{active=false;};}db.getFirstAsync<Product>('SELECT p.*,c.name as category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.id=?',productId).then(x=>{if(active)setP(x||null);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[db,id]);
 if(error)return <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:24,backgroundColor:C.cream}}><Text style={{fontSize:18,fontWeight:'900',color:C.ink,marginBottom:12}}>Không tìm thấy sản phẩm</Text><Button title="VỀ TRANG CHỦ" onPress={()=>router.replace('/')}/></View>;
 if(!p)return <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:C.cream}}><Text>Đang tải sản phẩm...</Text></View>;
 const quantity=cart.find(item=>item.id===p.id)?.quantity||0;
 return <ScrollView style={{flex:1,backgroundColor:C.cream}} contentContainerStyle={{paddingBottom:30}}>
  <Text onPress={()=>router.back()} style={{padding:20,color:C.burgundy,fontWeight:'900'}}>‹  QUAY LẠI</Text>
  <Image source={{uri:p.image}} style={{width:'100%',height:360,backgroundColor:C.roseLight}} resizeMode="cover"/>
  <View style={{padding:22}}>
   <Text style={{color:C.rose,fontWeight:'900',fontSize:11,letterSpacing:1.5}}>{p.category_name?.toUpperCase()}</Text>
   <Text style={{fontSize:27,fontWeight:'900',color:C.ink,marginTop:8}}>{p.name}</Text>
   <Text style={{fontSize:21,color:C.burgundy,fontWeight:'900',marginTop:12}}>{money(p.price)}</Text>
   <Text style={{fontSize:14,color:C.muted,lineHeight:23,marginTop:18}}>{p.description}</Text>
   <Text style={{marginTop:18,color:p.stock>0?C.green:C.red,fontWeight:'800'}}>Còn {p.stock} sản phẩm</Text>
   <View style={{marginTop:24}}><Button title={p.stock<=0?'TẠM HẾT HÀNG':quantity>=p.stock?'ĐÃ ĐẠT SỐ LƯỢNG TỐI ĐA':quantity>0?`THÊM VÀO GIỎ (${quantity} ĐANG CÓ)`:'THÊM VÀO GIỎ HÀNG'} disabled={p.stock<=0||quantity>=p.stock} onPress={()=>{addToCart(p);showFeedback('Đã thêm vào giỏ',`${p.name} đã được thêm vào giỏ hàng.`,'success');}}/></View>
   <View style={{marginTop:10}}><Button title="XEM GIỎ HÀNG" variant="outline" onPress={()=>router.push('/cart')}/></View>
  </View>
 </ScrollView>;
}
