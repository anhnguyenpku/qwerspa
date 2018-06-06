<!--
<template>
    <div class="print-posted-meter-reading">
        <div class="no-print">
            <el-row type="flex" justify="center" class="customer-breadcrumb">
                <el-col class="no-print" :span="12">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item><a href="/">Home</a></el-breadcrumb-item>
                        <el-breadcrumb-item>Print Posted Meter Reading Journal</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <br class="no-print">
            &lt;!&ndash;Side bar filter&ndash;&gt;

            &lt;!&ndash;End sidebar filter&ndash;&gt;
            <div slot="header" class="no-print">
                <el-row type="flex" justify="center">
                    <el-col :span="13">
                        <button type="button" class="btn btn-default " data-toggle="modal" data-target="#postInvoice">
                            Customize
                        </button>
                        <button type="button" class="btn btn-default " data-toggle="modal" data-target="#postInvoice">
                            Customize
                        </button>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="A4">
            <div class="sheet padding-3mm">
                <div class="picture"></div>
                <div v-show="postedInvoiceIsZero()">
                    <br>
                    <p style="text-align: center">No Data</p>
                </div>
                <div v-for="doc in reportData">
                    <table class="mg-top">
                        <tr>
                            <td class="fz15" width="400px;">&emsp;&emsp;&emsp;
                                <b>
                                    {{doc.customerDoc.khName}}<br>
                                    &emsp;&emsp;&emsp; <span class="fz12">{{doc.customerDoc.name}}</span>
                                </b>
                            </td>
                            <td width="350px;" style="text-align: center" class="fz15">{{doc.customerDoc._id}}</td>
                            <td width="246px;" style="text-align: center" class="fz15">
                                &nbsp;{{dateFormatter(doc.newReadingDate)}}
                            </td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td width="200px" class="fz15">
                                <br>
                                &emsp;&emsp;&emsp;&emsp;{{doc.customerDoc.streetNo}}
                            </td>
                            <td class="fz15" width="200px">
                                <br>
                                &emsp;&emsp;{{doc.customerDoc.address}}
                            </td>
                            <td class="fz15" width="200px">
                                <br>
                                &emsp;&emsp;&emsp;{{isOldBlockExist(doc.customerDoc)}}
                            </td>
                            <td class="fz15" width="200px" style="text-align: left">
                                <br>
                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{{doc.barcode}}
                            </td>
                        </tr>
                    </table>
                    <table class="mg-top8">
                        <tr class="fz15">
                            <td width="50px" style="text-align: center"><br> 0</td>
                            <td width="150px" style="text-align: left"><br>&emsp;&emsp;&emsp;0</td>
                            <td width="130px"><br> 1-1</td>
                            <td width="130px"><br> {{dateFormatter(doc.prevReadingDate)}}</td>
                            <td width="130px"><br> {{dateFormatter(doc.newReadingDate)}}</td>
                        </tr>
                    </table>
                    <table class="mg-top39" style="margin-left: -9px">
                        <tr class="fz15">
                            <td width="75px" style="text-align: left;">{{doc.customerDoc.contract.meterSerialNo}}</td>
                            <td width="125px" style="text-align: center;">
                                {{doc.customerDoc.contract.meterTypeDoc.diameter}}
                            </td>
                            <td width="150px">{{dateFormatter(doc.newReadingDate)}}</td>
                            <td width="150px" style="text-align: center">{{doc.newReading}}</td>
                            <td width="150px" style="text-align: center">&nbsp;{{dateFormatter(doc.prevReadingDate)}}
                            </td>
                            <td width="150px" style="text-align: center">&emsp;&emsp;{{doc.prevReading}}</td>
                            <td width="150px" style="text-align: center">&emsp;&emsp;{{doc.waterConsumption}}</td>
                        </tr>
                        &lt;!&ndash;<div>&ndash;&gt;
                        &lt;!&ndash;<posted-meter-reading-journal-component :doc="doc"></posted-meter-reading-journal-component>&ndash;&gt;
                        &lt;!&ndash;</div>&ndash;&gt;
                    </table>
                    <table class="mg-top10">
                        <tr class="fz14">
                            <td width="20px">70002</td>
                            <td width="100px">តម្លៃទឹកតាមនាឡិកាស្ទង់កំរិត ១</td>
                            <td width="100px" style="text-align: left">METERED CONSUMPTION-TR1</td>
                            <td width="100px" style="text-align: right">{{doc.waterConsumption}} M3</td>
                            <td width="100px" style="text-align: right">{{numFormatter(doc.price)}}</td>
                            <td style="width: 100px; text-align: right">{{numFormatter(doc.total)}}</td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px">71002</td>
                            <td width="100px">តម្លៃថែទាំនាឡិកាស្ទង់</td>
                            <td width="100px" style="text-align: left">METER MAINTENANCE</td>
                            <td width="100px" style="text-align: right">{{doc.billingCycle}} M</td>
                            <td width="100px" style="text-align: right">{{ceilingFormatter(doc.maintenanceFee)}}</td>
                            <td style="width: 100px;text-align: right">{{ceilingFormatter(doc.maintenanceFee)}}</td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px">41001.98</td>
                            <td width="100px">វិភាគទានលូទឹកស្អុយ</td>
                            <td width="100px" style="text-align: left">SEWERAGE CHARGE</td>
                            <td width="100px" style="text-align: right">{{doc.waterConsumption}} M3</td>
                            <td width="100px" style="text-align: right">{{numFormatter(doc.contributionFeePrice)}}</td>
                            <td style="width: 100px;text-align: right">{{numFormatter(doc.contributionFee)}}</td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px"></td>
                            <td width="100px"></td>
                            <td width="100px" style="text-align: left"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td style="width: 100px;text-align: right"></td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px"></td>
                            <td width="100px"></td>
                            <td width="100px" style="text-align: left"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td style="width: 100px;text-align: right"></td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px"></td>
                            <td width="100px"></td>
                            <td width="100px" style="text-align: left"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td style="width: 100px;text-align: right"></td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px"></td>
                            <td width="100px"></td>
                            <td width="100px" style="text-align: left"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td style="width: 100px;text-align: right"></td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px"></td>
                            <td width="100px"></td>
                            <td width="100px" style="text-align: left"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td style="width: 100px;text-align: right"></td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px"></td>
                            <td width="100px"></td>
                            <td width="100px" style="text-align: left"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td style="width: 100px;text-align: right"></td>
                        </tr>
                        <tr class="fz14">
                            <td width="20px"></td>
                            <td width="100px"></td>
                            <td width="100px" style="text-align: left"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td width="100px" style="text-align: right"></td>
                            <td style="width: 100px;text-align: right"></td>
                        </tr>
                        &lt;!&ndash;<div>&ndash;&gt;
                        &lt;!&ndash;</div>&ndash;&gt;
                    </table>
                    <table style="margin-top: 11cm">
                        <tr>
                            <td width="113px"></td>
                            <td width="113px"></td>
                            <td width="159px"></td>
                            <td class="fz18" style="text-align: right;">{{numFormatter(doc.grandTotal)}}</td>
                            <td width="113px"></td>
                        </tr>
                        <tr>
                            <td width="113px"></td>
                            <td width="113px"></td>
                            <td width="159px"></td>
                            <td class="fz18" style="text-align: right;"><br>{{numFormatter(doc.grandTotal)}}</td>
                            <td width="113px"></td>
                        </tr>
                        <tr>
                            <td width="113px"></td>
                            <td width="113px"></td>
                            <td width="159px"></td>
                            <td class="fz18" style="text-align: right;"><br>{{numFormatter(doc.grandTotal)}}</td>
                            <td width="113px"></td>
                        </tr>
                    </table>
                    <table style="margin-top: 1.8cm">
                        <tr>
                            <td style="text-align: center">{{dateFormatter()}}</td>
                        </tr>
                    </table>
                    <table style="margin-top: 3cm">
                        <tr>
                            <td>
                                <posted-meter-reading-journal-component
                                        :doc="doc"></posted-meter-reading-journal-component>
                            </td>
                        </tr>
                    </table>
                    <p style="page-break-after:always"></p>
                </div>
            </div>
            &lt;!&ndash;Modal&ndash;&gt;
            <div class="container demo">
                &lt;!&ndash; Modal &ndash;&gt;
                <div class="modal left fade" id="postInvoice" tabindex="-1" role="dialog"
                     aria-labelledby="postInvoiceLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                        aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title" id="postInvoiceLabel"><i class="fa fa-filter"></i>
                                    Post Invoice Filter</h4>
                            </div>

                            <div class="modal-body">
                                <el-form :rules="rules" ref="postedInvoice" :label-position="labelPosition"
                                         label-width="100px" :model="postInvoice">
                                    &lt;!&ndash;<el-row>&ndash;&gt;
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
                                        <el-select style="width: 223px" v-model="postInvoice.meterQuery" multiple
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
                                    &lt;!&ndash;</el-row>&ndash;&gt;
                                    <el-form-item label="Customer">
                                        <el-select style="width: 223px" class="customer-select"
                                                   v-model="postInvoice.customer" multiple
                                                   filterable=""
                                                   remote
                                                   placeholder="Please enter a keyword" :remote-method="remoteMethod"
                                                   :loading="loading">
                                            <el-option v-for="item in customers" :key="item.value" :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading"
                                                   @click.native="queryPostInvoice('postedInvoice')">Run
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>

                        </div>&lt;!&ndash; modal-content &ndash;&gt;
                    </div>&lt;!&ndash; modal-dialog &ndash;&gt;
                </div>&lt;!&ndash; modal &ndash;&gt;


            </div>&lt;!&ndash; container &ndash;&gt;
            &lt;!&ndash;End Modal&ndash;&gt;
        </div>
    </div>
