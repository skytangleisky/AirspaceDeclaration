<template>
    <teleport to="#wstd-container">
        <div ref="meeting" v-dragable class="wstd-content meeting" v-show="SHOW" v-if="IF">
            <div class="content-box-top">
                <div class="content-box-title" @mousedown.stop>{{ title }}</div>
                <div class="close-btn" @click="close" @mousedown.stop>
                    <el-button size="large" type="primary" link>
                        <el-icon color="#126Ae1" :size="20">
                            <Close/>
                        </el-icon>
                    </el-button>
                </div>
            </div>
            <!--<div class="title" @mousedown.stop>{{ title }}</div>-->
            
            <slot></slot>
            <!--<div class="close-btn" @click="close" @mousedown.stop><el-icon v-html="closeUrl"></el-icon></div>-->
        </div>
    </teleport>
</template>
<script setup lang="ts">
    import { Close } from '@element-plus/icons-vue'
    
    const title = defineModel('title', {
        default: '标题'
    })
    import { inject, nextTick, onMounted, ref, watch } from 'vue'
    
    function close () {
        if (once.value) {
            IF.value = false
        } else {
            SHOW.value = false
        }
        render.value = false
    }
    
    const SHOW = ref(true)
    const IF = ref(true)
    const once = defineModel<boolean>('once', {
        default: false
    })
    const render = defineModel('render', {
        required: false,
        default: false
    })
    const width = defineModel('width', {
        default: '100%'
    })
    const height = defineModel('height', {
        default: '100%'
    })
    watch(width, (newVal, oldVal) => {
        if (meeting.value) {
            meeting.value!.style.setProperty('--width', newVal)
        }
        if (width.value == '100%' && height.value == '100%') {
            meeting.value!.style.setProperty('border', 'none')
        }
    })
    watch(height, (newVal, oldVal) => {
        if (meeting.value) {
            meeting.value!.style.setProperty('--height', newVal)
        }
        if (width.value == '100%' && height.value == '100%') {
            meeting.value!.style.setProperty('border', 'none')
        }
    })
    const meeting = ref()
    onMounted(() => {
        if (meeting.value) {
            meeting.value!.style.setProperty('--width', width.value)
            meeting.value!.style.setProperty('--height', height.value)
            if (width.value == '100%' && height.value == '100%') {
                meeting.value!.style.setProperty('border', 'none')
            }
        }
    })
    watch(render, (newVal, oldVal) => {
        if (once.value) {
            IF.value = newVal
            if (IF.value == true) {
                nextTick(() => {
                    meeting.value!.style.setProperty('--width', width.value)
                    meeting.value!.style.setProperty('--height', height.value)
                })
            }
        } else {
            SHOW.value = newVal
        }
    }, { immediate: true })
    
    import closeUrl from '~/assets/close.svg?raw'
</script>
<style lang="scss" scoped>
    .meeting {
        display: flex;
        flex-direction: column;
        --width: 100%;
        --height: 100%;
        width: var(--width);
        height: var(--height);
        position: absolute;
        left: calc(50% - var(--width) / 2);
        top: calc(50% - var(--height) / 2);
        cursor: move;
        
    }
</style>