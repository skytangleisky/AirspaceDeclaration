<template>
    <div class="left-container">
        <div class="left-button" v-for="item in option" :style="{zIndex: item.zIndex}">
            
            <div :class="`map-tool-btn ${item.active ? 'active' : ''}`" @click="handleClick(item)">
                
                <el-tooltip
                    class="box-item"
                    :content="item.content"
                    placement="right"
                    :show-after="500"
                >
                    <el-icon v-html="item.icon"></el-icon>
                </el-tooltip>
            </div>
            <div v-if="!item.click && item.active" class="menu-out-box" @click.stop>
                <alarm v-if="item.content==='告警控制'"></alarm>
                <menuContainer
                    v-if="item.content==='人影参数' || item.content==='辅助管理' || item.content==='历史查询统计'"
                    :activeContent="item.content"></menuContainer>
                <alarm v-if="item.content==='查询统计'"></alarm>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import {reactive} from 'vue'
    import wechatRaw from './wechat.svg?raw'
    import alarmRaw from './alarm.svg?raw'
    import regulationRaw from './regulation.svg?raw'
    import assistantRaw from './assistant.svg?raw'
    import historyRaw from './history.svg?raw'
    import statisticsRaw from './statistics.svg?raw'
    import routeRaw from './route.svg?raw'
    import configureRaw from './configure.svg?raw'
    import Alarm from './告警控制/index.vue'
    import menuContainer from './menuContainer.vue'
    import {modelRef} from '~/tools'
    import {useSettingStore} from '~/stores/setting'
    
    const setting = useSettingStore()
    
    interface Item {
        active?: any;
        zIndex?: number;
        content: string;
        icon?: string;
        click?: Function;
    }
    
    const option = reactive<Item[]>([{
        icon: wechatRaw,
        content: '信息交互',
        active: true,
        click: (active: boolean) => {
            console.log('信息交互', active)
        }
    }, {
        icon: alarmRaw,
        content: '告警控制',
    }, {
        icon: regulationRaw,
        content: '人影参数',
    }, {
        icon: assistantRaw,
        content: '辅助管理',
    }, {
        icon: historyRaw,
        content: '历史查询统计',
    }, {
        icon: statisticsRaw,
        content: '查询统计',
    }, {
        icon: routeRaw,
        content: '航迹回放',
        click() {
            console.log('航迹回放')
        }
    }, {
        icon: configureRaw,
        active: modelRef(setting, 'showBusinessLayer'),
        content: '显示设置',
        click(item: Item) {
            setting.showBusinessLayer = item.active
        }
    }])
    
    function handleClick(item: any) {
        for (let i = 0; i < option.length; i++) {
            let it = option[i]
            if (it === item) {
                it.active = !it.active
                it.zIndex = 1
            } else {
                it.zIndex = 0
                if (it.content != '显示设置') {
                    it.active = false
                }
            }
        }
        if (item.click) {
            item.click(item)
        }
    }
</script>
<style lang="scss" scoped>
    $arrow-size: .12rem;
    .left-container {
        position: absolute;
        left: $page-padding;
        top: .45rem;
        display: flex;
        flex-direction: column;
        gap: .08rem;
        
        .left-button {
            position: relative;
            
            .map-tool-btn {
            
            }
            
            .menu-out-box {
                position: absolute;
                left: calc(100% + $grid-3);
                top: 0;
                min-width: 100px;
                min-height: 100px;
                background-color: var(--el-bg-color-opacity-8);
                box-sizing: border-box;
                border: 1px solid var(--el-border-color);
                border-radius: $border-radius-2;
                padding: $grid-3;
                //伪元素画小三角
                &::before {
                    content: "";
                    display: block;
                    width: 0;
                    height: 0;
                    border-top: calc($arrow-size / 2) solid transparent;
                    border-bottom: calc($arrow-size / 2) solid transparent;
                    border-right: $arrow-size solid var(--el-border-color);
                    position: absolute;
                    top: .12rem;
                    left: -$arrow-size - 0.01rem;
                    //left:-(calc(#{$arrow-size} + .01rem))  ;
                    //border-right: $arrow-size solid var(--el-border-color);
                }
                
                &::after {
                    content: "";
                    display: block;
                    width: 0;
                    height: 0;
                    border-top: calc((#{$arrow-size} - .02rem) / 2) solid transparent;
                    border-bottom: calc((#{$arrow-size} - .02rem) / 2) solid transparent;
                    border-right: calc(#{$arrow-size} - .02rem) solid var(--el-bg-color-opacity-8);
                    position: absolute;
                    top: .13rem;
                    left: -$arrow-size + .02rem;
                }
                
            }
            
        }
        
        
    }
</style>