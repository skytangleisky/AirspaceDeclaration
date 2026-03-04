<template>
    <div class="workRecord">
        <div class="search-box box-container">
            <el-form-item label="作业时间"  style="width: 4rem">
                <el-date-picker
                   
                    v-model="searchForm.dateRange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    @change="changeDate"
                />
            </el-form-item>
        </div>
        <div class="table-box box-container">
            <el-table :data="tableData">
                <template v-for="(item,index) in tableColumns" :key="index">
                    <el-table-column :prop="item.prop" :label="item.label">
                    
                    </el-table-column>
                </template>
            </el-table>
            <el-pagination
                v-model:current-page="pageData.currentPage"
                v-model:page-size="pageData.pageSize"
                :page-sizes="[5, 10, 20, 30]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { 历史作业数据 } from '~/api/天工'
    
    const searchForm = reactive({
        dateRange:[""]
    })
    const pageData = reactive({
        currentPage: 1,
        pageSize: 10,
        total: 0
    })
    const tableData = ref([])
    const tableColumns = [{
        prop: 'strName',
        label: '作业点'
    }, {
        prop: 'strWeapon',
        label: '设备'
    },{
        prop: 'tmApplyRev',
        label: '批复时间'
    },]
    const getList = () => {
        const params= {
            range:searchForm.dateRange,
            page: pageData.currentPage,
            size: pageData.pageSize
        }
        历史作业数据(params).then(res => {
            //console.log('历史作业记录',params.range, res.data)
            tableData.value = res.data.results
            pageData.total = res.data.total
        })
    }
    const handleSizeChange = (val: number) => {
        getList()
    }
    const handleCurrentChange = (val: number) => {
        getList()
    }
    const changeDate = (val: number) => {
        getList()
    }
    
    /**
     * @author yhl 2026/3/3 14:30
     * @description 设置默认时间范围 取值为一年
     */
    const setDefaultDateRange = () => {
        const today = new Date();
        const oneYearAgo = new Date(today);
        
        // 设置为一年前
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        // 处理闰年2月29日的情况
        // 如果今天是闰年的2月29日，一年前可能是2月28日或3月1日
        if (today.getMonth() === 1 && today.getDate() === 29) {
            oneYearAgo.setDate(28); // 设置为2月28日
        }
        
        const year = oneYearAgo.getFullYear();
        const month = String(oneYearAgo.getMonth() + 1).padStart(2, '0');
        const day = String(oneYearAgo.getDate()).padStart(2, '0');
        const todayString = `${year+1}-${month}-${day}`
        const oneYearAgoString = `${year}-${month}-${day}`
        searchForm.dateRange.length=0
        searchForm.dateRange.push( oneYearAgoString,todayString)
        
    }
    const init = () => {
        setDefaultDateRange()
        getList()
    }
    init()
</script>

<style scoped lang="scss">
    .workRecord {
        height: 100%;
        width: 100%;
        background-color: var(--bg-color-1);
        display: grid;
        grid-template-rows: auto 1fr;
        gap: $grid-3;
    }
    
    .box-container {
        background-color: var(--el-bg-color);
        padding: $grid-3;
        border-radius: $border-radius-1;
    }
    .table-box{
        overflow-y: auto;
    }
    
    .el-form-item {
        margin-bottom: 0;
    }
    
    .el-pagination {
        margin-top: $grid-3;
    }
</style>