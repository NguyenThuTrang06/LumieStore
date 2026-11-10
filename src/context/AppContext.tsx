import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator,Text,View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type { User, CartItem, Product } from '@/types';
import { useFeedback } from '@/context/FeedbackContext';

type AppCtx = {
  user: User | null; cart: CartItem[]; loading: boolean;
  login: (email:string,password:string)=>Promise<void>;
  signup: (name:string,email:string,password:string)=>Promise<void>;
  logout: ()=>Promise<void>;
  addToCart: (p:Product)=>void; changeQty:(id:number,delta:number)=>void;
  removeFromCart:(id:number)=>void; clearCart:()=>void;
  refreshUser:()=>Promise<void>;
};
const Context = createContext<AppCtx | null>(null);
export function AppProvider({children}:{children:React.ReactNode}) {
  const db = useSQLiteContext();
  const {showFeedback}=useFeedback();
  const [user,setUser] = useState<User|null>(null);
  const [cart,setCart] = useState<CartItem[]>([]);
  const [loading,setLoading] = useState(true);
  const [hydrated,setHydrated] = useState(false);

  useEffect(()=>{
    let active=true;
    const restore=async()=>{
      try{
        const session=await db.getFirstAsync<{value:string}>('SELECT value FROM app_state WHERE key=?','user_id');
        const userId=session?Number(session.value):0;
        const restoredUser=userId>0?await db.getFirstAsync<User>('SELECT id,name,email,phone,address,role FROM users WHERE id=?',userId):null;
        if(session&&!restoredUser)await db.runAsync('DELETE FROM app_state WHERE key=?','user_id');
        const restoredCart=await db.getAllAsync<CartItem>('SELECT p.*,c.name AS category_name,ci.quantity FROM cart_items ci JOIN products p ON p.id=ci.product_id JOIN categories c ON c.id=p.category_id');
        if(active){setUser(restoredUser);setCart(restoredCart);}
      }catch(error){
        showFeedback('Không thể khôi phục dữ liệu',error instanceof Error?error.message:'Đã xảy ra lỗi khi đọc dữ liệu đã lưu.','error');
      }finally{
        if(active){setHydrated(true);setLoading(false);}
      }
    };
    void restore();
    return()=>{active=false;};
  },[db,showFeedback]);

  useEffect(()=>{
    if(!hydrated)return;
    db.withTransactionAsync(async()=>{
      await db.runAsync('DELETE FROM cart_items');
      for(const item of cart)await db.runAsync('INSERT INTO cart_items(product_id,quantity) VALUES(?,?)',item.id,item.quantity);
    }).catch(error=>showFeedback('Không thể lưu giỏ hàng',error instanceof Error?error.message:'Đã xảy ra lỗi khi lưu giỏ hàng.','error'));
  },[cart,db,hydrated,showFeedback]);

  const refreshUser = async()=> {
    if (!user) return;
    const row = await db.getFirstAsync<User>('SELECT id,name,email,phone,address,role FROM users WHERE id=?',user.id);
    if(row) setUser(row);
  };
  const login = async(email:string,password:string)=>{
    const row = await db.getFirstAsync<User>(
      'SELECT id,name,email,phone,address,role FROM users WHERE lower(email)=lower(?) AND password=?',
      email.trim(),password
    );
    if(!row) throw new Error('Email hoặc mật khẩu chưa chính xác.');
    await db.runAsync('INSERT OR REPLACE INTO app_state(key,value) VALUES(?,?)','user_id',String(row.id));
    setUser(row);
  };
  const signup = async(name:string,email:string,password:string)=>{
    const exists = await db.getFirstAsync<{id:number}>('SELECT id FROM users WHERE lower(email)=lower(?)',email.trim());
    if(exists) throw new Error('Email này đã được đăng ký.');
    const result = await db.runAsync('INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)',name.trim(),email.trim(),password,'user');
    await db.runAsync('INSERT OR REPLACE INTO app_state(key,value) VALUES(?,?)','user_id',String(result.lastInsertRowId));
    setUser({id:result.lastInsertRowId,name:name.trim(),email:email.trim(),role:'user'});
  };
  const logout = async()=>{await db.runAsync('DELETE FROM app_state WHERE key=?','user_id');setUser(null);setCart([]);};
  const addToCart = (p:Product)=>setCart(old=>{
    if(p.stock<=0)return old;
    const found=old.find(i=>i.id===p.id);
    if(found&&found.quantity>=p.stock)return old;
    return found ? old.map(i=>i.id===p.id?{...i,quantity:i.quantity+1,stock:p.stock,price:p.price}:i) : [...old,{...p,quantity:1}];
  });
  const changeQty=(id:number,delta:number)=>setCart(old=>old.map(i=>i.id===id&&i.stock>0?{...i,quantity:Math.min(i.stock,Math.max(1,i.quantity+delta))}:i));
  const removeFromCart=(id:number)=>setCart(old=>old.filter(i=>i.id!==id));
  const clearCart=()=>setCart([]);
  const value=useMemo(()=>({user,cart,loading,login,signup,logout,addToCart,changeQty,removeFromCart,clearCart,refreshUser}),[user,cart,loading]);
  return <Context.Provider value={value}>{loading?<View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#FAF7F2'}}><ActivityIndicator color="#762D3F"/><Text style={{marginTop:12,color:'#8D8587'}}>Đang mở LUMIÉ STORE...</Text></View>:children}</Context.Provider>;
}
export function useApp(){const v=useContext(Context);if(!v)throw new Error('useApp must be used inside AppProvider');return v;}
