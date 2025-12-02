<template>
  <div class="add" @mousedown.stop>
    <div class="title">
      <span>添加语音</span>
    </div>
    <el-form :model="form" label-width="auto" style="flex:1;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="id">
            <CustomInput v-model="form.id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="uuid">
            <CustomInput v-model="form.uuid" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="form.createTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择创建时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更新时间">
            <el-date-picker
              v-model="form.updateTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择更新时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="bottom">
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="emit('close')">取消</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['close'])
import moment from 'moment'
import { ref, reactive } from 'vue'
import CustomInput from '~/myComponents/common/CustomInput.vue'
const form = reactive({
  id: null,
  uuid: null,
  createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  console.log('submit!')
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
  .bottom{
    display: flex;
    justify-content: end;
  }
}
</style>