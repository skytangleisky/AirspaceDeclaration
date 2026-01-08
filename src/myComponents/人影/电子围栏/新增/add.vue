<template>
  <div class="editEnclosure" @mousedown.stop>
    <el-form size="small" class="left" :model="form" label-width="100px">
      <div class="group">
        <el-form-item label="空域ID：" prop="name" :rules="[{ required: true, message: '请输入空域ID', trigger: 'blur' }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="空域名称：">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="形状">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="底高">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="顶高">
          <el-input v-model="form.name" />
        </el-form-item>
        <fieldset style="margin-bottom:20px;">
          <legend>时间结构</legend>
            <el-form-item label="类型">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="开始时间">
              <el-input v-model="form.unit" />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-input v-model="form.unit" />
            </el-form-item>
        </fieldset>
        <el-form-item label="最大飞行速度">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="发布单位">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="特殊规则">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="form.name" />
        </el-form-item>
      </div>
    </el-form>
    <fieldset class="right">
      <legend>多边形几何信息</legend>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const form = ref({
    name: null,
    unit: '',
    timeout: 0
  })
</script>
<style lang="scss" scoped>
  .editEnclosure{
    cursor:default;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    ::v-deep(.el-form-item--small){
      margin-bottom:16px;
    }
    .left{
      flex:1;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      .group{
        width: 100%;
        height: fit-content;
      }
    }
    .right{
      flex:1;
      box-sizing: border-box;
      height: 100%;
      box-sizing: border-box;
    }
  }
</style>