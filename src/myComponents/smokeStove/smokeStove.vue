<template>
    <div class="smokeStove page-content">
        <!-- 烟炉 -->
        <div class="page-top">
            <!-- <globalOperation  
                @chooseStoveHandle="chooseStoveHandle"
            ></globalOperation> -->
            <globalOperation  
            ></globalOperation>
        </div>
        <div class="page-bottom">
            <div class="page-bottom-left">
                <div class="bottom-left-top">
                    <smokeBar></smokeBar>
                </div>
                <div class="bottom-left-bottom">
                    <weatherInfo ></weatherInfo>
                </div>
            </div>
            <div class="page-bottom-right">
                <stoveSetting></stoveSetting>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, provide, watch, onMounted } from "vue";
import globalOperation from "./components/globalOperation.vue";
import weatherInfo from "./components/weatherInfo.vue";
import smokeBar from "./components/smokeBar.vue";
import stoveSetting from "./components/stoveSetting.vue";
let stoveID = ref(null); //当前选中烟炉ID
let stoveObject = ref({}); //当前选中烟炉数据

provide('stoveID',stoveID)



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
$page-top-height: 3.3rem;
.smokeStove {
    background-color: transparent;
    padding: 0;
    .page-top {
        background-color: var(--el-bg-color);
        border-radius: $border-radius-4;
        height: $page-top-height;
        margin-bottom: $grid-4;
        padding: $grid-4;
    }
    .page-bottom {
        height: calc(100% - $page-top-height - $grid-4);
        display: flex;
        .page-bottom-left {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-right: $grid-4;
            .bottom-left-top {
                flex: 2;
                background-color: var(--el-bg-color);
                border-radius: $border-radius-4;
                margin-bottom: $grid-4;
                padding: $grid-4;
                overflow: hidden;
            }
            .bottom-left-bottom {
                flex: 0.9;
                background-color: var(--el-bg-color);
                border-radius: $border-radius-4;
                padding: $grid-4;
            }
        }
        .page-bottom-right {
            flex: 2.5;
            height: 100%;
            background-color: var(--el-bg-color);
            border-radius: $border-radius-4;
            padding: $grid-4;
        }
    }
}
</style>
