<template>
  <div class="system-status">
    <div>系统状态</div>
    <div class="body">
      <div class="item">
        <div>通信</div>
        <div class="status"></div>
      </div>
      <div class="item">
        <div>罗盘</div>
        <div class="status"></div>
      </div>
      <div class="item">
        <div>GPS</div>
        <div class="status"></div>
      </div>
      <div class="item">
        <div>蓄电池</div>
        <div class="status"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .system-status{
    display: flex;
    flex-direction: column;
    width: 100%;
    .body{
      width:100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      .item{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .status{
          margin-left:10px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #0f0;
        }
      }
    }
  }
</style>