<template>
  <div class="smokeBar module-box">
    <div class="module-top">
      <div class="module-title">烟条状态</div>
      <div class="module-title-decoration"></div>
    </div>
    <div class="module-bottom">
      <div class="group">
        <!-- 烟条状态数据 -->
        <div class="left">
          <template v-for="(item, index) in currentStove.barList" :key="index">
            <div class="bars-box">
              <div class="bars1">
                <template
                    v-for="(bar, bari) in item"
                    :key="bar.id"
                >
                  <div
                      v-if="bari < 3"
                      class="bar-item"
                      :class="`status-${bar.status}`"
                  >
                    {{ bar.id }}
                  </div>
                </template>
              </div>
              <div class="bars2">
                <template
                    v-for="(bar, bari) in item"
                    :key="bar.id"
                >
                  <div
                      v-if="bari >= 3"
                      class="bar-item"
                      :class="`status-${bar.status}`"
                  >
                    {{ bar.id }}
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <!-- 烟炉详细信息 -->
        <div class="right">
          <div class="info-item">
            <div class="item-label">站点名称：</div>
            <div class="item-value">{{ currentStove.strName }}</div>
          </div>
          <div class="info-item">
            <div class="item-label">联系电话：</div>
            <div class="item-value">
              {{ currentStove.strMacPhoneNum }}
            </div>
          </div>
          <div class="info-item">
            <div class="item-label">状态时间：</div>
            <div class="item-value">{{ currentStove.currentTime }}</div>
          </div>
          <div class="info-item">
            <div class="item-label">燃烧烟条：</div>
            <div class="item-value">{{ currentStove.burningCount }}</div>
          </div>
          <div class="info-item">
            <div class="item-label">已用烟条：</div>
            <div class="item-value">{{ currentStove.usedCount }}</div>
          </div>
          <div class="info-item">
            <div class="item-label">可用烟条：</div>
            <div class="item-value">{{ currentStove.availableCount }}</div>
          </div>
          <div class="info-item">
            <div class="item-label">点火状态：</div>
            <div
                class="item-value item-status"
                :class="`status-${currentStove.fireStatus}`"
            ></div>
          </div>
          <div class="info-item">
            <div class="item-label">在线状态：</div>
            <div
                class="item-value item-status"
                :class="`status-${currentStove.status}`"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, inject, watch, onMounted, onBeforeUnmount} from "vue";

const currentStove = inject<any>("currentStove");
</script>

<style lang="scss" scoped>
$item-label-width: 0.7rem;
.smokeBar {
  height: 100%;

  .module-bottom {
    width: 100%;
    height: calc(100% - 0.35rem);
    //overflow-y: auto;
    display: flex;
    //position: relative;

    .group {
      //position: absolute;
      //top: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      .left {
        margin-right: $grid-2;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(4, auto);
        height: fit-content;
        flex:1;
        .bars-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          // margin-bottom: 0.04rem;
          // &:nth-last-child(-n+2){
          //     margin-bottom: 0;
          // }
          &:nth-child(2n) {
            margin-left: $grid-1;
          }

          .bars1,
          .bars2 {
            display: flex;
          }

          .bar-item {
            width: 0.2rem;
            height: 0.2rem;
            border-radius: 0.2rem;
            line-height: 0.2rem;
            text-align: center;
            // border: 1px solid var(--el-border-color);
            margin: 0.02rem;
            font-size: 0.12rem;
            //color: var(--el-text-color-primary);
            color: #fff;
          }
        }
      }

      .right {
        height: fit-content;
        flex:2;
        .info-item {
          flex: 1;
          margin-bottom: 0.08rem;
          display: flex;

          .item-label {
            width: $item-label-width;
          }

          .item-value {
            width: calc(100% - $item-label-width);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .item-status {
            width: 0.2rem;
            height: 0.2rem;
            border-radius: 0.2rem;
            // border: 1px solid var(--el-border-color);
          }
        }
      }
    }

    // 状态风格
    .status-0 {
      background-color: #909399;
    }

    .status-1 {
      background-color: var(--el-color-success-light-5);
    }

    .status-2 {
      background-color: var(--el-color-primary-light-5);
    }

    .status-3 {
      background-color: var(--el-color-danger-light-5);
    }
  }
}
</style>
