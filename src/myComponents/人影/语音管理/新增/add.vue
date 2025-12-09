<template>
  <div class="add" @mousedown.stop>
    <div class="title">
      <span>{{ form.title }}</span>
    </div>
    <el-form :model="form" label-width="auto" style="flex:1;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="自增主键">
            <CustomInput v-model="form.id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="唯一标识">
            <CustomInput v-model="form.uuid" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="创建时间">
            <CustomInput v-model="form.createTime" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间">
            <CustomInput v-model="form.updateTime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="语音文件地址">
            <CustomInput v-model="form.path" type="file" v-model:uploadProgress="form.uploadProgress"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="form.path">
          <el-form-item label="播放器">
            <audio :src="'/backend/upload'+form.path" controls preload="metadata"></audio>
          </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="语音发起方">
            <CustomInput v-model="form.caller" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="语音接收方">
            <CustomInput v-model="form.callee" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="bottom">
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['close'])
import { ref, reactive, watch, inject } from 'vue'
import CustomInput from '~/myComponents/common/CustomInput.vue'
import {增加语音记录} from '~/myComponents/人影/语音管理/api'
const form = inject('form',reactive({
  title:'添加记录',
  id: null,
  uuid: null,
  createTime: null,
  updateTime: null,
  path: null,
  caller: '511011003',//内江-团结水库
  callee: '510100000',//四川省-成都市
  uploadProgress:0,
}))
const onSubmit = () => {

    if(form.title=='添加记录'){
      const data:any = {id:form.id,uuid:form.uuid,datetime_create:form.createTime,datetime_update:form.updateTime,path:form.path,caller:form.caller,callee:form.callee}
      if(data.id == null){
        delete data.id
      }
      if(data.uuid == null){
        delete data.uuid
      }
      if(data.datetime_create == null){
        delete data.datetime_create
      }
      if(data.datetime_update == null){
        delete data.datetime_update
      }
      增加语音记录([data]).then(()=>{
        console.log('保存成功')
        emit('close')
      }).catch((err)=>{
        console.error('保存失败',err)
        axios.delete("/backend/upload", {
          data: [form.path]
        }).then(response => {
          console.log('删除成功',response.data)
        }).catch(error => {
          console.error('删除失败',error)
        });
      })
    }else{
      const data = {id:form.id,uuid:form.uuid,datetime_create:form.createTime,datetime_update:form.updateTime,path:form.path,caller:form.caller,callee:form.callee}
      增加语音记录([wrapKeys(data,(key)=>['id','uuid'].includes(key))]).then(()=>{
        console.log('保存成功')
        emit('close')
      }).catch((err)=>{
        console.error('保存失败',err)
        axios.delete("/backend/upload", {
          data: [form.path]
        }).then(response => {
          console.log('删除成功',response.data)
        }).catch(error => {
          console.error('删除失败',error)
        });
      })
    }

}
import axios from 'axios'
import { wrapKeys } from '~/tools'
const close = () => {
  emit('close')
  if(form.path){
    form.uploadProgress = 0
    if(form.title=='添加记录'){
      axios.delete("/backend/upload", {
        data: [form.path]
      }).then(response => {
        console.log('删除成功',response.data)
        form.path = null
      }).catch(error => {
        console.error('删除失败',error)
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.add{
  width: 100%;
  height: 100%;
  padding:20px;
  box-sizing: border-box;
  cursor:default;
  display: flex;
  flex-direction: column;
  .title{
    font-size: 20px;
    font-weight: bold;
  }
  ::v-deep(.el-form-item__label-wrap){
    align-items: center;
  }
  .bottom{
    display: flex;
    justify-content: end;
  }
}
</style>