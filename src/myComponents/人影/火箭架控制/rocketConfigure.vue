<template>
  <div class="rocketConfigure">
    <div class="left">
      <div class="left-top">
        <div class="left-top-left border"><position-info></position-info></div>
        <div class="left-top-right">
          <div class="left-top-right-top border"><posture-info></posture-info></div>
          <div class="left-top-right-bottom border"><posture-setting></posture-setting></div>
        </div>
      </div>
      <div class="left-middle">
        <div class="left-middle-left border"><accessibility></accessibility></div>
        <div class="left-middle-right border"><preset-info></preset-info></div>
      </div>
      <div class="left-bottom border"><one-click-control></one-click-control></div>
    </div>
    <div class="right">
      <div class="top border"><system-status></system-status></div>
      <div class="bottom border"><resistance-detection></resistance-detection></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import positionInfo from '~/myComponents/人影/火箭架控制/位置信息.vue'
  import postureInfo from '~/myComponents/人影/火箭架控制/姿态信息.vue'
  import postureSetting from '~/myComponents/人影/火箭架控制/姿态设置.vue'
  import accessibility from '~/myComponents/人影/火箭架控制/辅助功能.vue'
  import presetInfo from '~/myComponents/人影/火箭架控制/预设信息.vue'
  import oneClickControl from '~/myComponents/人影/火箭架控制/一键控制.vue'
  import systemStatus from '~/myComponents/人影/火箭架控制/系统状态.vue'
  import resistanceDetection from '~/myComponents/人影/火箭架控制/电阻检测.vue'
</script>
<style lang="scss" scoped>
.rocketConfigure{
  font-size:12px;
  font-weight: 100;
  box-sizing: border-box;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .border{
    border-radius: 4px;
    border:1px solid gray;
    box-sizing: border-box;
  }
  .left{
    width: calc(50% - 2px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .left-top{
      height: calc(30% - 4px);
      margin-bottom: 0;
      display: flex;
      justify-content: space-between;
      .left-top-left{
        width: calc(50% - 2px);
      }
      .left-top-right{
        width: calc(50% - 2px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .left-top-right-top{
          height: calc(50% - 2px);
        }
        .left-top-right-bottom{
          height: calc(50% - 2px);
        }
      }
    }
    .left-middle{
      height: calc(55% - 4px);
      display: flex;
      justify-content: space-between;
      .left-middle-left{
        height: 100%;
        width: calc(30% - 2px);
      }
      .left-middle-right{
        height: 100%;
        width: calc(70% - 2px);
      }
    }
    .left-bottom{
      height: 15%;
    }
  }
  .right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(50% - 2px);
    .top{
      height: 10%;
      margin-bottom: 0;
    }
    .bottom{
      height: calc(90% - 4px);
    }
  }
}

</style>