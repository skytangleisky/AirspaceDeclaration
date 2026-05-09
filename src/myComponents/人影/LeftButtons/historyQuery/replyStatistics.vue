<template>
    <div class="jobHistory">
        <avue-crud
            ref="crudRef"
            v-model="form"
            v-model:page="pageData"
            :option="avueOption"
            :data="tableData"
            @search-change="handleSearch"
            @search-reset="searchReset"
            @on-load="getDataList"
        >
        </avue-crud>
    </div>
</template>

<script setup lang="ts">
    import {reactive, ref} from 'vue'
    import { getList } from "./replyStatisticsApi.ts"
    import {ElMessage, ElMessageBox} from "element-plus";
    import {Dict} from "~/api/type.ts";
    import {ubyTypeDict, connectTypeDict, yesNoDict} from "~/utils/Dict.ts"
    import {queryRyUnitList} from "../ryParams/localRyApi.ts"
    const strMgrDict = ref<Dict[]>([]) //上级单位字典
    let tableData = ref<any[]>([]) //表格渲染数据
    let form = reactive({})
    let pageData = reactive({
        total: 0,
        pageSize: 5,
        currentPage: 1,
        layout: "total,prev, pager, next,jumper",
    })
        // <el-table-column label="批复率(%)" prop="批复率" sortable />
        // <el-table-column label="批准率(%)" prop="批准率" sortable />
    const avueOption = reactive({
        emptyBtn:false,
        addBtn:false,
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
        searchLabelWidth: 80,
        labelWidth:120, //menuWidth: 300,//操作栏宽度
        menuFixed: false, // 操作栏是否固定
        menu:false,
        page: true,
        column: [{
            label: '作业点编码',
            prop: 'strZydID', //display: false,//弹窗中隐藏
            //hide: true,
            search: false,
            width: 150,
        },{
            label: '作业点名称',
            prop: 'strName', //display: false,//弹窗中隐藏
            //hide: true,
            search: false,
            width: 300,
        },
        {
            label: '申请次数',
            prop: '申请次数',
            search: false,
            width:100
        },
        {
            label: '批复次数',
            prop: '批复次数',
            search: false,
            width:100
        },
        {
            label: '批准次数',
            prop: '批准次数',
            search: false,
            width:100
        },
        {
            label: '不批准次数',
            prop: '不批准次数',
            search: false,
            width:100
        },
        {
            label: '批复超时次数',
            prop: '批复超时次数',
            search: false,
            width:120
        },
        {
            label: '批复率(%)',
            prop: '批复率',
            search: false,
            width:100
        },
        {
            label: '批准率(%)',
            prop: '批准率',
            search: false,
            width:100
        },
    ]
    })
    let searchForm = reactive({})
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
            query:searchForm,
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
            const res = await queryRyUnitList()
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
    .jobHistory {
        width: 100%;
    }
</style>