<template>
    <div class="smokeStove">
        <!-- 烟炉 -->
        <div class="page-top">
            <!-- <globalOperation
                @chooseStoveHandle="chooseStoveHandle"
            ></globalOperation> -->
            <globalOperation></globalOperation>
        </div>
        <div class="page-bottom">
            <div class="page-bottom-left">
                <div class="bottom-left-top">
                    <smokeBar></smokeBar>
                </div>
                <div class="bottom-left-bottom">
                    <weatherInfo></weatherInfo>
                </div>
            </div>
            <div class="page-bottom-right">
                <stoveSetting></stoveSetting>
            </div>
        </div>
    </div>
    <StoveWebsocket/>
</template>

<script setup lang="ts">
import StoveWebsocket from "~/myComponents/stoveWebsocket/websocket.vue";
import { ref, reactive, provide, watch, onMounted } from "vue";
import globalOperation from "./components/globalOperation.vue";
import weatherInfo from "./components/weatherInfo.vue";
import smokeBar from "./components/smokeBar.vue";
import stoveSetting from "./components/stoveSetting.vue";
let strStoveID = ref(null); //当前选中烟炉ID
let stoveObject = ref({}); //当前选中烟炉数据

provide("currentStove", ref({
    burningCount:0,
    usedCount:0,
    availableCount:0,
    status:0,
    fireStatus:0,
    barList: [
        [
            { id: 1, status: 0 },
            { id: 2, status: 0 },
            { id: 3, status: 0 },
            { id: 4, status: 0 },
            { id: 5, status: 0 },
            { id: 6, status: 0 },
            { id: 7, status: 0 },
        ],
        [
            { id: 8, status: 0 },
            { id: 9, status: 0 },
            { id: 10, status: 0 },
            { id: 11, status: 0 },
            { id: 12, status: 0 },
            { id: 13, status: 0 },
            { id: 14, status: 0 },
        ],
        [
            { id: 15, status: 0 },
            { id: 16, status: 0 },
            { id: 17, status: 0 },
            { id: 18, status: 0 },
            { id: 19, status: 0 },
            { id: 20, status: 0 },
            { id: 21, status: 0 },
        ],
        [
            { id: 22, status: 0 },
            { id: 23, status: 0 },
            { id: 24, status: 0 },
            { id: 25, status: 0 },
            { id: 26, status: 0 },
            { id: 27, status: 0 },
            { id: 28, status: 0 },
        ],
        [
            { id: 29, status: 0 },
            { id: 30, status: 0 },
            { id: 31, status: 0 },
            { id: 32, status: 0 },
            { id: 33, status: 0 },
            { id: 34, status: 0 },
            { id: 35, status: 0 },
        ],
        [
            { id: 36, status: 0 },
            { id: 37, status: 0 },
            { id: 38, status: 0 },
            { id: 39, status: 0 },
            { id: 40, status: 0 },
            { id: 41, status: 0 },
            { id: 42, status: 0 },
        ],
        [
            { id: 43, status: 0 },
            { id: 44, status: 0 },
            { id: 45, status: 0 },
            { id: 46, status: 0 },
            { id: 47, status: 0 },
            { id: 48, status: 0 },
            { id: 49, status: 0 },
        ],
        [
            { id: 50, status: 0 },
            { id: 51, status: 0 },
            { id: 52, status: 0 },
            { id: 53, status: 0 },
            { id: 54, status: 0 },
            { id: 55, status: 0 },
            { id: 56, status: 0 },
        ],
    ],
    currentTime:'',
    heartTime:0,
}));
provide("smokeStoveList", reactive([]));
provide("logInfoList",reactive([]))
/**
 * @author yhl 2025-03-13 15:54:33
 * @description  选择烟炉
 * @param  item-当前选中烟炉的数据
 */
function chooseStoveHandle(item) {
    strStoveID.value = item.strStoveID;
    stoveObject.value = item;
    console.log("fu", item);
}
</script>

<style lang="scss" scoped>
$layoutTop-height: 0px;
$page-top-height: 3.4rem;
.smokeStove {
    background-color: var(--el-bg-color-page);
    padding: $grid-2;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    .page-top {
        background-color: var(--el-bg-color);
        border-radius: $border-radius-2;
        margin-bottom: $grid-2;
        padding: $grid-2;
        height: 3.4rem;
        box-sizing: border-box;
    }
    .page-bottom {
        height: calc(100% - $page-top-height - $grid-2);
        display: flex;
        .page-bottom-left {
            width:fit-content;
            // display: flex;
            // flex-direction: column;
            height: 100%;
            margin-right: $grid-2;
            $bottom-left-bottom-height: 1.8rem;
            .bottom-left-top {
                height: calc(100% - $bottom-left-bottom-height - $grid-2);
                background-color: var(--el-bg-color);
                border-radius: $border-radius-2;
                margin-bottom: $grid-2;
                padding: $grid-2;
                box-sizing: border-box;
                overflow: hidden;
            }
            .bottom-left-bottom {
                height: $bottom-left-bottom-height;
                background-color: var(--el-bg-color);
                border-radius: $border-radius-2;
                padding: $grid-2;
                box-sizing: border-box;
            }
        }
        .page-bottom-right {
            flex: 1;
            height: 100%;
            background-color: var(--el-bg-color);
            border-radius: $border-radius-2;
            padding: $grid-2;
            box-sizing: border-box;
            // overflow-y: auto;
        }
    }
}
</style>