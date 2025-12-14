<template>
  <div class="planPanel wstd-container" style="z-index: 1;height:fit-content;width: fit-content;">
    <div class="bottom wstd-content" style="position: relative;margin-bottom:10px;" v-show="tabActive !== ''">
      <div class="close-btn" @click="tabActive = ''">
        <el-icon v-html="closeSvg"></el-icon>
      </div>
      <div class="bottom-content">
          <el-scrollbar height="100%">
              <!-- 当前作业进度，今日作业记录 -->
              <div
                  v-for="(v, k) in props"
                  :label="k"
                  v-show="tabActive == k"
              >
                  <Work :v="v" />
              </div>
              <!-- 空域流转信息 -->
              <div v-show="tabActive == '空域流转信息'">
                  <Transport :data="props.今日作业记录" />
              </div>
              <div v-show="tabActive == '完成信息查询'">
                  <FinishedInfo></FinishedInfo>
              </div>
              <div v-show="tabActive == '人影飞机'">
                  <PlaneInfo></PlaneInfo>
              </div>
          </el-scrollbar>
      </div>
    </div>
    <div class="top" style="margin-top:10px;margin-bottom:0;">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        class="top-item"
        @click="tabActive == item.label ? tabActive = '' : tabActive = item.label"
      >
        <el-badge :value="item.total" type="success" :hidden="item.hideBadge">
          <div
            :class="{ active: tabActive == item.label,box:true,'map-btn':true }"
            style="user-select: none;cursor:pointer"
          >
            <svg-icon color="#C1C1C1" :name="item.icon"></svg-icon>
            <span class="label" style="white-space:nowrap;">{{ item.label }}</span>
          </div>
        </el-badge>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Work from './work.vue'
import { defineAsyncComponent, reactive, ref, watch, computed } from "vue";
import closeSvg from '~/assets/close.svg?raw'
const Transport = defineAsyncComponent(() => import("./transport.vue"));
const FinishedInfo = defineAsyncComponent(() => import("./finishedInfo.vue"));
const PlaneInfo = defineAsyncComponent(() => import("./planeInfo.vue"));
import { useSettingStore } from "../../stores/setting";
const setting = useSettingStore()
// top按钮渲染数据
const tabList = reactive([
  {
    label: "当前作业进度",
    icon: "progress",
    type: "progress",
    total: computed(() => props.当前作业进度.length),
  },
  {
    label: "今日作业记录",
    icon: "plan-fill",
    type: "PLANFILL",
    total: computed(() => props.今日作业记录.length),
  },
  {
    label: "空域流转信息",
    icon: "transferInfo",
    type: "transferInfo",
    total: computed(() => props.今日作业记录.length),
  },
  {
    label: "完成信息查询",
    icon: "tasks",
    type: "完成信息查询",
    total: 0,
    hideBadge:true,
  },
  {
    label: "人影飞机",
    icon: "plane",
    total: computed(()=>setting.人影.监控.需要重点关注的飞机.length),
    hideBadge:false,
  },
]);
const tabActive = ref("");
const props = withDefaults(
    defineProps<{
        当前作业进度: any[];
        今日作业记录: any[];
    }>(),
    {
        当前作业进度: () => new Array<any>(),
        今日作业记录: () => new Array<any>(),
    }
)
</script>
<style scoped lang="scss">
.planPanel {
  position: absolute;
  left: $page-padding;
  bottom: $page-padding;
  // top: 300px;
  .wstd-content {
      width: 840px;
  }
  .el-tabs {
    border-radius: $border-radius-1;
    ::v-deep(.el-tabs__header .el-tabs__item) {
        transition-duration: 0s;
    }
    ::v-deep(.el-tabs__content) {
        padding: $grid-2;
    }
    .el-tab-pane {
        max-height: 360px;
        overflow-y: auto;
    }
  }
}
</style>
