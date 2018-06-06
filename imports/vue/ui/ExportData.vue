<template>
    <div class="exportData">
        <el-row>
            <el-col :span="24" style="padding: 20px;">
                <el-tabs type="card" @tab-click="handleClick">
                    <el-tab-pane label="Unpaid Customer">
                        <unpaid-customer-export></unpaid-customer-export>
                    </el-tab-pane>
                    <el-tab-pane label="Config">Config</el-tab-pane>
                    <el-tab-pane label="Role">Role</el-tab-pane>
                    <el-tab-pane label="Task">Task</el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import UnpaidCustomerExport from '/imports/vue/components/unpaidCustomerExport/UnpaidCustomerExport.vue';
    export default {
        components: {
            UnpaidCustomerExport
        },
        data() {
            return {
                activeName: 'first'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>