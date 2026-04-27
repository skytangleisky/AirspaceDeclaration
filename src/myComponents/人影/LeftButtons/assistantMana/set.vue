<template>
    <div class="set">
        <el-form label-width="80">
            <el-form-item label="语音引擎">
                <el-select v-model=voice.engine>
                    <el-option v-for="item in engineDict" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语言">
                <el-select v-model=voice.locale>
                    <el-option v-for="item in localeDict" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="语音">
                <el-select v-model=voice.voice>
                    <el-option v-for="item in voiceDict" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="音调">
                <el-input-number v-model="voice.pitch" :min="0" :max="1" :step="0.1"></el-input-number>
            </el-form-item>
            <el-form-item label="语速">
                <el-input-number v-model="voice.rate" :min="0" :max="1" :step="0.1"></el-input-number>
            </el-form-item>
            <el-form-item label="音量">
                <el-input-number v-model="voice.volume" :min="0" :max="1" :step="0.1"></el-input-number>
            </el-form-item>
            <el-form-item label="测试文本" >
                <el-input type="textarea" v-model="voice.remark"></el-input>
            </el-form-item>
        </el-form>
        <div class="btns-box">
            <el-button @click="handleTry" type="primary">试听</el-button>
            <el-button @click="handleReset">重置</el-button>
            <!-- <el-button type="primary" @click="handleConfirm">应用</el-button> -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref} from "vue";
    import {engineDict, localeDict,} from "~/utils/Dict.ts"
    import {useVoiceStore} from "~/stores/voice.ts"
    const voice = useVoiceStore()
    const voiceDict = ref([{
        value: 0,
        label: "Microsoft Huihui Desktop"
    }])
    /**
     * @author yhl 2025/12/25 10:41
     * @description 确认
     */
    const handleReset = () => {
        voice.$reset()
    }
    const handleTry = ()=>{
        const utterance = new SpeechSynthesisUtterance(voice.remark);
        utterance.pitch = voice.pitch;
        utterance.rate = voice.rate;
        utterance.volume = voice.volume;
        speechSynthesis.speak(utterance);
    }
</script>

<style scoped lang="scss">
    .set {
        width: 100%;
        
        .btns-box {
            display: flex;
            justify-content: flex-end;
            gap: $grid-2;
        }
    }
</style>