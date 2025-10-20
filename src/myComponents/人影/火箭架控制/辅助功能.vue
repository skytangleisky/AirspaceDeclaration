<template>
  <div class="accessibility">
    <div>辅助功能</div>
    <div class="body">
      <el-button type="primary" size="small">获取位置信息</el-button>
      <el-button type="primary" size="small">获取姿态信息</el-button>
      <el-button type="primary" size="small">推送作业信息</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.accessibility {
  display: flex;
  flex-direction: column;
  height: 100%;
  .body{
    width: 100%;
    padding:10px;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    ::v-deep(.el-button + .el-button){
      margin-left: 0px;
    }
  }
}
</style>