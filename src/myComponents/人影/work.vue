<template>
    <div
      class="item-box"
      @click="click(item)"
      v-for="(item, key) in v"
      :key="key"
      @mousedown.stop
    >
      <div class="item-left">
          <span>{{
              moment(item.tmBeginApply).format("HH:mm:ss")
          }}</span>

          <span>{{ item.strZydID }}</span>
          <span style="font-size: 14px;font-weight: bolder;">{{
              item.strName
          }}</span>
      </div>
      <div class="item-right">
          <div class="item-right-top">
              <div class="item-right-top-item">
                  <div>作业状态</div>
                  <div
                      :style="`color:${
                          工作状态格式化(
                              item.ubyStatus
                          ) == '作业开始'
                              ? '#f00'
                              : '#e5eaf3'
                      }`"
                      class="top-item-value"
                  >
                      {{ 工作状态格式化(item.ubyStatus) }}
                  </div>
              </div>
              <div class="item-right-top-item">
                  <div>发送状态</div>
                  <div class="top-item-value">
                      {{
                          发送状态格式化(
                              item.ubySendStatus
                          )
                      }}
                  </div>
              </div>
              <div class="item-right-top-item">
                  <div>作业点代码</div>
                  <div class="top-item-value">
                      {{ item.strCode }}
                  </div>
              </div>
              <div class="item-right-top-item">
                  <template v-if="!item.bAnswerAccept">
                      <div>申请时间</div>
                      <div class="top-item-value">
                          {{
                              item.tmBeginApply.substring(
                                  11,
                                  16
                              )
                          }}
                      </div>
                  </template>
                  <template v-else>
                      <div>批准时间</div>
                      <div class="top-item-value">
                          {{
                              item.tmAnswerRev
                                  ? item.tmAnswerRev.substring(
                                        11,
                                        16
                                    )
                                  : ""
                          }}
                      </div>
                  </template>
              </div>
              <div class="item-right-top-item">
                  <template v-if="!item.bAnswerAccept">
                      <div>申请时长</div>
                      <div class="top-item-value">
                          {{ item.iApplyTimeLen }}秒
                      </div>
                  </template>
                  <template v-else>
                      <div>批准时长</div>
                      <div class="top-item-value">
                          {{ item.iAnswerTimeLen }}秒
                      </div>
                  </template>
              </div>
              <div class="item-right-top-item">
                  <div>空域状态</div>
                  <div
                      :class="`${
                          获取空域状态(item) == '未使用'
                              ? 'notuse-warning'
                              : ''
                      } top-item-value`"
                  >
                      {{ 获取空域状态(item) }}
                  </div>
              </div>
              <div class="item-right-top-item">
                  <div>上报单位</div>
                  <div class="top-item-value">
                      {{ item.strUpApplyUnitName }}
                  </div>
              </div>
          </div>
          <div class="item-right-bottom">
              <div
                  class="item-right-bottom-item"
                  :style="`display: flex;align-items: center;justify-content: center;${申请(
                      item
                  )}`"
              >
                  申请({{
                      moment(item.tmBeginApply).format(
                          "HH:mm"
                      )
                  }})
              </div>
              <div
                  class="item-right-bottom-item"
                  :style="`flex:1;display:flex;justify-content: center;align-items: center;${批复(
                      item
                  )}`"
              >
                  <template v-if="!item.bAnswerAccept">
                      批复
                  </template>
                  <template v-else>
                      北空批复{{
                          "(" +
                          moment(
                              item.tmAnswerRev,
                              "YYYY-MM-DD HH:mm:ss"
                          ).format("HH:mm") +
                          ")"
                      }}
                  </template>
              </div>
              <div
                  class="item-right-bottom-item"
                  :style="`flex:1;display: flex;justify-content: center;align-items: center;${开始(
                      item
                  )}`"
              >
                  {{ beginText(item) }}
              </div>
              <div
                  class="item-right-bottom-item"
                  :style="`flex:1;display: flex;justify-content: center;align-items: center;${结束(
                      item
                  )}`"
              >
                  <template
                      v-if="
                          工作状态格式化(
                              item.ubyStatus
                          ) == '作业开始'
                      "
                  >
                      (
                      <div
                          class="item-right-bottom-item"
                          :style="`${
                              endSeconds(item) < 10
                                  ? 'color:#f00'
                                  : 'color:inherit'
                          }`"
                      >
                          {{
                              Math.floor(
                                  endSeconds(item) / 60
                              ) +
                              ":" +
                              (endSeconds(item) % 60)
                          }}
                      </div>
                      )结束
                  </template>
                  <template v-else>
                      {{
                          "结束" +
                          (item.tmBeginAnswer
                              ? "(" +
                                  moment(item.tmBeginAnswer)
                                      .add(
                                          item.iAnswerTimeLen,
                                          "s"
                                      )
                                      .format("HH:mm:ss") +
                                  ")"
                              : "")
                      }}
                  </template>
              </div>
              <div
                  class="item-right-bottom-item"
                  :style="`flex:1;display: flex;justify-content: center;align-items: center;${完成(
                      item
                  )}`"
              >
                  完成
              </div>
          </div>
      </div>
  </div>
</template>
<script setup lang="ts">
const v = defineModel('v',{
    type: Array<any>,
    default: () => [],
});
import moment from "moment";
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
const station = useStationStore();
const click = (item: any) => {
    station.人影界面被选中的设备 = item.strZydID;
    eventbus.emit("人影-将站点移动到屏幕中心", { strPos: item.strCurPos });
};
function 获取空域状态(item: any) {
    if (item.ubyStatus == 91) {
        return "地面作业使用中";
    } else if (item.ubyStatus == 75) {
        return "未使用";
    }
    {
        return "";
    }
}
const 工作状态格式化 = (key: number) => {
    let status = [
        { key: 0, value: "空闲" },
        { key: 9, value: "作业完成" },
        { key: 70, vlaue: "作业保存" },
        { key: 72, value: "作业申请待批复" },
        { key: 73, value: "撤销申请待回执" },
        { key: 74, value: "已撤销" },
        { key: 75, value: "作业批准" },
        { key: 76, value: "作业不批准" },
        { key: 90, value: "作业开始带回执" },
        { key: 91, value: "作业开始" },
        { key: 92, value: "作业暂停待回执" },
        { key: 93, value: "作业强制终止" },
        { key: 99, value: "人工移除" },
        { key: 100, value: "作业结束" },
    ];
    return (
        status.filter((item) => item.key == key)[0]?.value || `未知状态${key}`
    );
};
const 发送状态格式化 = (key: number) => {
    let status = [
        { key: 0, value: "空闲" },
        { key: 1, value: "等待发送" },
        { key: 2, value: "发送中" },
        { key: 3, value: "发送成功" },
        { key: 4, value: "发送失败" },
    ];
    return (
        status.filter((item) => item.key == key)[0]?.value || `未知状态${key}`
    );
};
const 申请 = (item: any) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "background-color:#3D5E86";
        case "作业申请待批复":
            return "background-color:#3ac8a5";
        case "作业不批准":
            return "background-color:#3D5E86";
        case "作业批准":
            return "background-color:#3ac8a5";
        case "作业开始":
            return "background-color:#3ac8a5";
        default:
            return "background-color:#1E3148";
    }
};
const 批复 = (item: any) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "background-color:#3D5E86";
        case "作业不批准":
            return "background-color:#3D5E86";
        case "作业批准":
            return "background-color:#3ac8a5";
        case "作业开始":
            return "background-color:#3ac8a5";
        default:
            return "background-color:#1E3148";
    }
};
const 开始 = (item: any) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "background-color:#3D5E86";
        case "作业不批准":
            return "background-color:#f56c6c";
        case "作业开始":
            return "background-color:#3ac8a5";
        default:
            return "background-color:#1E3148";
    }
};
const 结束 = (item: any) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "background-color:#3D5E86";
        case "作业不批准":
            return "background-color:#f56c6c";
        default:
            return "background-color:#1E3148";
    }
};
const 完成 = (item: any) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "backgournd-color:#3D5E86";
        case "作业不批准":
            return "background-color:#f56c6c";
        default:
            return "background-color:#1E3148";
    }
};
function endSeconds(item: any) {
    return moment(item.tmBeginAnswer)
        .add(item.iAnswerTimeLen, "s")
        .diff(moment(), "seconds");
}
function beginText(item: any) {
    if (工作状态格式化(item.ubyStatus) == "作业批准") {
        let seconds = moment(item.tmBeginAnswer).diff(moment(), "seconds");
        return "(" + Math.floor(seconds / 60) + ":" + (seconds % 60) + ")开始";
    }
    return (
        "开始" +
        (item.tmBeginAnswer
            ? "(" +
                moment(item.tmBeginAnswer, "YYYY-MM-DD HH:mm:ss").format(
                    "HH:mm:ss"
                ) +
                ")"
            : "")
    );
}
</script>
<style scoped lang="scss">
.item-box {
    min-width: calc(100% - $scrollbar-width);
    height: 80px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);

    display: flex;
    border-radius: $border-radius-1;
    &:hover {
        border: 1px solid var(--el-border-color-light);
    }
    &:not(:last-child) {
        margin-bottom: $grid-1;
    }
    .notuse-warning {
        color: var(--el-color-danger);
        animation: blink 1s infinite;
    }
    @keyframes blink {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    $item-left-width: 80px;
    .item-left {
        padding: $grid-1;
        border-right: 1px solid var(--el-border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: $item-left-width;
    }
    $item-right-bottom-height: 40px;
    .item-right {
        width: calc(100% - $item-left-width);
        height: 100%;
        .item-right-top {
            display: flex;
            height: calc(100% - $item-right-bottom-height);
            border-bottom: 1px solid var(--el-border-color);
            .item-right-top-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 0 $grid-1;
                color: var(--el-text-color-secondary);
                font-size: 10px;
                &:not(:last-child) {
                    border-right: 1px solid var(--el-border-color);
                }
                .top-item-value {
                    color: var(--el-text-color-primary);
                    // font-weight: 600;
                    font-size: 12px;
                }
            }
        }
        .item-right-bottom {
            display: flex;
            height: $item-right-bottom-height;
            align-items: center;
            justify-content: center;
            padding: $grid-1;
            box-sizing: border-box;
            .item-right-bottom-item {
                padding: 0 $grid-1;
                color: #fff;
                &:first-child {
                    border-radius: 40px 0 0 40px;
                }
                &:last-child {
                    border-radius: 0 40px 40px 0;
                }
                &:not(:last-child) {
                    border-right: 1px solid var(--el-border-color);
                }
            }
        }
    }
}
</style>