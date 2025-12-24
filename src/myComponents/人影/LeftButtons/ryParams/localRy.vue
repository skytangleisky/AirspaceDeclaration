<template>
    <div class="localRy">
        <avue-form :option=avueOption v-model="addForm" @submit="handleSubmit">
        
        </avue-form>
    </div>
</template>

<script setup lang="ts">
    import {reactive, onMounted, ref} from 'vue';
    import {connectTypeDict, ubyTypeDict, yesNoDict} from "~/utils/Dict.ts";
    import {Dict} from "~/api/type.ts";
    import {getSuperiorUnit, add} from "~/api/人影/ryUnit.ts";
    import {ElMessage} from "element-plus";
    
    let addForm = reactive({})
    let defaultForm = {
        strID:'',
        strName:'',
        ubyType:0,
        strMgrID:'',
        bReport:1,
        connectType:1,
        strPos:'',
        strPhoneNo:'',
        vStrReportZyd:'',
        strAddress:'',
        strMark:'',
    }
    const strMgrDict = ref<Dict[]>([]) //上级单位字典
    const avueOption = reactive({
        labelWidth: 120, //menuWidth: 300,//操作栏宽度
        column: [{
            label: '代码',
            prop: 'strID', //display: false,//弹窗中隐藏
            //hide: true,
            search: true,
            width: 100,
        }, {
            label: '名称',
            prop: 'strName',
            search: true,
        }, {
            label: '类型',
            prop: 'ubyType', //search: true,
            type: 'select',
            slot: true,
            dicData: ubyTypeDict,
            value: 0
        }, {
            label: "上级单位",
            prop: 'strMgrID',
            type: 'select',
            dicData: strMgrDict.value,
            width: 120
        }, {
            label: "通报",
            prop: 'bReport', //search: true,
            type: "select",
            dicData: yesNoDict,
            value: 1,
        }, {
            label: '连接方式',
            prop: 'connectType',
            type: "select",
            dicData: connectTypeDict,
            value: 1,
        }, {
            label: "经纬度",
            prop: 'strPos',
            width: 170,
        }, {
            label: "联系电话",
            prop: 'strPhoneNo',
            hide: true,
        }, {
            label: "负责人",
            prop: 'vStrReportZyd',
            hide: true,
        }, {
            label: "单位地址",
            prop: 'strAddress',
            hide: true,
        }, {
            label: "备注",
            prop: 'strMark',
            hide: true,
        },]
    })
    
    const handleSubmit = async (form: any, done: any) => {
        try {
            console.log("submit", form)
            await add(form)
            done()
            ElMessage.success('新增成功')
            Object.assign(addForm,defaultForm)
            await getStrMgrDict()
        } catch (err) {
            ElMessage.error("新增失败" + err)
            done()
        }
    }
    
    /**
     * @author yhl 2025/12/23 11:09
     * @description 获取上级单位字典
     */
    const getStrMgrDict = async () => {
        try {
            const res = await getSuperiorUnit()
            const data = res.data.results
            strMgrDict.value.length = 0
            data.forEach((item: { strID: string, strName: string }) => {
                let obj: Dict = {
                    value: item.strID,
                    label: item.strName
                }
                strMgrDict.value.push(obj)
            })
        } catch (err) {
        
        }
    }
    const initData = async () => {
        await getStrMgrDict()
        Object.assign(addForm,defaultForm)
    }
    initData()
</script>

<style scoped lang="scss">
    .localRy {
        width: 100%;
    }
</style>