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
                   @row-update="handleUpdate"
                   @search-reset="searchReset"
                   @row-del="rowDel"
                   @row-view="rowView"
                   @search-change="handleSearch"
                   @on-load="getDataList"
        >
            <template #roles="{row}">
                <el-tag v-if="row.roles && row.roles.length >0 " style="margin-right: 4px" type="primary" size="small"
                        v-for="item in row.roles"
                        :key="item">{{ getRoleName(item) }}
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
    //用户组字典
    let rolesDict = ref<Dict[]>([{
        value: "admin",
        label: '超级管理员'
    }])
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
            hide: true,
        }, {
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
            dicData: rolesDict.value,
            rules: [{
                type: 'array',
                required: true,
                message: "请选择角色",
                trigger: "change",
            }]
        },]
    })
    let searchForm = reactive({})
    
    
    /**
     * @author yhl 2025/12/25 11:16
     * @description 转译角色
     * @params
     */
    const getRoleName = (val: string | number) => {
        if (!val) return
        const index = rolesDict.value.findIndex(item => {
            return item.value === val
        })
        if(index === -1) return
        return rolesDict.value[index].label
    }
    
    //点击查看按钮
    function rowView(row: any) {
    
    }
    
    /**
     * @author yhl 2025/8/12 14:17
     * @description 添加用户
     */
    async function rowSave(row: any, done: any) {
        let params = {...row}
        try {
            await add(params)
            done()
            ElMessage.success('新增成功')
            await getDataList()
        } catch (err) {
            ElMessage.error("新增失败" + err)
        }
    }
    
    
    /**
     * @author yhl 2025/8/20 10:33
     * @description 单一删除
     */
    function rowDel(row: any, index: number, done: any) {
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
     * @author yhl 2025/12/10 17:02
     * @description 重置
     * @params
     */
    const searchReset = async () => {
        searchForm = {}
        await getDataList()
    }
    /**
     * @author yhl 2025/8/20 10:31
     * @description 点击编辑按钮 编辑数据
     */
    const handleUpdate = async (row: any, index: number, done: any) => {
        row['[strID]'] = row.strID
        delete row.strID
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
     * @author yhl 2025/8/20 10:43
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
     * @author yhl 2025/8/12 13:11
     * @description 获取所有用户组
     */
    const getUserGroupDict = () => {
        rolesDict.value.length = 0
        
    }
    /**
     * @author yhl 2025/8/12 13:33
     * @description 分页查询获取用户数据
     * @params
     */
    const getDataList = async () => {
        let params = {
            ...searchForm,
            pageSize: pageData.pageSize,
            currentPage: pageData.currentPage
        }
        const res: any = await getList(params)
        const data = res.data
        console.log("getDataList", data)
        tableData.value = data.results
        pageData.total = data.total
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
