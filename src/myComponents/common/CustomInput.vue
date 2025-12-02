<template>
  <div v-if="type=='image'" class="image">
    <el-icon v-if="modelValue==null" v-html="pasteSvg" class="paste" @click="paste"></el-icon>
    <div v-else style="width: 200px;height: 103px;outline:1px solid white;position: relative;">
      <img :src="getSrc(modelValue)" style="width: 100%;height: 100%;"/>
      <el-icon v-html="removeSvg" style="position: absolute;top:50%;transform:translateY(-50%);left:100%;margin:2px;padding:2px;background:#2b2b2b;border-radius: 50%;" @click="removeImage"></el-icon>
    </div>
  </div>
  <div v-else style="width: 100%;">
    <el-button v-if="modelValue==null" @click="blank" type="default">NULL</el-button>
    <div v-else class="container">
      <el-input ref="inputRef" v-model="modelValue" :placeholder="placeholder"/>
      <el-icon v-html="noneSvg" class="NULL" @click="none" tabindex="-1"></el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import axios from 'axios'
import removeSvg from './remove.svg?raw'
import noneSvg from './none.svg?raw'
import pasteSvg from './paste.svg?raw'
import {nextTick, ref, computed, inject} from 'vue'
import { wrapKeys } from '~/tools'
const getSrc = computed(()=>(src:any)=>{
  if(src==null)return ''
  if(src.startsWith('data:image/')){
    return src
  }else{
    return '/backend/upload'+src
  }
})
// const base64 = computed(()=>(obj:any)=>{
//   if(obj==null)return ''
//   const bytes = new Uint8Array(obj.data)
//   const blob = new Blob([bytes], { type: 'image/png' });
//   objectURL&&URL.revokeObjectURL(objectURL)
//   objectURL = URL.createObjectURL(blob);
//   return objectURL;
// })
const inputRef = ref();
const modelValue = defineModel<number|string|null>('modelValue', {
  default: null,
})
const placeholder = defineModel<string|null>('placeholder', {
  default: null,
})
const type = defineModel<string|null>('type', {
  default: null,
})
const emit = defineEmits(['update:modelValue'])
const blank=()=>{
  emit('update:modelValue','')
  nextTick(()=>{
    inputRef.value.focus()
  })
}
const none = () => {
  emit('update:modelValue',null)
};
const paste = () => {
  if (navigator.clipboard) {
    navigator.clipboard.read().then(async(clipboardItems:any) => {
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type)
            let url = URL.createObjectURL(blob)
            const img = new Image()
            img.onload = () => {
              URL.revokeObjectURL(url)
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
              canvas.width = 220
              canvas.height = 103
              ctx.drawImage(img, 0, 0)
              const dataURL = canvas.toDataURL(type)
              emit('update:modelValue',dataURL)
            }
            img.onerror = () => {
              console.error("读取剪贴板图片失败");
            };
            img.src = url
            // const reader = new FileReader();
            // reader.readAsDataURL(blob);
            // reader.onload = () => {
            //   emit('update:modelValue',reader.result)
            // }
            // reader.onerror = () => {
            //   console.error("读取剪贴板图片失败");
            // };
            return;
          }
        }
      }
    });
  }
};
// import { saveProducts } from '../api/products'
// import { Product } from '../api/type'
const timestamp = inject('timestamp',ref(Date.now()))
// const form = inject<any>('form');
const removeImage = () => {
  if(modelValue.value==null)return
  if((modelValue.value as string).startsWith('data:image/')){
    emit('update:modelValue',null)
    return
  }else{
    axios.delete("/backend/upload", {
      data: [modelValue.value]
    }).then(response => {
      console.log('删除成功',response.data)
      const product:{[key:string]:any} = {}
      // Object.assign(product,form.data,{poster:null})
      // saveProducts([wrapKeys(product,(key)=>key=='uuid') as Product]).then(()=>{
      //   console.log('保存成功')
      //   emit('update:modelValue',null)
      //   timestamp.value = Date.now()
      // }).catch((err)=>{
      //   console.error('保存失败',err)
      // })
    }).catch(error => {
      console.error('删除失败',error)
    });
  }
}
</script>
<style>
.container input.el-input__inner{
  box-sizing: border-box;
}
</style>
<style lang="less" scoped>
.image{
  display: flex;
  align-items: center;
  .paste{
    font-size: 20px;
  }
}
.container{
  &:focus-within .NULL{
    display: flex;
  }
  .NULL{
    display:none;
    position: absolute;
    left:100%;
    bottom:0;
    width:14px;
    font-size: 14px;
    top:calc(50% + 1px);
    transform: translateY(-50%);
    align-items: center;
    justify-content: center;
  }
}
</style>
