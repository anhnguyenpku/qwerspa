<template>
    <div>
        <div class="row">
            <el-date-picker
                    v-model="month"
                    type="month"
                    placeholder="Pick a month">
            </el-date-picker>
        </div>
        <el-row class="benchmarkrow" style="margin-top: 20px !important;">
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="benchmarkdiv">
                    <div class="card card-stats">
                        <div class="card-header" data-background-color="orange">
                            <i class="material-icons">description</i>
                        </div>
                        <div class="card-content">

                            <p class="category" style="font-family: 'Khmer OS Battambang'">វិក្កយបត្រប្រកាសលក់</p>
                            <h3 class="card-title fz20">
                                {{formatter(board.totalCustomer)}}
                            </h3>
                        </div>
                        <div class="card-footer">
                            <div class="stats">
                                <i class="material-icons">date_range</i> {{monthFormatter(month)}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="benchmarkdiv">
                    <div class="card card-stats">
                        <div class="card-header" data-background-color="purple">
                            <i class="material-icons">store</i>
                        </div>
                        <div class="card-content">
                            <p class="category">ទឹកប្រាក់ប្រកាសលក់</p>
                            <h3 class="card-title fz20">
                                {{board.totalPosted | numFormat}}
                            </h3>
                        </div>
                        <div class="card-footer">
                            <div class="stats">
                                <i class="material-icons">date_range</i> {{monthFormatter(month)}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="benchmarkdiv">
                    <div class="card card-stats">
                        <div class="card-header" data-background-color="green">
                            <i class="material-icons">attach_money</i>
                        </div>
                        <div class="card-content">
                            <p class="category">ទឹកប្រាក់បានបង់</p>
                            <h3 class="card-title fz20">{{board.totalPayment | numFormat}}</h3>
                        </div>
                        <div class="card-footer">
                            <div class="stats">
                                <i class="material-icons">date_range</i> {{monthFormatter(month)}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="benchmarkdiv">
                    <div class="card card-stats">
                        <div class="card-header" data-background-color="red">
                            <i class="material-icons">money_off</i>
                        </div>
                        <div class="card-content">
                            <p class="category" style="font-family: 'Khmer OS Battambang'">ទឹកប្រាក់មិនទាន់បានបង់</p>
                            <h3 class="card-title fz20">{{board.totalUnpaid | numFormat}}</h3>
                        </div>
                        <div class="card-footer">
                            <div class="stats">
                                <i class="material-icons">date_range</i> {{monthFormatter(month)}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row :gutter="10">
            <slot v-if="!overdue">
                <div class="col-lg-3 col-md-6 col-sm-6" v-loading="loadingOverdue">
                    <div class="benchmarkdiv">
                        <div class="card card-stats">
                            <div class="card-header" data-background-color="red">
                                <i class="material-icons">account_balance</i>
                            </div>
                            <div class="card-content">
                                <p class="category" style="font-family: 'Khmer OS Battambang'">បំណុលសរុប</p>
                                <h3 class="card-title fz20">{{board.totalOverdue | numFormat}}</h3>
                            </div>
                            <div class="card-footer">
                                <div class="stats">
                                    <i class="material-icons">date_range</i> សរុបទាំងអស់
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </slot>
            <slot v-else>
                <div class="col-md-3">
                    <hr>
                </div>
                <div class="col-md-6" style="padding: 10px;" align="center">
                    <el-button type="primary" @click="overdue = !overdue">មើលបំណុល...</el-button>
                </div>
                <div class="col-md-3">
                    <hr>
                </div>
            </slot>
        </el-row>
        <div class="col-md-12">
            <div class="card">
                <slot v-if="loading">
                    <div class="row">
                        <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                            <loader></loader>
                        </div>
                    </div>
                </slot>
                <slot v-else>
                    <div class="card-header card-header-icon" data-background-color="red">
                        <i class="material-icons">assessment</i>
                    </div>
                    <div class="card-content">
                        <h4 class="card-title" style="font-family: 'Khmer OS Muol'">
                            ក្រាហ្វិកពីចំណូលប្រចាំខែ (គិតក្នុងឆ្នាំ {{currentYear}})</h4>
                        <div class="row">
                            <transition name="el-zoom-in-top">
                                <div class="col-md-8 transition-box" v-show="!loading">
                                    <div class="content table-responsive">

                                        <bar-chart
                                                :data="lineData"
                                                :options="lineDataOptions"
                                                :width="600"
                                                :height="350"
                                        >
                                        </bar-chart>
                                    </div>
                                </div>
                            </transition>

                        </div>
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import BarChart from '/imports/vue/components/chart/Bar.vue';
    import Loader from '/imports/vue/ui/Loader.vue'
    import numeral from 'numeral';

    export default {
        components: {
            BarChart,
            Loader
        },
        created() {
            this.countCustomer();
            this.customerTransaction();
            this.totalPostedGraph();
        },
        mounted() {
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },
        watch: {
            month(val) {
                this.customerTransaction();
                this.countCustomer();
            },
            overdue(val) {
                this.loadingOverdue = !val;
                if(!val){
                    this.totalOverdue();
                }
            }
        },
        methods: {
            monthFormatter(val) {
                return moment(val).format('MM/YYYY');
            },
            formatter(val) {
                return numeral(val).format('0,0');
            },
            countCustomer() {
                Meteor.call('dashboard_countCustomer', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalCustomer = result;
                    }
                });
            },
            customerTransaction() {
                Meteor.call('dashboard_customerTransaction', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalPosted = result.map((o) => o.posted);
                        this.board.totalPayment = result.map((o) => o.paid); //convert payment to absolute value
                        this.board.totalUnpaid = result.map((o) => o.balance);
                    }
                });
            },
            totalPostedGraph() {
                Meteor.call('dashboard_totalPostedGraph', Session.get('area'), (err, result) => {
                    if (!err) {
                        result && result.amountArr.forEach((o) => {
                            this.lineData.datasets[0].data[o.month - 1] = o.amount;
                        });
                    }
                });
            },
            totalOverdue() {
                Meteor.call('dashboard_totalOverdue', Session.get('area'), (err, result) => {
                    if(!err){
                        let fold = o => o.totalOverdue;
                        this.board.totalOverdue = result.map(fold);
                        this.loadingOverdue = false;
                    }
                });
            }
        },
        data() {
            return {
                month: moment().toDate(),
                currentYear: moment().format('YYYY'),
                overdue: true,
                board: {
                    totalCustomer: 0,
                    totalPosted: 0,
                    totalPayment: 0,
                    totalUnpaid: 0,
                    totalOverdue: 0
                },
                loading: true,
                loadingOverdue: true,
                lineDataOptions: {
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                return 'ទឹកប្រាក់សរុប' + ': ' + numeral(tooltipItem.yLabel).format('0,0');
                            }
                        }
                    },
                    scales: {
                        scaleLabel: {
                            fontFamily: 'Khmer OS Battambang'
                        },
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    return numeral(value).format('0,0');
                                }
                            }
                        }],
                        xAxes: [{
                            // Change here
                            barPercentage: 1,
                        }]
                    },
                    responsive: true,
                    maintainAspectRatio: false
                },
                lineData: {
                    labels: ["មករា", "កុម្ភៈ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
                    datasets: [{
                        label: 'ទឹកប្រាក់គិតជារៀល',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: [
                            '#91c42d',
                            '#d54e19',
                            '#2716d4',
                            '#583f8d',
                            '#e16d78',
                            '#956f1f',
                            '#c8e610',
                            '#3314cb',
                            '#a12a98',
                            '#55d554',
                            '#05729b',
                            '#74851d',

                        ],
                        borderColor: [
                            '#91c42d',
                            '#d54e19',
                            '#2716d4',
                            '#583f8d',
                            '#e16d78',
                            '#956f1f',
                            '#c8e610',
                            '#3314cb',
                            '#a12a98',
                            '#55d554',
                            '#05729b',
                            '#74851d',

                        ],
                        borderWidth: 1
                    }],

                }
            }
        }
    }
</script>
<style scoped>
    .fz20 {
        font-size: 20px;
    }
</style>