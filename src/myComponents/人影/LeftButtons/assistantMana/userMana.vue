<template>
    <!--     数据管理-->
    <div class="dataMana page-content">
        <avue-crud ref="crudRef"
                   v-model="form"
                   v-model:page="pageData"
                   :option="avueOption"
                   :data="tableData"
                   :permission="permission"
                   @row-save="rowSave"
                   @row-update="rowUpdate"
                   @search-reset="searchReset"
                   @row-del="rowDel"
                   @row-view="rowView"
                   @search-change="searchChange"
                   @on-load="getDataList"
        >
            <template #auth_group="{row}">
                <el-tag style="margin-right: 4px" type="primary"  size="small" v-for="item in row.auth_group"
                        :key="item">{{ userGroupObj[item] }}
                </el-tag>
            </template>
        </avue-crud>
    </div>
</template>

<script setup lang="ts">
    import {reactive, ref} from 'vue'
    import {ElMessage, ElMessageBox} from 'element-plus'
    import {Dict} from "~/api/type.ts"
    //import {getDict} from "~/api/人影/role.ts";
    import {del, getList, update, add} from "~/api/人影/user.ts"
    const permission = ref({});
    interface DictType {
        value: string | number | boolean,
        label: string
    }
    
    let userGroupDict = ref<DictType[]>([]) //用户组字典
    let userGroupObj = reactive({})
    let tableData = ref<any[]>([]) //表格渲染数据
    let form = reactive({})
    
    let pageData = reactive({
        total: 0,
        pageSize: 5,
        currentPage: 1,
        layout: "total,prev, pager, next,jumper",
    })
    const avueOption = reactive({
        refreshBtn: false, //表格顶部右侧刷新数据按钮
        columnBtn: false, //表格顶部右侧表格列操作按钮
        searchShowBtn: false, //表格顶部右侧表格搜索显隐按钮
        gridBtn: false, // 表格顶部右侧卡片模式切换按钮
        index: true, //是否显示序号
        viewBtn: true,
        searchMenuPosition: "center", //搜索按钮位置
        searchMenuSpan: 8, // 搜索按钮长度(搜索和清空按钮长度，两按钮居中)
        searchSpan: 8, // 搜索框长度最大长度24（每项搜索内容长度，包括字段名+文本框）
        searchGutter: 0,//搜索项间隔
        searchLabelWidth: 60,
        labelWidth: 120, //menuWidth: 300,//操作栏宽度
        page: true,
        column: [{
            label: 'ID',
            prop: 'strUnitID',
            display: false,//弹窗中隐藏
            hide: true,
        }, {
            label: '账号',
            prop: 'strCode',
            search: true,
            rules: [{
                required: true,
                message: "请输入账号",
                trigger: "blur",
            }]
        }, {
            label: "用户名",
            prop: 'strName',
            search: true,
            rules: [{
                required: true,
                message: "请输入姓名",
                trigger: "blur",
            }]
        }, {
            label: '联系电话',
            prop: 'strPhoneNum',
        },  {
            label: '密码',
            prop: 'password',
            hide: true,
            value: '',
            viewDisplay: false,
            rules: [{
                required: true,
                message: "请输入密码",
                trigger: "blur",
            }]
        }, {
            label: '角色',
            prop: 'roles',
            type: 'checkbox',
            slot: true,
            dicData: userGroupDict.value,
            rules: [{
                type: 'array',
                required: true,
                message: "请选择角色",
                trigger: "change",
            }]
        },]
    })
    let searchForm = reactive({})
    
    
    //点击查看按钮
    function rowView(row: any) {
    
    }
    
    /**
     * @author yhl 2025/8/12 14:17
     * @description 添加用户
     */
    async function rowSave(row: any, done: any) {
        let params = {...row
        }
        try {
            await add(params)
        } catch {
        
        }
        await getDataList()
        done()
    }
    
    
    /**
     * @author yhl 2025/8/20 10:33
     * @description 单一删除
     */
    function rowDel(row: any, index: number, done: any) {
        ElMessageBox.confirm(`确认要删除${row.real_name}的信息吗？`, "提示", {}).then(async () => {
            let params = {ids: [row.id]}
            await del(params)
            await getDataList()
            done()
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
        
    }
    
    
    /**
     * @author yhl 2025/8/20 10:31
     * @description 点击编辑按钮 编辑数据
     */
    async function rowUpdate(row: any, index: number, done: any) {
        let params = {...row
        }
        await update(params)
        ElMessage.success("编辑成功")
        await getDataList()
        done()
    }
    
    const searchReset = () => {
        searchForm = {}
        getDataList()
    }
    
    /**
     * @author yhl 2025/8/20 10:43
     * @description 搜索
     * @params
     */
    const searchChange = async (sform: any, done: any) => {
        pageData.currentPage = 1
        searchForm = sform
        await getDataList()
        done()
    }
    
    /**
     * @author yhl 2025/8/12 13:11
     * @description 获取所有用户组
     */
    const getUserGroupDict = () => {
        userGroupDict.value.length = 0
        
    }
    /**
     * @author yhl 2025/8/12 13:33
     * @description 分页查询获取用户数据
     * @params
     */
    const getDataList = async () => {
        let params = {
            ...searchForm,
            page_size: pageData.pageSize,
            current_page: pageData.currentPage
        }
        //const res = await getList(params)
        //tableData.value = res.records
        //pageData.total = res.total_items
    }
    //初始化页面所需数据
    const init = () => {
        //getUserGroupDict()
        //permission.value = setPermission("user")
    }
    init()
</script>

<style lang="scss" scoped>
    .userMana {
    width: 100%;
    }
</style>
