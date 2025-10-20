<template>
  <div class="preset-info">
    <div>预设信息</div>
    <div class="body">
      <table>
        <thead>
          <tr>
            <th>预设编号</th>
            <th>预设名称</th>
            <th>预设俯仰角</th>
            <th>预设方位角</th>
          </tr>
        </thead>
        <tbody style="position: relative">
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <el-button type="primary" style="width: 50%;" size="small">添加</el-button>
      <el-button type="primary" style="width: 50%;" size="small">修改</el-button>
      <el-button type="primary" style="width: 50%;" size="small">删除</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .preset-info{
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .body{
      height: 100%;
    }
    .footer{
      padding:4px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
    }
  }
</style>