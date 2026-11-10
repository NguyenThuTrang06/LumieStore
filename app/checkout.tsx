import React,{useState} from 'react';
import { View,Text,ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useApp } from '@/context/AppContext';
import { Button,Empty,Field } from '@/components/UI';
import { C } from '@/constants/colors';
import { money } from '@/database/db';
import { useFeedback } from '@/context/FeedbackContext';

type CheckoutProduct={name:string;price:number;stock:number};

export default function Checkout(){
 const db=useSQLiteContext(),router=useRouter(),{user,cart,clearCart}=useApp(),{showFeedback}=useFeedback();
 const [address,setAddress]=useState(user?.address||''),[phone,setPhone]=useState(user?.phone||''),[busy,setBusy]=useState(false);
 const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
 const place=async()=>{
  if(busy)return;
  if(!user){router.replace({pathname:'/login',params:{returnTo:'/checkout'}});return;}
  if(!cart.length){showFeedback('Giỏ hàng trống','Hãy thêm sản phẩm trước khi thanh toán.','warning');return;}
  if(!address.trim()){showFeedback('Thiếu địa chỉ','Vui lòng nhập địa chỉ nhận hàng.','warning');return;}
  const phoneDigits=phone.replace(/\D/g,'');
  if(phoneDigits.length<8||phoneDigits.length>15){showFeedback('Số điện thoại chưa hợp lệ','Vui lòng nhập từ 8 đến 15 chữ số để đơn vị vận chuyển liên hệ.','warning');return;}
  let placedOrderId=0;
  try{
   setBusy(true);
   await db.withTransactionAsync(async()=>{
    const currentProducts:CheckoutProduct[]=[];
    let currentTotal=0;
    for(const item of cart){
     const product=await db.getFirstAsync<CheckoutProduct>('SELECT name,price,stock FROM products WHERE id=?',item.id);
     if(!product)throw new Error(`"${item.name}" không còn trong cửa hàng. Hãy xóa sản phẩm này khỏi giỏ hàng.`);
     if(product.stock<item.quantity)throw new Error(`"${product.name}" hiện chỉ còn ${product.stock} sản phẩm. Hãy cập nhật số lượng trong giỏ hàng.`);
     if(product.price!==item.price)throw new Error(`Giá "${product.name}" vừa thay đổi. Hãy quay lại giỏ hàng và kiểm tra lại đơn.`);
     currentProducts.push(product);
     currentTotal+=product.price*item.quantity;
    }
    const result=await db.runAsync('INSERT INTO orders(user_id,total,status,address) VALUES(?,?,?,?)',user.id,currentTotal,'Chờ xác nhận',address.trim());
    placedOrderId=result.lastInsertRowId;
    for(let index=0;index<cart.length;index++){
     const item=cart[index],product=currentProducts[index];
     const update=await db.runAsync('UPDATE products SET stock=stock-? WHERE id=? AND stock>=?',item.quantity,item.id,item.quantity);
     if(update.changes!==1)throw new Error(`Số lượng "${product.name}" vừa thay đổi. Vui lòng kiểm tra lại giỏ hàng.`);
     await db.runAsync('INSERT INTO order_items(order_id,product_id,product_name,price,quantity) VALUES(?,?,?,?,?)',result.lastInsertRowId,item.id,product.name,product.price,item.quantity);
    }
    await db.runAsync('UPDATE users SET address=?,phone=? WHERE id=?',address.trim(),phone.trim(),user.id);
   });
   clearCart();
   router.replace({pathname:'/order-success',params:{orderId:String(placedOrderId)}});
  }catch(error){
   showFeedback('Chưa thể đặt hàng',error instanceof Error?error.message:'Đã xảy ra lỗi, vui lòng thử lại.','error');
  }finally{setBusy(false);}
 };
 return <ScrollView contentContainerStyle={{padding:22,backgroundColor:C.cream,flexGrow:1}}>
  <Text onPress={()=>router.back()} style={{color:C.burgundy,fontWeight:'900',marginBottom:22}}>‹  QUAY LẠI GIỎ HÀNG</Text>
  <Text style={{fontSize:27,fontWeight:'900',color:C.ink,marginBottom:8}}>Thanh toán</Text>
  {!user?<><Empty title="Đăng nhập để thanh toán" subtitle="Giỏ hàng của bạn sẽ được giữ nguyên sau khi đăng nhập."/><View style={{marginTop:14}}><Button title="ĐĂNG NHẬP TIẾP TỤC" onPress={()=>router.replace({pathname:'/login',params:{returnTo:'/checkout'}})}/></View></>:!cart.length?<><Empty title="Giỏ hàng đang trống" subtitle="Thêm sản phẩm vào giỏ để bắt đầu đặt hàng."/><View style={{marginTop:14}}><Button title="TIẾP TỤC MUA SẮM" onPress={()=>router.replace('/')}/></View></>:<>
   <Text style={{color:C.muted,marginBottom:25}}>Thông tin giao hàng của bạn</Text>
   <Field label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Số điện thoại liên hệ"/>
   <Field label="Địa chỉ nhận hàng" value={address} onChangeText={setAddress} multiline placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"/>
   <View style={{backgroundColor:C.white,padding:18,borderRadius:15,marginTop:8,marginBottom:20}}>
    <Text style={{fontWeight:'900',fontSize:16,color:C.ink,marginBottom:12}}>Tóm tắt đơn hàng</Text>
    {cart.map(item=><View key={item.id} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}><Text style={{color:C.muted,flex:1}}>{item.name} × {item.quantity}</Text><Text style={{fontWeight:'700'}}>{money(item.price*item.quantity)}</Text></View>)}
    <View style={{height:1,backgroundColor:C.line,marginVertical:12}}/>
    <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontWeight:'900'}}>Tổng cộng</Text><Text style={{fontWeight:'900',color:C.burgundy,fontSize:18}}>{money(total)}</Text></View>
   </View>
   <Button title={busy?'ĐANG XỬ LÝ...':'XÁC NHẬN ĐẶT HÀNG'} onPress={place} disabled={busy}/>
  </>}
 </ScrollView>;
}
