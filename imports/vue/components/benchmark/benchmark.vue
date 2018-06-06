<template>
    <div>
        <div class="row">
            <el-date-picker
                    v-model="month"
                    type="month"
                    placeholder="Pick a month">
            </el-date-picker>
        </div>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">supervisor_account</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អតិថិជនសរុប</p>
                        <h3 class="card-title fz20">
                            {{formatter(board.totalFullCustomer)}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL CUSTOMTER</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
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
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL INVOICE</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">local_drink</i>
                    </div>
                    <div class="card-content">
                        <p class="category">បរិមាណទឹកប្រកាសលក់</p>
                        <h3 class="card-title fz20">
                            {{board.totalConsumption | numFormat}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL WATER QUALITY</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">monetization_on</i>
                    </div>
                    <div class="card-content">
                        <p class="category">ទឹកប្រាក់ប្រកាសលក់</p>
                        <h3 class="card-title fz20">
                            {{board.totalPosted | numFormat}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">perm_identity</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អតិថិជនកើនក្នុងខែ</p>
                        <h3 class="card-title fz20">{{formatter(board.totalCustomerInPeriod)}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>CUSTOMER INCREASEMENT</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="green">
                        <i class="material-icons">description</i>
                    </div>
                    <div class="card-content">
                        <p class="category">វិក្កយបត្របានទទួល</p>
                        <h3 class="card-title fz20">{{formatter(board.totalInvoiceClosed)}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>RECEIVED BILLING</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="green">
                        <i class="material-icons">invert_colors</i>
                    </div>
                    <div class="card-content">
                        <p class="category">បរិមាណទឹកបានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalQualityClosed | numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>RECEIVED WATER AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="green">
                        <i class="material-icons">attach_money</i>
                    </div>
                    <div class="card-content">
                        <p class="category">ទឹកប្រាក់បានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalPayment | numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>RECEIVED AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">trending_up</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អត្រាធ្វើវិក្កយបត្រប្រកាសលក់</p>
                        <h3 class="card-title fz20">
                            {{(board.totalCustomer/(board.totalFullCustomer-board.totalInActiveCustomer)) |
                            numFormatPercent}}
                            %</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>SOLD BILLING RATE</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="red">
                        <i class="material-icons">no_sim</i>
                    </div>
                    <div class="card-content">
                        <p class="category">វិក្កយបត្រមិនទាន់បានទទួល</p>
                        <h3 class="card-title fz20">{{formatter(board.totalCustomer-board.totalInvoiceClosed )}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>UNRECEIVED BILLING</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="red">
                        <i class="material-icons">invert_colors_off</i>
                    </div>
                    <div class="card-content">
                        <p class="category">បរិមាណទឹកមិនទាន់បានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalConsumption-board.totalQualityClosed| numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>UNRECEIVED WATER AMOUNT</i>

                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="red">
                        <i class="material-icons">money_off</i>
                    </div>
                    <div class="card-content">
                        <p class="category" style="font-family: 'Khmer OS Battambang'">ទឹកប្រាក់មិនទាន់បានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalUnpaid | numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>UNRECEIVED AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">
                            person_add
                        </i>
                    </div>
                    <div class="card-content">
                        <p class="category">អតិថិជនប្រើប្រាស់</p>
                        <h3 class="card-title fz20">
                            {{formatter(board.totalFullCustomer -board.totalInActiveCustomer)}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL ACTIVE CUSTOMER</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">
                            person_add_disabled
                        </i>
                    </div>
                    <div class="card-content">
                        <p class="category" style="font-family: 'Khmer OS Battambang'">អតិថិជនមិនប្រើប្រាស់</p>
                        <h3 class="card-title fz20">
                            {{formatter(board.totalInActiveCustomer)}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL INACTIVE CUSTOMER</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">trending_up</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អត្រាប្រមូលបាន</p>
                        <h3 class="card-title fz20">
                            {{(board.totalInvoiceClosed/(board.totalFullCustomer -board.totalInActiveCustomer)) |
                            numFormatPercent}} %
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL COLLECTION RATIO</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">trending_up</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អត្រាអតិថិជនប្រើប្រាស់</p>
                        <h3 class="card-title fz20">
                            {{(board.totalFullCustomer -board.totalInActiveCustomer)/board.totalFullCustomer |
                            numFormatPercent}} %
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL ACTIVE CUSTOMER RATIO</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>

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
            this.countFullCustomer();
            this.countInActiveCustomer();
            this.customerTransaction();
            this.totalPostedGraph();
            this.countCustomerInPeriod();

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
                this.countInActiveCustomer();
                this.countFullCustomer();
                this.countCustomerInPeriod();
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
            countFullCustomer() {
                Meteor.call('dashboard_countFullCustomer', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalFullCustomer = result;
                    }
                });


            },
            countInActiveCustomer() {
                Meteor.call('dashboard_countInActiveCustomer', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalInActiveCustomer = result;
                    }
                });


            },
            countCustomerInPeriod() {
                Meteor.call('dashboard_countCustomerInPeriod', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalCustomerInPeriod = result;
                    }
                });

            },
            customerTransaction() {
                Meteor.call('dashboard_customerTransaction', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalPosted = result.map((o) => o.posted);
                        this.board.totalPayment = result.map((o) => o.paid); //convert payment to absolute value
                        this.board.totalUnpaid = result.map((o) => o.balance);
                        this.board.totalConsumption = result.map((o) => o.totalConsumption);
                        this.board.totalInvoiceClosed = result.map((o) => o.totalInvoiceClosed);
                        this.board.totalQualityClosed = result.map((o) => o.totalQualityClosed);
                    }
                });
            },
            totalPostedGraph() {
                Meteor.call('dashboard_totalPostedGraph', Session.get('area'), (err, result) => {
                    if (!err) {
                        result.amountArr.forEach((o) => {
                            this.lineData.datasets[0].data[o.month - 1] = o.amount;
                        });
                    }
                });
            },


        },
        data() {
            return {
                month: moment().toDate(),
                currentYear: moment().format('YYYY'),
                board: {
                    totalCustomer: 0,
                    totalPosted: 0,
                    totalPayment: 0,
                    totalUnpaid: 0,
                    totalConsumption: 0,
                    totalInvoiceClosed: 0,
                    totalQualityClosed: 0,
                    totalFullCustomer: 0,
                    totalInActiveCustomer: 0,
                    totalCustomerInPeriod: 0,

                },
                loading: true,
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