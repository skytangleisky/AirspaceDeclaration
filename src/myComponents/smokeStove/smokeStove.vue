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
let stoveID = ref(null); //当前选中烟炉ID
let stoveObject = ref({}); //当前选中烟炉数据

provide("currentStove", reactive({stoveID,availableCount:0,usedCount:0}));
provide("smokeStoveList", reactive([]));

/**
 * @author yhl 2025-03-13 15:54:33
 * @description  选择烟炉
 * @param  item-当前选中烟炉的数据
 */
function chooseStoveHandle(item) {
    stoveID.value = item.strStoveID;
    stoveObject.value = item;
    console.log("fu", item);
}
</script>

<style lang="scss" scoped>
$layoutTop-height: 0px;
$page-top-height: 3.4rem;
.smokeStove {
    background-color: var(--el-bg-color-page);
    padding: $grid-5;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    .page-top {
        background-color: var(--el-bg-color);
        border-radius: $border-radius-4;
        margin-bottom: $grid-4;
        padding: $grid-4;
        height: 3.4rem;
        box-sizing: border-box;
    }
    .page-bottom {
        height: calc(100% - $page-top-height - $grid-4);
        display: flex;
        .page-bottom-left {
            flex: 1;
            // display: flex;
            // flex-direction: column;
            height: 100%;
            margin-right: $grid-4;
            $bottom-left-bottom-height: 1.8rem;
            .bottom-left-top {
                height: calc(100% - $bottom-left-bottom-height - $grid-4);
                background-color: var(--el-bg-color);
                border-radius: $border-radius-4;
                margin-bottom: $grid-4;
                padding: $grid-4;
                box-sizing: border-box;
                overflow: hidden;
            }
            .bottom-left-bottom {
                height: $bottom-left-bottom-height;
                background-color: var(--el-bg-color);
                border-radius: $border-radius-4;
                padding: $grid-4;
                box-sizing: border-box;
            }
        }
        .page-bottom-right {
            flex: 2.5;
            height: 100%;
            background-color: var(--el-bg-color);
            border-radius: $border-radius-4;
            padding: $grid-4;
            box-sizing: border-box;
            // overflow-y: auto;
        }
    }
}
</style>