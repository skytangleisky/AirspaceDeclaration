<template>
    <div class="colormap"
         v-if="(setting.人影.监控.睿图雷达||setting.人影.监控.CMPAS降水融合3km||setting.人影.监控.组合反射率)&&setting.人影.监控.色标.length">
        <div class="item-box" v-for="item in setting.人影.监控.色标">
            <div class="item-color" :style="{background:item.color}"></div>
            <div class="item-label">
                {{ item.value }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import {useSettingStore} from '~/stores/setting'
    
    const setting = useSettingStore()
</script>
<style scoped lang="scss">
    .colormap {
        width: fit-content;
        height: $global-button-height;
        display: flex;
        align-items: center;
        background-color: var(--el-bg-color-opacity-8);
        border: 1px solid var(--el-border-color);
        padding: 0 $grid-2;
        border-radius: $border-radius-1;
        
        .item-box {
          
            &:first-child {
                .item-color {
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                }
            }
            
            &:last-child {
                .item-color {
                    border-right: 1px solid grey;
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
            }
            
            .item-color {
                width:.2rem;
                height:.1rem;
                border: 1px solid grey;
                border-right: none;
                box-sizing: border-box;
            }
            
            .item-label {
                font-size:.1rem;
                text-align: center;
            }
        }
        
    }
</style>