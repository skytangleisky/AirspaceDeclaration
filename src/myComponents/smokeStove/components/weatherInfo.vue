<template>
    <div class="weatherObject module-box">
        <div class="module-top">
            <div class="module-title">气象信息</div>
            <div class="module-title-decoration"></div>
        </div>
        <div class="module-bottom">
            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="w-windDirection"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">风向</div>
                    <div class="item-value">
                        {{ weatherObject.windDir.toFixed(1) }}<span>°</span>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="w-wind"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">风速</div>
                    <div class="item-value">
                        {{ weatherObject.windSpeed.toFixed(1) }}<span>m/s</span>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="w-temperature"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">温度</div>
                    <div class="item-value">
                        {{ weatherObject.tem.toFixed(1) }} <span>℃</span>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="w-humidity"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">湿度</div>
                    <div class="item-value">
                        {{ weatherObject.prs.toFixed(1) }}<span>%RH</span>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="w-atmosphericPressure"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">压力</div>
                    <div class="item-value">
                        {{ weatherObject.rh.toFixed(1) }}<span>hPa</span>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="w-rainfall"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">雨量</div>
                    <div class="item-value">
                        {{ weatherObject.rainfall.toFixed(1) }}<span>mm</span>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="power2"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">电压</div>
                    <div class="item-value">
                        {{ weatherObject.Voltage.toFixed(1) }}<span>V</span>
                    </div>
                </div>
            </div>

            <div class="item">
                <div class="item-left">
                    <svg-icon
                        name="w-temperature"
                        :width="svgIconSize"
                        :height="svgIconSize"
                    ></svg-icon>
                </div>
                <div class="item-right">
                    <div class="item-label">烟炉温度</div>
                    <div class="item-value">
                        {{ weatherObject.temStove.toFixed(1) }} <span>℃</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive,inject,onMounted, watch } from "vue";

let currentStove = inject('currentStove',{stoveID:''})
const svgIconSize = "0.24rem";
// 假气象数据
let weatherObject = reactive({
    rh: 0,
    windDir: 0,
    windSpeed: 0,
    tem: 0,
    prs: 0,
    rainfall: 0,
    Voltage: 0,
    temStove:0,
});
</script>

<style lang="scss" scoped>
.weatherObject {
    height: 100%;
    position: relative;
    width:500px;
    .module-bottom {
        height: fit-content;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, auto);
        .item {
            display: flex;
            align-items: center;
            width: 100px;
            padding:4px;
            .item-left {
                padding:8px;
                .svg-icon:deep(use) {
                    fill: var(--el-color-primary);
                }
            }
            .item-right {
                white-space: nowrap;
                .item-value {
                    font-size: 0.18rem;
                    font-weight: 600;
                    color: var(--el-text-color-primary);
                    span{
                        font-size: 0.14rem;
                    }
                }
            }
        }
    }
}
</style>
