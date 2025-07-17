<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer"></svg-icon>
                <span>{{ props.title }}</span>
            </div>
            <div class="title-right">
                <slot name="select"></slot>
            </div>
        
        </div>
        
        <div class="tool-mode-content">
            <slot name="content"></slot>
            <template v-if="props.model==='radio'">
                <div class="tool-mode-item radio-item" v-for="(item,index) in props.renderDict" :key="item.value"
                     :class="{active:item.isActive}" @click="changeVal(item)">{{
                        item.label
                    }}
                </div>
            </template>
            <template v-if="props.model==='check'">
                <div class="tool-mode-item check-item" v-for="(item,index) in props.renderDict" :key="item.value"
                     :class="{active:item.isActive}" @click="changeVal(item)">
                    
                    <div class="check-box">
                        <el-icon size=".12rem" color="#fff" v-if="item.isActive">
                            <Check/>
                        </el-icon>
                    </div>
                    <svg-icon :name="item?.icon" v-if="item.icon"></svg-icon>
                    <div class="label">{{ item.label }}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {Check} from "@element-plus/icons-vue";
    import {ref, onMounted} from "vue";
    import SvgIcon from "~/myComponents/SvgIcon.vue";
    
    const emits = defineEmits(['change', "update:modelValue"])
    type ModelType = 'radio' | 'check'
    const props = defineProps({
        modelValue: {
            type: [String, Number, Boolean, Array],
            default: undefined,
        },
        model: {
            type: String as () => ModelType,
            default: "radio"
        },
        title: {
            type: String,
            default: '这是一个标题'
        },
        renderDict: {
            type: Array
        },
    })
    console.log("model", props.model)
    type Dict = {
        value: number, label: string, isActive: boolean, icon?: string
    }
    let newRenderDict = ref<Dict[]>([])
    onMounted(() => {
        newRenderDict.value = setAttrByRenderDict() as Dict[]
    })
    /**
     * @author yhl 2025/7/17 14:03
     * @description 给遍历对象添加默认属性值isActive
     * @params
     */
    const setAttrByRenderDict = () => {
        let newArr = props.renderDict
        //单选设置默认选中样式
        const setActiveRadio = () => {
            newArr?.forEach((item: any) => {
                item.isActive = props.modelValue == item.value;
            })
        }
        
        
        //多选设置默认选中样式
        const setActiveCheck = () => {
            newArr?.forEach((obj: any) => {
                obj.isActive = props.modelValue?.some((item: any) => obj.value == item)
            })
        }
        
        switch (props.model) {
            case "radio":
                setActiveRadio()
                break;
            case "check":
                setActiveCheck()
                break;
            default:
                break
        }
        return newArr
    }
    
    /**
     * @author yhl 2025/7/17 14:16
     * @description 修改表单值时的修改
     * @params
     */
    const changeVal = (item: Dict) => {
        //单选模式设置表单属性值
        const setFormValRadio = (item: Dict) => {
            newRenderDict.value.forEach((item: Dict) => {
                item.isActive = false
            })
            if (props.modelValue == item.value) {
                emits('update:modelValue', undefined)
            } else {
                emits('update:modelValue', item.value)
                item.isActive = true
            }
        }
        //多选模式设置表单属性值
        const setFormValCheck = (item: Dict) => {
            let newArr = [...props.modelValue]
            const index = newArr?.indexOf(item.value)
            if (index >= 0) {
                item.isActive = false
                newArr?.splice(index, 1)
            } else {
                item.isActive = true
                newArr?.push(item.value)
            }
            emits('update:modelValue', newArr)
        }
        
        switch (props.model) {
            case "radio":
                setFormValRadio(item)
                break;
            case "check":
                setFormValCheck(item)
                break;
            default:
                break
        }
    }

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
        
        .title-right {
        
        }
        
        .tool-mode-content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin-bottom: -$grid-1;
            
            .tool-mode-item {
                box-sizing: border-box;
                
                height: .24rem;
                line-height: .20rem;
                margin-bottom: $grid-1;
            }
            
            .radio-item {
                width: calc((100% - $grid-1 * 2) / 3);
                text-align: center;
                //border: 1px solid var(--el-border-color);
                border: 1px solid transparent;
                border-radius: $border-radius-1;
                
                &:not(:nth-child(3n)) {
                    margin-right: $grid-1;
                }
                
                &:hover {
                    border-color: var(--el-color-primary);
                }
            }
            
            .radio-item.active {
                background-color: var(--el-color-primary);
                border-color: var(--el-color-primary);
                color: #fff;
            }
            
            .check-item {
                width: calc((100% - $grid-1) / 2);
                
                &:not(:nth-child(2n)) {
                    margin-right: $grid-1;
                }
                
                display: flex;
                align-items: center;
                
                .check-box {
                    height: .12rem;
                    width: .12rem;
                    line-height: .12rem;
                    border-radius: .02rem;
                    border: 1px solid var(--el-border-color);
                    margin-right: .04rem;
                    
                    &:hover {
                        border-color: var(--el-color-primary);
                    }
                }
                
                .label {
                    margin-left: .04rem;
                }
            }
            
            .check-item.active {
                .check-box {
                    background-color: var(--el-color-primary);
                    border-color: var(--el-color-primary);
                }
                
            }
        }
        
    }
</style>