<template>
  <div class="sideButtons">
    <div class="sideButtonGroup">
      <div class="sideButton">地图</div>
      <div class="list">
        <div class="sideButton">白板地图</div>
        <div class="sideButton">矢量地图</div>
        <div class="sideButton">影像地图</div>
        <div class="sideButton">地形地图</div>
      </div>
    </div>
    <div class="sideButtonGroup">
      <div class="sideButton">操作</div>
      <div class="list"></div>
    </div>
    <div class="sideButtonGroup">
      <div class="sideButton">标绘</div>
      <div class="list"></div>
    </div>
    <div class="sideButtonGroup">
      <div class="sideButton">工具</div>
      <div class="list"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.sideButtons {
  display: flex;
  flex-direction: column;
  width: 100px;
  height: 100%;
  font-size:16px;
  user-select: none;
  .sideButtonGroup{
    margin-bottom:5px;
    display: flex;
    flex-direction: column;
    padding:5px 10px;
    justify-content: center;
    margin-right: 10px;
    border-radius: 4px;
    border:1px solid gray;
    background-color: #273347;
    .sideButton{
      cursor:pointer;
      width:100%;
      height:100%;
      display: flex;
      justify-content: center;
      color:lightblue;
    }
    .list{
      display: flex;
      flex-direction: column;
      &:has(*){
        border-top:1px solid gray;
      }
    }
  }
}
</style>