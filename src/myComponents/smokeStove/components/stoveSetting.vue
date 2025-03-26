<template>
    <div class="stoveSetting module-box">
        <div class="module-top">
            <div class="module-title">设置</div>
            <div class="module-title-decoration"></div>
        </div>
        <div class="module-bottom">
            <div class="form-item">
                <div class="item-title">预约点火</div>
                <div class="item-content">
                    <el-form :model="appointForm" label-width="auto" inline>
                        <el-form-item label="间隔">
                            <el-input-number
                                :min="0"
                                v-model="appointForm.interval"
                            >
                                <template #suffix>
                                    <span>分钟</span>
                                </template>
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="每次点燃">
                            <el-input-number :min="0" v-model="appointForm.num"
                                ><template #suffix>
                                    <span>支</span>
                                </template></el-input-number
                            >
                        </el-form-item>
                        <el-form-item label="点火次数">
                            <el-input-number
                                :min="0"
                                v-model="appointForm.total"
                            ></el-input-number>
                        </el-form-item>

                        <el-form-item label="起始时间">
                            <el-date-picker
                                v-model="appointForm.time"
                                type="datetime"
                                placeholder="请选择起始时间"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">开始预约</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="form-item">
                <div class="item-title">即时点火</div>
                <div class="item-content">
                    <el-form :model="immedForm" label-width="auto" inline>
                        <el-form-item label="烟条个数">
                            <el-input-number :min="0" v-model="immedForm.num"
                                ><template #suffix>
                                    <span>支</span>
                                </template>
                            </el-input-number>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary">开始点火</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="form-item">
                <div class="item-title">烟炉装载及卸载</div>
                <div class="item-content">
                    <el-form :model="stoveLoadForm" label-width="auto" inline>
                        <el-form-item>
                            <el-select
                                v-model="stoveLoadForm.loadNum"
                                placeholder="请选择装载烟炉"
                               
                            >
                                <el-option
                                    v-for="item in stoveOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                            <el-button type="primary" class="l-btn">装载烟炉</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-select
                                v-model="stoveLoadForm.unloadNum"
                                placeholder="请选择卸载烟炉"
                               
                            >
                                <el-option
                                    v-for="item in stoveOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                            <el-button type="primary" class="l-btn">卸载烟炉</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-input-number
                                :min="1"
                                v-model="stoveLoadForm.smokeBarIndex"
                            >
                            </el-input-number>
                            <el-button type="primary" class="l-btn">卸载烟条</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="form-item">
                <div class="item-title">系统时间设置及查询</div>
                <div class="item-content">
                    <el-form :model="systenInfo" label-width="auto" inline>
                        <el-form-item>
                            <el-button type="primary">查询时间</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker
                                v-model="systenInfo.time"
                                type="datetime"
                                placeholder="请选择时间"
                            />
                            <el-button type="primary"  class="l-btn">设置时间</el-button>
                        </el-form-item>
                        
                    </el-form>
                </div>
            </div>
            <div class="form-item">
                <div class="item-title">信息获取</div>
                <div class="item-content">
                    <el-form :model="systenInfo" label-width="auto" inline>
                        <el-form-item>
                            <el-button type="primary">查询站点信息</el-button>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="primary">查询站点气象信息</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { vue, reactive } from "vue";
// 预约点火
let appointForm = reactive({
    time: null,
    interval: 10,
    num: 1,
    total: 2,
});
// 即时点火
let immedForm = reactive({
    num: 1,
});
// 烟炉装载及卸载
let stoveLoadForm = reactive({
    loadNum: "第一个烟炉",
    unloadNum: "第一个烟炉",
    smokeBarIndex: 1,
});
// 系统时间设置及查询
let systenInfo = reactive({
    time:null
})
// 烟炉配置项
let stoveOptions = reactive([
    {
        label: "第一个烟炉",
        value: "1",
    },
    {
        label: "第二个烟炉",
        value: "2",
    },
    {
        label: "第三个烟炉",
        value: "3",
    },
    {
        label: "所有烟炉",
        value: "4",
    },
]);
</script>

<style lang="scss" scoped>
.stoveSetting {
    overflow-y: auto;
    .form-item{ 
        .el-select{
            width: 1.6rem;
        }
        :deep(.el-date-editor--datetime){
            width:2.04rem;
        }

        &:not(:last-child){
            margin-bottom: $grid-1;
        }
        .item-title{
            margin-bottom: $grid-1;
            color: var(--el-text-color-primary);

        }
        .l-btn{
            margin-left: $grid-1;
        }
    }
}
</style>
