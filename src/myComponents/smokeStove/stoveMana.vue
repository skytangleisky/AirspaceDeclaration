<template>
    <!-- 烟炉管理 -->
    <div class="stoveMana page-content">
        <avue-crud :option="option" :data="data"></avue-crud>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
let data = [
    {prop2:'白石岗烟炉',prop4:'115850000E3978000N',prop5:110111084,prop6:1},
    {prop2:'白石岗烟炉',prop4:'115850000E3978000N',prop5:110111084,prop6:1},
    {prop2:'白石岗烟炉',prop4:'115850000E3978000N',prop5:110111084,prop6:1},

]; //显示的数据
const option = ref({
    searchMenuSpan: 4, //控制搜索按钮的长度
    labelWidth: 160,
    excelBtn:true, //导出按钮
    viewBtn:true,
    gridBtn:false,//卡片模式切换按钮
    column: [
        {
            label: "ID",
            prop: "prop1",
            hide:true,
        },
        {
            label: "名称",
            prop: "prop2",
        },
        {
            label: "作业点",
            prop: "prop3",
            hide:true,
        },
        {
            label: "位置",
            prop: "prop4",
        },
        {
            label: "上级单位",
            prop: "prop5",
            display:false,
        },
        {
            label: "烟炉类型",
            prop: "prop6",
            value:1,
            type: "select",
            dicData:[
                {
                    label:'普通烟炉',
                    value:1
                },
                {
                    label:'自动烟炉',
                    value:2
                }
            ]
        },
    ],
});
</script>

<style lang="scss" scoped>
.stoveMana {
}
</style>
