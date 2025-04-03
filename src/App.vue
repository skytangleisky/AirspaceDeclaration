<template>
    <div class="wstd-main-container">
        <RgyxWorkPoint />
        <!-- <SmokeStove></SmokeStove> -->
        <Websocket />
        <el-radio-group v-model="theme" style="position: absolute;left:100px;background-color: #2b2b2b;padding:0 20px;border-radius: 10px;border:1px solid red;">
            <el-radio value="light">亮色</el-radio>
            <el-radio value="dark">暗色</el-radio>
            <el-radio value="auto">自动</el-radio>
        </el-radio-group>
    </div>
</template>
<script setup>
// import RgyxWorkPoint from "~/components/rgyx-work-point.vue";//示例
import RgyxWorkPoint from "~/myComponents/人影/pages/synthesis.vue"; //空域申请
// import SmokeStove from "~/myComponents/smokeStove/smokeStove.vue"; //烟炉作业
import Websocket from "~/myComponents/websocket/websocket.vue";
import { useTheme } from "~/theme";
const theme = useTheme();
</script>
<style>
.wstd-main-container {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
