<template>
    <div>
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="0">
                                <span slot="title" style="width: auto !important;">
                                    Unpaid Customer Export <i class="header-icon el-icon-info"></i>
                                    Provides the ability to export all of unpaid customer to xlsx.
                                    <br>
                                </span>
                                <el-form :model="form" :inline="true" :rules="rules" ref="unpaidCustomerForm">
                                    <el-row type="flex" class="row-bg" justify="left">
                                        <el-switch
                                                :width="80"
                                                v-model="form.isPaid"
                                                on-text="Paid"
                                                off-text="Unpaid">
                                        </el-switch>
                                    </el-row>
                                    <el-row type="flex" class="row-bg" justify="left">
                                        <el-form-item label="As of Date" :class="{hidden: form.isPaid}">
                                            <el-date-picker
                                                    v-model="form.date"
                                                    type="date"
                                                    :picker-options="pickerDateOptions"
                                                    placeholder="Pick a day"
                                                    align="right">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="Date Range" :class="{hidden: !form.isPaid}">
                                            <el-date-picker
                                                    v-model="form.dateRange"
                                                    type="daterange"
                                                    placeholder="Pick a day"
                                                    align="right">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="Fields" prop="field">
                                            <el-select v-model="form.fields" multiple placeholder="Select"
                                                       class="select-width">
                                                <el-option
                                                        v-for="item in options"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button :loading="loading" @click="exportUnpaidCustomer" type="primary"
                                                       icon="caret-right"
                                                       size="small">Export to XLSX
                                            </el-button>
                                        </el-form-item>
                                    </el-row>

                                </el-form>

                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>

            </div>
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import moment from 'moment';
    import FileSaver from 'file-saver';

    export default {
        components: {
            a4: PageA4
        },
        data() {
            return {
                form: {
                    dateRange: [
                        moment().startOf('month').toDate(),
                        moment().endOf('month').toDate()
                    ],
                    isPaid: false,

                    date: moment().toDate(),
                    fields: ["customerName", "customerId", "streetNo", "sumId", "waterConsumption", "balance", "sumBarcode"]
                },
                rules: {
                    fields: [
                        {required: true, trigger: 'onBlur'}
                    ],
                    date: [
                        {required: true, trigger: 'onBlur'}
                    ]
                },
                activeName: '0',
                pickerDateOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: 'Today',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: 'Yesterday',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: 'A week ago',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                options: [{
                    label: 'Customer ID',
                    value: 'customerId'
                },
                    {
                        label: 'Customer Name',
                        value: 'customerName'
                    },
                    {
                        label: 'Street No',
                        value: 'streetNo'
                    },
                    {
                        label: 'DPC',
                        value: 'dpc'
                    },
                    {
                        label: 'SUMID',
                        value: 'sumId'
                    }, {
                        label: 'SUMBARCODE',
                        value: 'sumBarcode'
                    },
                    {
                        label: 'Contribution Fee',
                        value: 'contributionFee'
                    },
                    {
                        label: 'Maintenance Fee',
                        value: 'maintenanceFee'
                    },
                    {
                        label: 'Total',
                        value: 'total'
                    },
                    {
                        label: 'Balance',
                        value: 'balance'
                    }, {
                        label: 'Water Consumption',
                        value: 'waterConsumption'
                    }],
                loading: false
            }
        },
        methods: {
            exportUnpaidCustomer() {
                this.$refs['unpaidCustomerForm'].validate((valid) => {
                    if (valid) {
                        if (!!this.form.date || !!this.form.dateRange.length > 1) {
                            this.loading = true;
                            Meteor.call('exportUnpaidCustomers', {
                                fields: this.form.fields,
                                date: this.form.date,
                                dateRange: this.form.dateRange,
                                isPaid: this.form.isPaid
                            }, (err, workbook) => {
                                if (!err) {
                                    const startDate = moment(this.form.dateRange[0]).format('DD-MM-YYYY');
                                    const endDate = moment(this.form.dateRange[1]).format('DD-MM-YYYY');
                                    const ext = this.form.isPaid ? `paid-customer-${startDate}-to-${endDate}` : `unpaid-customer-${moment(this.form.date).format('DD-MM-YYYY')}`
                                    FileSaver.saveAs(new Blob([workbook], {type: "application/octet-stream"}), `${ext}` + ".xlsx");
                                    this.loading = false;
                                } else {
                                    this.loading = false;

                                }
                            })
                        } else {
                            this.$message.error('Date is requried!');
                        }
                    } else {
                        return false;
                    }

                });
            }
        }
    }
</script>

<style scoped>
    .select-width {
        width: 350px;
    }
</style>