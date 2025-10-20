<template>
  <div class="one-click-control">
    <div>一键控制</div>
    <div class="body">
      <el-button type="primary" size="small" style="width: 45%;">停止</el-button>
      <el-button type="primary" size="small" style="width: 45%;">复位</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.one-click-control {
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100%;
  .body{
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    ::v-deep(.el-button + .el-button){
      margin-left: 0px;
    }
  }
}
</style>
