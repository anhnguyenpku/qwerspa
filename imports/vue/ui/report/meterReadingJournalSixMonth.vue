<template>
    <div class="meterReadingJournalSixMonth-report">
        <div class="no-print">
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Meter Reading Journal​​ Six Month Filter <i class="header-icon el-icon-information"></i>
                        </span>
                                <el-form inline :rules="rules" ref="journalReading" :label-position="labelPosition"
                                         label-width="100px" :model="journalReading">
                                    <el-form-item label="Date" prop="dateRange">
                                        <el-date-picker
                                                v-model="dateRange"
                                                type="daterange"
                                                align="right"
                                                placeholder="Pick a range"
                                                :picker-options="pickerOptions2">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="Meter Query">
                                        <el-select style="width: 223px" v-model="journalReading.meterQuery"
                                                   multiple
                                                   clearable
                                                   placeholder="Select">
                                            <el-option
                                                    v-for="item in meterQueryOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" v-loading.lock="fullscreenLoading"
                                                   @click.native="queryMeterReadingJournal('journalReading')">Run
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="A4 landscape">
            <section class="sheet padding-3mm">
                <div v-for="doc in reportData">
                    <table style="border-bottom: 2px solid #000;">
                        <thead>
                        <tr>
                            <th colspan="15">
                                <div class="row">
                                    <div class="pull-left">
                                        <h5 class="fz12"><b>Meter Reading Book</b></h5>
                                        <p class="fz9">Journal Template Name &emsp;&emsp;WATER BILL</p>
                                        <p class="fz9">
                                            Journal Batch Name    &emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;{{dateFormatter(doc.batchName)}}</p>
                                    </div>
                                    <div class="pull-right">
                                        <h5>{{userNamePrint}}</h5>
                                        <h5>{{datePrint}}</h5>
                                        <!--<span id="page-number"></span>-->
                                    </div>
                                </div>
                                <table>

                                    <thead>
                                    <tr class="normal">
                                        <th>Group</th>
                                        <th>District &emsp;&emsp;{{doc.header.district.name}}</th>
                                        <th>Quartier &emsp;&emsp;{{doc.header.quartier.name}}</th>
                                        <th>Block &emsp;&emsp;{{doc.header.block.name}}</th>
                                        <th>Billing Period &emsp;&emsp;{{dateFormatter(doc.header.billingPeriod)}}</th>
                                        <th>Total Qty&emsp;&emsp;{{doc.sumQty}}</th>
                                        <th style="text-align: right;">Reading Date &emsp;&emsp;</th>
                                        <th class="pull-right"><input type="text" class="report-txt"></th>
                                    </tr>
                                    </thead>
                                </table>
                            </th>
                        </tr>
                        <tr class="b-top-bottom" style="border-top: 2px solid #000">
                            <!--<th v-for="head in heads" :style="head.selector">{{head.label}}</th>-->
                            <th style="width: 4.5cm !important">DPC</th>
                            <th style="width: 6cm !important">Name</th>
                            <th style="width: 2cm !important">Street</th>
                            <!--<th style="width: 6.5cm !important">Address</th>-->

                           <!-- <th style="width: 2.5cm !important">Phone No.</th>
                            <th style="width: 1cm !important">Position</th>-->

                            <!--<th>Cat</th>
                            <th>Tariff</th>-->
                            <!--<th style="width: 3.3cm !important">Meter #</th>-->
                            <th style="width: 0.9cm !important">Avg</th>
                            <th colspan="2" style="width: 4.56cm !important">Prev-Reading</th>
                            <th style=" width: 2cm !important">New Reading</th>
                            <th style=" width: 2cm !important">Next</th>
                            <th style=" width: 2cm !important">Next</th>
                            <th style=" width: 2cm !important">Next</th>
                            <th style=" width: 2cm !important">Next</th>
                            <th style=" width: 2cm !important">Next</th>
                            <th style=" width: 1.56cm !important">Qty</th>
                            <th style="width: 1.1cm !important">Attention</th>
                            <th style="width: 2cm !important">Miscellaneous</th>

                        </tr>

                        </thead>
                        <tbody>
                        <tr v-for="journalDetail in doc.meterReadingJournalDetail"
                            style="border-bottom: 1px solid #48576A">

                            <td>{{isOldBlockExist(journalDetail)}}</td>
                            <td style="text-align: left !important;">{{journalDetail.customerDoc.khName}}</td>
                            <td style="text-align: left !important;">{{journalDetail.streetNo}}</td>
                            <!--<td style="text-align: left !important;">{{journalDetail.customerDoc.address}}</td>-->
                            <!--<td style="text-align: center !important;">{{journalDetail.customerDoc.phoneNumber}}</td>
                            <td style="text-align: center !important;">{{journalDetail.customerDoc.position}}</td>-->
                            <!--<td style="text-align: center !important;">{{journalDetail.categoryDoc.code}}</td>
                            <td style="text-align: center !important;">{{journalDetail.tariffDoc.code}}</td>-->
                            <!--<td style="text-align: left !important;">{{journalDetail.customerDoc.contract.meterDiameter}}&nbsp;&nbsp;{{journalDetail.customerDoc.contract.meterSerialNo}}</td>-->
                            <td style="border-left: 1px solid #000;text-align: center !important;">
                                {{journalDetail.avgWaterConsumption}}
                            </td>
                            <td style="border-left: 1px solid #000;border-right: 0px solid #000;">
                                &nbsp;{{journalDetail.prevReadingDate | momentFormat}}
                            </td>
                            <td style="border-left: 0px !important;">
                                <span class="right">{{journalDetail.prevReading}}</span>
                            </td>
                            <td style="border-left: 1px solid #000;border-right: 1px solid #000;"
                                v-html="isNewReadingExist(journalDetail.newReading)">&emsp;
                            </td>
                            <td style="border-left: 1px solid #000;border-right: 1px solid #000;"
                                v-html="isNewReadingExist()"></td>
                            <td style="border-left: 1px solid #000;border-right: 1px solid #000;"
                                v-html="isNewReadingExist()"></td>
                            <td style="border-left: 1px solid #000;border-right: 1px solid #000;"
                                v-html="isNewReadingExist()"></td>
                            <td style="border-left: 1px solid #000;border-right: 1px solid #000;"
                                v-html="isNewReadingExist()"></td>
                            <td style="border-left: 1px solid #000;border-right: 1px solid #000;"
                                v-html="isNewReadingExist()"></td>

                            <td style="border-left: 1px solid #000;text-align: center !important;">
                                {{journalDetail.waterConsumption}}
                            </td>
                            <td style="border-left: 1px solid #000;border-right: 1px solid #000;text-align: center !important;">
                                .
                            </td>
                            <td>&emsp;.</td>
                        </tr>
                        <br><br><br>
                        <tr>
                            <td colspan="15"></td>
                        </tr>
                        </tbody>
                    </table>
                    <br>
                    <!--<p style="page-break-after:always"></p>-->
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                reportData: [],
                rules: {},
                userNamePrint: "",
                datePrint: "",
                /*heads: [
                    {label: 'DPC', value: 'dpc', selector: {width: '4.5cm !important'}},
                    {label: 'Name', value: 'name', selector: {width: '6cm !important'}},
                    {label: 'Street', value: 'streetNo', selector: {width: '2cm !important'}},
                    {label: 'Address', value: 'address', selector: {width: '6.5cm !important'}},
                    {label: 'Phone No.', value: 'phoneNumber', selector: {width: '2.5cm !important'}},
                    {label: 'Position', value: 'position', selector: {width: '1cm !important'}},
                    {label: 'Cat', value: 'cat', selector: {width: 'auto'}},
                    {label: 'Tariff', value: 'tariff', selector: {width: 'auto'}},
                    {label: 'Meter #', value: 'meter', selector: {width: '3.3cm !important'}},
                    {
                        label: 'Avg',
                        value: 'avg',
                        selector: {
                            'text-align': 'center',
                            width: '0.9cm !important'
                        }
                    },
                    {
                        label: 'Prev-Reading',
                        value: 'prevReading',
                        selector: {
                            'text-align': "center",
                            width: '4.56cm !important'
                        }
                    },
                    {
                        label: 'New Reading',
                        value: 'newReading',
                        selector: {
                            'text-align': "center",
                            width: '4.56cm !important'
                        }
                    },
                    {
                        label: 'Attention',
                        value: 'attention',
                        selector: {
                            width: '1.1cm !important'
                        }
                    },
                    {
                        label: 'Miscellaneous',
                        value: 'miscellaneous',
                        selector: {
                            width: '2cm !important'
                        }
                    },
                ],*/
                pickerOptions2: {
                    shortcuts: [
//                        {
//                        text: 'Last week',
//                        onClick(picker) {
//                            const end = new Date();
//                            const start = new Date();
//                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
//                            picker.$emit('pick', [start, end]);
//                        }
//                    },
                        {
                            text: 'Last month',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: 'Last 3 months',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
                dateRange: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
                loading: false,
                fullscreenLoading: false,
                journalReading: {
                    customer: [],
                    meterQuery: [],
                },
                labelPosition: 'right',
                meterQueryOptions: [],
                activeName: '1'

            };
        },
        watch: {},
        methods: {
            isNewReadingExist(val){
                if (val) {
                    return val;
                }
                return '&emsp;.&emsp;.&emsp;.&emsp;.&emsp;.&emsp;';
            },
            queryMeterReadingJournal(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let selector = {};
                        let journalDetailSelector = {};
                        if (this.journalReading.meterQuery.length > 0) {
                            this.journalReading.meterQuery.forEach(function (meter) {
                                let obj = JSON.parse(meter);
                                if (!selector.meterReadingId) {
                                    selector = {
                                        meterReadingId: {$in: [obj.meterReadingId]}
                                    };
                                } else {
                                    selector['meterReadingId']['$in'].push(obj.meterReadingId);
                                }
                            });
                            if (this.dateRange.length > 0) {
                                selector.date = {
                                    $gte: moment(this.dateRange[0]).startOf('days').toDate(),
                                    $lte: moment(this.dateRange[1]).endOf('days').toDate()
                                }
                            }
                            this.lookupMeterReadingJournal({selector});
                        }
                    }
                });
            },
            dateFormatter(val){
                return moment(val).format('DD-MM/YY')
            },
            onSubmit() {
                console.log('submit!');
            },
            printJournalReading(){

            },
            isOldBlockExist(doc) {
                let dpcArr = doc.dpc.split('');
                let subDpc = dpcArr[0] + dpcArr[1] + " " + dpcArr[2] + dpcArr[3] + " " + dpcArr[4] + dpcArr[5] + " " +dpcArr[6]+dpcArr[7]+dpcArr[8]+dpcArr[9] + " " + dpcArr[10];
                return subDpc;
            },
            lookupMeterQuery({selector}){
                Meteor.call('meterQueryOptions', {selector}, (err, result) => {
                    if (!err) {
                        this.meterQueryOptions = result;
                    }
                });
            },
            lookupMeterReadingJournal({selector}){
                this.fullscreenLoading = true;
                setTimeout(() => {
                    Meteor.call('meterReadingJournalReport', {selector}, (err, result) => {
                        if (!err) {
                            this.reportData = result;
                            this.userNamePrint = Meteor.users.findOne({_id: Meteor.userId()}).username;
                            this.datePrint = moment().format("DD/MM/YYYY");
                        } else {
                            console.log(err.message);
                        }
                    });
                    this.fullscreenLoading = false;
                }, 1000);
            }
        },
        created(){
            let params = FlowRouter.query.get('mrjId');
            this.lookupMeterQuery({selector: {assignUser: {$in: [Meteor.userId()]}}});
            if (params) {
                this.lookupMeterReadingJournal({selector: {_id: params}});
            }
        },
        mounted(){
//            document.body.style.backgroundColor = "white";
        }
    };
</script>

<style scoped lang="less">
    @s-normal: normal !important;
    .report-layout {
        width: 297mm;
        margin: 0 auto;
    }

    table {
        width: 100%;
        font-size: 9px;
        thead, tbody {
            tr {
                th {
                    padding: 5px !important;
                }
            }
        }
    }

    tbody {
        tr {
            td {
                padding-top: 0.2cm !important;
                padding-bottom: 0.2cm !important;
            }
        }
    }

    tr.normal {
        th {
            font-weight: @s-normal;
        }
    }

    .b-top-bottom {
        border-top: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }

    .f-normal {
        font-weight: normal !important;
    }

    .fz12 {
        font-size: 12px !important;
    }

    .fz9 {
        font-size: 9px !important;
    }

    .fz18 {
        font-size: 18px !important;
    }

    .report-txt {
        border: 1px solid #000;
        height: 18px !important;
        width: 125px;
        padding: 0px !important;
        margin-top: -3px;
        margin: 0;
        margin-left: -3px;
    }
</style>