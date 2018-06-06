<template>
    <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="currentPage" :page-sizes="pageSize" :page-size="currentSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        props: {
            pageSize: {
                type: Array, default: function () {
                    return [10, 20, 50, 100, 200]
                }
            },
            totalRecords: {type: Number, default: 0}
        },
        data() {
            return {
                currentPage: 1,
                currentSize: 10
            }
        },
        watch: {
            currentSize(val) {
                this.currentPage = 1;
                let from = this.currentPage - 1;
                let to = val;
                this.page(from, to);
            },
            currentPage(val) {
                let from = val == 1 ? 0 : val * this.currentSize - this.currentSize + 1;
                let to = (from + this.currentSize);
                this.page(from, to)
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
                this.$emit('currentSize', val);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            page(from, to) {
                this.$emit('paginate', {from, to})
            }
        }
    }
</script>