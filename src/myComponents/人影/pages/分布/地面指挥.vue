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
            <el-checkbox v-model="setting.人影.监控.zyd">
                <div style="display: flex;align-items: center;">作业点图层</div>
            </el-checkbox>
            <el-checkbox v-model="moveStation">
                <div style="display: flex;align-items: center;"><div class="移动点"></div>移动点</div>
            </el-checkbox>
            <el-checkbox v-model="fixedStation">
                <div style="display: flex;align-items: center;"><div class="固定点"></div>固定点</div>
            </el-checkbox>


            <el-checkbox v-model="setting.人影.监控.正西">
                <div style="display: flex;align-items: center;">正西</div>
            </el-checkbox>
            <!-- <el-checkbox v-model="setting.人影.监控.西北">
                <div style="display: flex;align-items: center;">西北</div>
            </el-checkbox> -->
            <el-checkbox v-model="setting.人影.监控.西南">
                <div style="display: flex;align-items: center;">消云</div>
            </el-checkbox>

            <el-checkbox v-model="setting.人影.监控.test">
                <div style="display: flex;align-items: center;">消云试验点</div>
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
    const flyArea = computed({
        get(){
            return setting.人影.监控.ryAirspaces.base
        },
        set(val){
            setting.人影.监控.ryAirspaces.base = val
            setting.人影.监控.ryAirspaces.line = val
            setting.人影.监控.ryAirspaces.label = val
        }
    })
    const moveStation = computed({
        get(){
            return setting.人影.监控.zydTag == '移动作业点'
        },
        set(val){
            if(val){
                setting.人影.监控.zydTag = '移动作业点'
            }else{
                setting.人影.监控.zydTag = 'all'
            }
        }
    })
    const fixedStation = computed({
        get(){
            return setting.人影.监控.zydTag == '固定作业点'
        },
        set(val){
            if(val){
                setting.人影.监控.zydTag = '固定作业点'
            }else{
                setting.人影.监控.zydTag = 'all'
            }
        }
    })
    // const 西南主力量 = computed({
    //     get(){
    //         return setting.人影.监控.zydTag == '西南主力量'
    //     },
    //     set(val){
    //         if(val){
    //             setting.人影.监控.zydTag = '西南主力量'
    //         }else{
    //             setting.人影.监控.zydTag = 'all'
    //         }
    //     }
    // })
    // const 正西辅助力量 = computed({
    //     get(){
    //         return setting.人影.监控.zydTag == '正西辅助力量'
    //     },
    //     set(val){
    //         if(val){
    //             setting.人影.监控.zydTag = '正西辅助力量'
    //         }else{
    //             setting.人影.监控.zydTag = 'all'
    //         }
    //     }
    // })
    // const 消云 = computed({
    //     get(){
    //         return setting.人影.监控.zydTag == '消云'
    //     },
    //     set(val){
    //         if(val){
    //             setting.人影.监控.zydTag = '消云'
    //         }else{
    //             setting.人影.监控.zydTag = 'all'
    //         }
    //     }
    // })
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
            display: grid;
            grid-template-columns: repeat(3,1fr);
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: -$grid-1;
        }
    }
    .移动点{
        background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAADZUlEQVR42u3dO3bCQBBFQS3Z+0+EA2e24WgY1L8KLgt4PRUQ6TjP81B8x9f3z0/2SHQXI+TCAQkgAgQQreOABBABAojWcUACiPEBAUTrOCABBBBAANE6DkgAAQQQQLSOAxJAAAEEEDjWcUACCCCAAAIHJIAIEEAUgQMSQAABBBA4IAFEgACiCByQAAIIIIDAAQkggAACiCJwQAIIIJAAAgcggAACCSBwAAKIkgKBBBA4AAEEEEgAgQMQQOCABBBAAAFEdXBAAggggAACBySAAAIIIHBAAggggAACR83cDxBAAAEEDkgAAQQQQOCABBBAAAEEDkgAAQQQQNQdBySAAAIIIHBAAggggAACBySAAAIIIHBAAggggAACByQyAiCAAAIHJIAAAgggcEACCCCAAAIHJIAAAgggcEACCCCAAAKHIAEEEEAAgQMSQAABBBA4IAEEEEAAgQMSQAABBBA4IAEEEAEChyABxMMGBBA4IAEEEEAAgQMSQAABBBA4IAEEEEAAgUPTkAAiQKYB8WghAQQQQACBAxJAAIEEEDgAAQQQNUMChwABRJAMBuJBAgIIIJAAAgcggMABCSCACBA41BwJIAKkGxCPDhJAAAEEEDggAQQQAQKHOiIBRIB0AOJxQQIIIIAAAofqIAFEgFQG4jFBAggggAACh+ohAUSAVATi8UACCCACBA7VRQKIAKkExGOBBBBABAgcqo8EEAFSAYjHoYxIABEg2YF4FMqKBBABkhmIx6DMSAARIFmBeATKjgQQAZIRiOOrAhJABEg2II6uKkgAESCZgDi2KiEBRIBkAeLIqoYEEAGSAYjjqiISQARINBBHVVUkgAiQSCCOqcpIABEgUUAcUdWRACJAIoA4njogAUSA3A3E0dQFCSAC5E4gjqVOSAARJHcBcSABAogGIYFDgAAiSAKBOIgAAUQDkcAhQD4FxBHUHQkgAuQTQIyvCUgAESC7gRhdU5AAIkB2AjG2JiEBRIDsAmJkTUMCiADZAcS4mogEEAHyLhCjaioSQATIO0CMqclIABEgq0CMqOlIABEgK0CMJ0gAka4DMZogAUS6DsRYggQQ6ToQIwkSQKTrQIwj/UYCiPQKiFGkv5EAIj0DYgzpfySASIBIixlBAkQCRNr+H2TnR9elbhlBetIDZSxJXqY4J8YAAAAASUVORK5CYII=);
        width: 22px;
        height: 22px;
        background-repeat: round;
    }
    .固定点{
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAADNklEQVR42u3dO27DQBBEQR3Z909op4YECCR3lvOp4CkWerZivo7jeGlNr5+/nwdzg4CbGqEeBHAAAQIYQIAABhAwQAEEClgAgQIWQMAQKMOAeNygAAIGKICAAQsgYEACCBigAAIGKIDAob5IwBAoXYB4aJAAAgYogMABCSBwqDwSMARKJSAeDCSAwKEiSOAQJNmBeBjKCgUMQZIRiAegCkjgECSZgDi4KiGBQ5BkAOLAqogEDkECiCBJCsQxBQgcaooEDkGyG4jDqQsSOAQJIAIkARCHUjckcAiSaCAOo65IABEgkUAcRJ2RwCFIABEgm4E4gCYggUOQACJANgExuCYhAUSArAJiaE1DAoggWQHEuAIEEAFyHohhNRUJIALkDhCDajISQATIVSCG1HQkgAiQK0AMKEgAESCASEuBGE6QACIBIt1BAocEiLQAiKEECSASIBIg0i4gBpLekQAiASIBIsUAMYz0GQkgEiASIBIgEiBSEiRwSIBIgEiASIBIgEiASKWRACIBIgEiASIBIgEiASIBIgEiASIJEAkQCRAJEAkQCRAJEAkQCRAJEENIn3AAIgEiASIBIgEiZQLiAzoSINJpHIBIgEiASIBIjwCBRHrHAYgEiASIFAsEEsHxHwcgEiASIFI8EEgEByDSdSCQCBBApK84AJGuAIFEcAAiASKFAIFE03EAIkDuAIFEk3EAIkDuAoFEU3EAIkBWAIFEgAAiOAARICFAINE0HKeBQCJAABEc14FAoik4ABEgEUAg0QQct4BAou44ABEgkUAgUWccS4BAIkAA0UAcy4BAoo44lgKBRN1wLAcCiQABRENwhACBRF1whAGBRB1whAKBRNVxhAOBRJVxbAECiQABRA1xbAMCiSri2AoEElXDsR0IJKqE4xEgkKgKjseAQKIKOB4FAomy43gcCCTKjCMFEFCUEUY6IJAoG450QCCBAxBIVARHWiCQwAEIKGAUqMaf9KDgAAQSOAABBQxAQFF1GOWBQAIHIKCAAQgocAACCRiAwAIGIKBAMeDNjAICChiAgAIGILBAAQgsYAACChSAAAMEIMAAAYiKoHELQMbjsSkgUop+AQB3ngMAZaT8AAAAAElFTkSuQmCC);
        width: 22px;
        height: 22px;
        background-repeat: round;
    }
</style>