</template>

<script>
    import PostedMeterReadingJournalComponent from '/imports/vue/components/print/PostedMeterReadingJournalComponent.vue';
    import numeral from 'numeral';
    export default {
        components: {
            PostedMeterReadingJournalComponent
        },
        data() {
            return {
                rules: {},
                fullscreenLoading: false,
                meterQueryOptions: [],
                //date picker
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
                //form data
                labelPosition: 'right',
                customers: [],
                loading: false,
                postInvoice: {
                    customer: [],
                    meterQuery: [],
                },
                //end form data
                reportData: [],
            };
        },
        methods: {
            lookupMeterQuery({selector}){
                Meteor.call('meterQueryOptions', {selector}, (err, result) => {
                    if (!err) {
                        this.meterQueryOptions = result;
                    }
                });
            },
            queryPostInvoice(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let selector = {};
                        if (this.postInvoice.meterQuery.length > 0) {
                            this.postInvoice.meterQuery.forEach(function (meter) {
                                let obj = JSON.parse(meter);
                                if (!selector.district) {
                                    selector = {
                                        district: {$in: [obj.district],},
                                        block: {$in: [obj.block]},
                                        quartier: {$in: [obj.quartier]}
                                    }
                                } else {
                                    selector['district']['$in'].push(obj.district);
                                    selector['block']['$in'].push(obj.block);
                                    selector['quartier']['$in'].push(obj.quartier);
                                }
                            });
                        }
                        if (this.dateRange.length > 0) {
                            selector.newReadingDate = {
                                $gte: this.dateRange[0],
                                $lte: this.dateRange[1]
                            }
                        }
                        if (this.postInvoice.customer.length > 0) {
                            selector.customerId = {$in: this.postInvoice.customer}
                        }
                        //excute the query if daterange && meter query or customer has value
                        selector.written = true;
                        selector.assignedUsers = {$in: [Meteor.userId()]};
                        if ((this.dateRange.length > 0 ) && this.postInvoice.meterQuery.length > 0 || this.postInvoice.customer.length > 0) {
                            this.fetchPostedMeterReadingJournalDetailById({selector})
                        }
                    } else {
                        console.log("Error Submt")
                    }
                });
            },
            //query customer
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        let lists = [];
                        this.loading = false;
                        Meteor.call('lookupCustomer', query, (err, result) => {
                            if (!err) {
                                result.forEach(function (customer) {
                                    lists.push({label: `${customer.khName}`, value: customer._id})
                                });
                                this.customers = lists;
                            } else {
                                console.log(err.message);
                            }
                        })
                    }, 200);
                } else {
                    this.options4 = [];
                }
            },
            fetchPostedMeterReadingJournalDetailById({selector}){
                this.fullscreenLoading = true;
                setTimeout(() => {
                    Meteor.call('fetchPostedMeterReadingJournalDetailById', {selector}, (err, result) => {
                        if (!err) {
                            this.reportData = result;
                        }
                    });
                    this.fullscreenLoading = false;
                    $('modal').close()
                }, 1000);
            },
            dateFormatter(date){
                return moment(date).format('DD/MM/YYYY')
            },
            numFormatter(val){
                return numeral(val).format('0,0.00')
            },
            ceilingFormatter(val){
                return numeral(val).format('0,0')
            },
            generateBarcodeId(doc){
                return `barcode${doc._id}`;
            },
            isOldBlockExist(doc){
                if (doc.newCustomerSuffix) {
                    return doc.newCustomerId + doc.newCustomerSuffix;
                }
                let dpcArr = doc.dpc.split('');
                let subDpc = dpcArr[0] + dpcArr[1] + " " + dpcArr[2] + dpcArr[3] + " " + dpcArr[4] + dpcArr[5] + " " + doc.folio + " " + doc.successor;
                return subDpc;
            },
            printPostedInvoice(){
                window.print();
            },
            postedInvoiceIsZero(){
                return this.reportData.length <= 0
            }
        },
        computed: {
            generateBarcodeSvg(doc){
                return `barcode${doc._id}`;
            },
        },
        //life cycle
        created(){
            let mrjdId = FlowRouter.query.get('mrjd'); //mrjd = Meter Readiing Journal Detal
            if (mrjdId) {
                let selector = {_id: mrjdId};
                this.fetchPostedMeterReadingJournalDetailById({selector});
            }
            this.lookupMeterQuery({selector: {assignUser: {$in: [Meteor.userId()]}}})
        },
        mounted(){
            document.body.style.backgroundColor = "white";
            $('.post-invoice').sideNav({
                    menuWidth: 500, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                    draggable: true // Choose whether you can drag to open on touch screens
                }
            );
        }
    }
</script>

<style scoped lang="less">
    @s-normal: normal !important;
    /*@page {*/
    /*size: A4;*/
    /*margin-left: 0cm;*/
    /*margin-right: 0cm;*/
    /*}*/

    .b-top-bottom {
        border-top: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }

    table {
        width: 100%;
    }

    tr, td {
        padding: 5px;
    }

    .f-normal {
        font-weight: normal !important;
    }

    .fz15 {
        font-size: 15px !important;
    }

    .fz14 {
        font-size: 14px !important;
    }

    .fz13 {
        font-size: 13px !important;
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

    .mg-top {
        // margin-top: 3.2cm !important;
    }

    .mg-top39 {
        margin-top: 1.9cm !important;
    }

    .mg-top8 {
        margin-top: 0.5cm !important;
    }

    .mg-top10 {
        margin-top: 1.7cm !important;
    }

    /*tr.mg-left {*/
    /*margin-left: 200px !important;*/
    /*}*/

    div.report-layout {
        width: 297mm;
        margin: 0 auto;
    }
    div.picture{
        background-image: url(images/posted-invoice.jpg)
    }
</style>-->
