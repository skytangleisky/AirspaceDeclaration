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
                        {{ weatherObject.windDir }}<span>°</span>
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
                        {{ weatherObject.windSpeed }}<span>m/s</span>
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
                        {{ weatherObject.tem }} <span>℃</span>
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
                        {{ weatherObject.prs }}<span>%</span>
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
                        {{ weatherObject.rh }}<span>hPa</span>
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
                        {{ weatherObject.rainfall }}<span>mm</span>
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
                        {{ weatherObject.rainfall }}<span>V</span>
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
                        {{ weatherObject.tem }} <span>℃</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive,inject,onMounted, watch } from "vue";

let stoveID = inject('stoveID')
watch(stoveID,newVal=>{
    // console.log("stoveIDweather",newVal);
})

const svgIconSize = "0.24rem";
// 假气象数据
let weatherObject = reactive({
    rh: 1016.5,
    windDir: 12,
    windSpeed: 7.4,
    tem: 14,
    prs: 27.3,
    rainfall: 0,
});
</script>

<style lang="scss" scoped>
.weatherObject {
    height: 100%;
    .module-bottom {
        display: flex;
        flex-wrap: wrap;
        .item {
            display: flex;
            align-items: center;
            width: calc((100% - 3 * $grid-2) / 4);
            margin-bottom: $grid-2;
            &:nth-last-child(-n+4){
                margin-bottom: 0;
            }
            &:not(:nth-child(4n)){
                margin-right: $grid-2;
            }
            .item-left {
                margin-right: 0.04rem;
                .svg-icon:deep(use) {
                    fill: var(--el-color-primary);
                }
            }
            .item-right {
                .item-label {
                    margin-bottom: 0.04rem;
                }

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
