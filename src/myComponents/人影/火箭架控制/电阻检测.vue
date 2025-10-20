<template>
  <div class="resistanceDetection">
    <div>电阻检测</div>
    <div class="body">
      <div class="item">
        <div class="channel"><div>通道1</div><div class="status"></div></div>电阻值：开路
      </div>
      <div class="item">
        <div class="channel"><div>通道2</div><div class="status"></div></div>电阻值：开路
      </div>
      <div class="item">
        <div class="channel"><div>通道3</div><div class="status"></div></div>电阻值：开路
      </div>
      <div class="item">
        <div class="channel"><div>通道4</div><div class="status"></div></div>电阻值：开路
      </div>
      <div class="item">
        <div class="channel"><div>通道5</div><div class="status"></div></div>电阻值：开路
      </div>
      <div class="item">
        <div class="channel"><div>通道6</div><div class="status"></div></div>电阻值：开路
      </div>
    </div>
    <div class="bottom"><el-button type="primary" class="check" size="small">检测</el-button></div>
  </div>
</template>
<style lang="scss" scoped>
.resistanceDetection{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .body{
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .item{
      width:60%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .channel{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .status{
        width:10px;
        height:10px;
        border-radius:50%;
        margin-left:10px;
        background:gray;
      }
    }
  }
  .bottom{
    width:100%;
    display: flex;
    justify-content: flex-end;
    .check{
      width:100px;
    }
  }
}

</style>