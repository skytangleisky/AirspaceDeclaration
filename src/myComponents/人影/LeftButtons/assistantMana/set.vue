<template>
    <div class="set">
        <el-form label-width="80">
            <el-form-item label="语音引擎">
                <el-select v-model=setForm.engine>
                    <el-option v-for="item in engineDict" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语言">
                <el-select v-model=setForm.locale>
                    <el-option v-for="item in localeDict" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语音">
                <el-select v-model=setForm.voice>
                    <el-option v-for="item in voiceDict" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="音调">
                <el-input-number v-model="setForm.pitch"></el-input-number>
            </el-form-item>
            <el-form-item label="语速">
                <el-input-number v-model="setForm.rate"></el-input-number>
            </el-form-item>
            <el-form-item label="音量">
                <el-input-number v-model="setForm.volume"></el-input-number>
            </el-form-item>
            <el-form-item label="测试文本" >
                <el-input type="textarea" v-model="setForm.remark"></el-input>
            </el-form-item>
        </el-form>
        <div class="btns-box">
            <el-button type="primary" @click="handleConfirm">应用</el-button>
            <el-button @click="handleCancel">清空</el-button>
            <el-button type="primary">试听</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {reactive, ref} from "vue";
    import {engineDict, localeDict,} from "~/utils/Dict.ts"
    
    const voiceDict = ref([{
        value: 0,
        label: "Microsoft Huihui Desktop"
    }])
    
    const setForm = reactive({
        engine: 0,
        locale: 0,
        voice: 0,
        pitch: 0,
        rate: 0,
        volume: 1,
        remark: ''
    })
    const defaultForm = {
        engine: 0,
        locale: 0,
        voice: 0,
        pitch: 0,
        rate: 0,
        volume: 1,
        remark: ''
    }
    
    /**
     * @author yhl 2025/12/25 10:39
     * @description 取消
     */
    const handleCancel = () => {
        Object.assign(setForm, defaultForm)
    }
    
    /**
     * @author yhl 2025/12/25 10:41
     * @description 确认
     */
    const handleConfirm = () => {
        //提交成功后重置
        Object.assign(setForm, defaultForm)
    }
</script>

<style scoped lang="scss">
    .set {
        width: 100%;
        
        .btns-box {
            display: flex;
            flex-direction: row-reverse;
            gap: $grid-2;
        }
    }
</style>