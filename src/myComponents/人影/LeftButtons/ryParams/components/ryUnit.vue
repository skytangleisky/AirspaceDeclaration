<template>
    <div class="ryUnit">
        <avue-crud
            ref="crudRef"
            v-model="form"
            v-model:page="pageData"
            :option="avueOption"
            :data="tableData"
            @search-change="handleSearch"
            @row-save="handleAdd"
            @row-del="handleDel"
            @row-update="handleUpdate"
            @row-view="handleView"
            @search-reset="searchReset"
            @on-load="getDataList"
        >
        
        </avue-crud>
    </div>
</template>

<script setup lang="ts">
    import {reactive, ref} from 'vue'
    import {del, getList, update, add, getSuperiorUnit} from "~/api/人影/ryUnit.ts"
    import {ElMessage, ElMessageBox} from "element-plus";
    import {Dict} from "~/api/type.ts";
    import {ubyTypeDict, connectTypeDict, unitReportDict} from "~/utils/Dict.ts"
    
    const strMgrDict = ref<Dict[]>([]) //上级单位字典
    
    let tableData = ref<any[]>([]) //表格渲染数据
    let form = reactive({})
    let pageData = reactive({
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 50],
        layout: "total,prev, pager, next,jumper",
    })
    const avueOption = reactive({
        refreshBtn: false, //表格顶部右侧刷新数据按钮
        columnBtn: false, //表格顶部右侧表格列操作按钮
        searchShowBtn: false, //表格顶部右侧表格搜索显隐按钮
        gridBtn: false, // 表格顶部右侧卡片模式切换按钮
        index: true, //是否显示序号
        indexLabel: '序号', // 并将索引字段设置为“序号”，默认是“#”
        indexWidth: 60,
        viewBtn: true,
        searchMenuPosition: "center", //搜索按钮位置
        searchMenuSpan: 8, // 搜索按钮长度(搜索和清空按钮长度，两按钮居中)
        searchSpan: 8, // 搜索框长度最大长度24（每项搜索内容长度，包括字段名+文本框）
        searchGutter: 0,//搜索项间隔
        searchLabelWidth: 60,
        labelWidth:120, //menuWidth: 300,//操作栏宽度
        menuFixed: false, // 操作栏是否固定
        page: true,
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
            dicData: unitReportDict,
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
    let searchForm = reactive({})
    
    
    /**
     * @author yhl 2025/12/10 16:48
     * @description 新增
     * @params
     */
    const handleAdd = async (row: any, done: any) => {
        let params = {...row}
        try {
            
            await add(params)
            done()
            ElMessage.success('新增成功')
            await getStrMgrDict()
            await getDataList()
        } catch (err) {
            ElMessage.error("新增失败" + err)
        }
    }
    
    
    /**
     * @author yhl 2025/12/10 16:55
     * @description 删除
     * @params
     */
    const handleDel = async (row: any, index: number, done: any) => {
        ElMessageBox.confirm(`确认要删除（${row.strName}）吗？`, "提示", {}).then(async () => {
            let params = {strID: row.strID}
            try {
                await del(params)
                done()
                ElMessage.success('删除成功')
                await getDataList()
            } catch (err) {
                ElMessage.error("删除失败" + err)
            }
            
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
    }
    
    /**
     * @author yhl 2025/12/10 17:01
     * @description 查询
     * @params
     */
    const handleView = async (row: any) => {
    
    }
    
    /**
     * @author yhl 2025/12/10 17:02
     * @description 重置
     * @params
     */
    const searchReset = async () => {
        searchForm = {}
        await getDataList()
    }
    /**
     * @author yhl 2025/12/10 16:59
     * @description 编辑
     * @params
     */
    const handleUpdate = async (row: any, index: number, done: any) => {
        row['[strID]'] = row.strID
        delete row.strID
        delete row.strMgrIDname
        let params = {...row}
        console.log("update", params)
        try {
            await update(params)
            ElMessage.success("编辑成功")
            done()
            await getDataList()
        } catch (err) {
            ElMessage.error("编辑失败" + err)
        }
    }
    /**
     * @author yhl 2025/12/10 16:46
     * @description 搜索
     * @params
     */
    const handleSearch = async (sForm: any, done: any) => {
        pageData.currentPage = 1
        searchForm = sForm
        await getDataList()
        done()
    }
    
    /**
     * @author yhl 2025/12/10 16:45
     * @description 分页查询
     * @params
     */
    const getDataList = async () => {
        let params = {
            ...searchForm,
            pageSize: pageData.pageSize,
            currentPage: pageData.currentPage
        }
        //console.log("getDataList", params)
        const res: any = await getList(params)
        const data = res.data
        tableData.value = data.results
        pageData.total = data.total
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
    }
    initData()
</script>

<style scoped lang="scss">
    .ryUnit {
        width: 100%;
    }
</style>