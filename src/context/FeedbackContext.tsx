import React,{createContext,useCallback,useContext,useMemo,useRef,useState} from 'react';
import { Modal,Text,TouchableOpacity,View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';

type FeedbackTone='success'|'error'|'info'|'warning';
type FeedbackState={
 title:string;
 message:string;
 tone:FeedbackTone;
 confirmLabel?:string;
 confirm?:boolean;
};
type FeedbackApi={
 showFeedback:(title:string,message:string,tone?:FeedbackTone)=>void;
 confirmFeedback:(title:string,message:string,confirmLabel?:string)=>Promise<boolean>;
};

const Context=createContext<FeedbackApi|null>(null);

const appearance:Record<FeedbackTone,{icon:keyof typeof Ionicons.glyphMap;color:string;background:string}>={
 success:{icon:'checkmark-circle',color:C.green,background:C.greenLight},
 error:{icon:'close-circle',color:C.red,background:C.redLight},
 info:{icon:'information-circle',color:C.burgundy,background:C.roseLight},
 warning:{icon:'alert-circle',color:C.amber,background:C.amberLight}
};

export function FeedbackProvider({children}:{children:React.ReactNode}){
 const [feedback,setFeedback]=useState<FeedbackState|null>(null);
 const resolveRef=useRef<((confirmed:boolean)=>void)|null>(null);
 const close=useCallback((confirmed=false)=>{
  const resolve=resolveRef.current;
  resolveRef.current=null;
  setFeedback(null);
  resolve?.(confirmed);
 },[]);
 const showFeedback=useCallback((title:string,message:string,tone:FeedbackTone='info')=>{
  resolveRef.current?.(false);
  resolveRef.current=null;
  setFeedback({title,message,tone});
 },[]);
 const confirmFeedback=useCallback((title:string,message:string,confirmLabel='Xác nhận')=>new Promise<boolean>(resolve=>{
  resolveRef.current?.(false);
  resolveRef.current=resolve;
  setFeedback({title,message,tone:'warning',confirmLabel,confirm:true});
 }),[]);
 const value=useMemo(()=>({showFeedback,confirmFeedback}),[showFeedback,confirmFeedback]);
 const style=feedback?appearance[feedback.tone]:appearance.info;
 return <Context.Provider value={value}>
  {children}
  <Modal visible={feedback!==null} transparent animationType="fade" onRequestClose={()=>close(false)} statusBarTranslucent>
   <View style={{flex:1,backgroundColor:'#1C171780',justifyContent:'center',padding:24}}>
    {feedback&&<View accessibilityRole="alert" style={{width:'100%',maxWidth:420,alignSelf:'center',backgroundColor:C.surface,borderRadius:24,padding:24,shadowColor:'#000',shadowOpacity:.16,shadowRadius:24,elevation:12}}>
     <View style={{width:56,height:56,borderRadius:28,backgroundColor:style.background,alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:16}}>
      <Ionicons name={style.icon} size={32} color={style.color}/>
     </View>
     <Text style={{fontSize:20,fontWeight:'900',color:C.ink,textAlign:'center'}}>{feedback.title}</Text>
     <Text style={{fontSize:14,color:C.muted,lineHeight:21,textAlign:'center',marginTop:10}}>{feedback.message}</Text>
     <View style={{flexDirection:'row',gap:10,marginTop:22}}>
      {feedback.confirm&&<TouchableOpacity accessibilityRole="button" onPress={()=>close(false)} style={{flex:1,borderRadius:12,paddingVertical:13,alignItems:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.line}}>
       <Text style={{color:C.ink,fontWeight:'800'}}>Để sau</Text>
      </TouchableOpacity>}
      <TouchableOpacity accessibilityRole="button" onPress={()=>close(true)} style={{flex:1,borderRadius:12,paddingVertical:13,alignItems:'center',backgroundColor:feedback.confirm?C.red:C.burgundy}}>
       <Text style={{color:C.white,fontWeight:'900'}}>{feedback.confirmLabel||'Đã hiểu'}</Text>
      </TouchableOpacity>
     </View>
    </View>}
   </View>
  </Modal>
 </Context.Provider>;
}

export function useFeedback(){
 const value=useContext(Context);
 if(!value)throw new Error('useFeedback must be used inside FeedbackProvider');
 return value;
}
