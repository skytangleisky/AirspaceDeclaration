<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer"></svg-icon>
                <span style="user-select: none;cursor:default;">地面指挥</span>
            </div>
            <div class="title-right">
                <slot name="select"></slot>
            </div>
        </div>
        <div class="tool-mode-content">
            <slot name="content"></slot>
            <el-checkbox v-for="(item,index) in renderDict" :key="index" v-model="item.value">
                <div style="display: flex;align-items: center;"><svg-icon :name="item?.icon" v-if="item.icon"></svg-icon>{{ item.label }}</div>
            </el-checkbox>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref,computed} from "vue";
    import SvgIcon from "~/myComponents/SvgIcon.vue";
    import { useSettingStore } from "~/stores/setting";
    import { modelRef } from '~/tools'
    const setting = useSettingStore()
    let renderDict = ref<any[]>([{
        label: "机场",
        value: modelRef(setting,'人影.监控.airport'),
        icon: 'layer'
    },
    {
        label: '空域分布',
        value: computed({
            get(){
                return setting.人影.监控.ryAirspaces.base
            },
            set(val){
                setting.人影.监控.ryAirspaces.base = val
                setting.人影.监控.ryAirspaces.line = val
                setting.人影.监控.ryAirspaces.label = val
            }
        })
    }])
</script>

<style scoped lang="scss">
    .toolMode {
        background-color: var(--el-bg-color);
        border-radius: $border-radius-1;
        padding: $grid-1;
        .tool-mode-title {
            display: flex;
            justify-content: space-between;
        }
        .title-left {
            display: flex;
            align-items: center;
            margin-bottom: $grid-1;
            .svg-icon {
                margin-right: 0.04rem;
            }
        }
        .tool-mode-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: -$grid-1;
        }
    }
</style>