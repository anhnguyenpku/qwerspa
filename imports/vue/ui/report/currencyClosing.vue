<!--suppress ALL -->
<template>
    <div class="currencyClosing-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title" style="width: auto !important;">
                            Currency Closing Report Filter <i class="header-icon el-icon-info"></i>
                            Closing income and expense with different currency to base currency.
                            <br>
                        </span>

                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
            </div>
            <span slot="content" style="margin: 0px !important;">
                <div class="container">
                         <table class="table table-report-block-summary table-bordered">
                            <caption>
                                <div class="row">
                                    <div class="col-md-10">
                                     <img style="width: 100px;height: 100px;float: left;" src="/mih.png"
                                          alt="">
                                        <span style="float: left; font-family: 'Khmer OS Muol light','Khmer OS Muol'; font-size: 15px;margin-left: 20px;"><br>
                                            <p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p></span>
                                    </div>
                                     <div class="col-md-2; pull-right"
                                          style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px;">
                                     <span style="text-align: center">
                                         ព្រះរាជាណាចក្រកម្ពុជា <br> ជាតិ សាសនា ព្រះមហាក្សត្រ
                                     </span>

                                    </div>
                                </div>
                              <div class="row">
                                 <div class="col-md-3">

                                </div>
                                <div class="col-md-6"
                                     style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px; border: 0px !important;">
                                  <p>Closing Report</p>
                                    <p>{{closingEntryDate}}</p>
                                </div>
                              <div class="col-md-3">
                              </div>
                          </div>
                             </caption>
                         </table>
                             <table class="table table-report-block-summary table-bordered"
                                    v-html="currencyClosingHtml">
                        </table>
                     <div class="row" style="width: 100% !important;">
                    <div style="width: 50%;float: left !important;text-align: center !important;">
                        បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>.......................... ថ្ងៃទី ............    ខែ  ....................  ឆ្នាំ ...................<br><span
                            style="font-family: 'Khmer OS Muol'">ប្រធាន</span>
                    </div>

                    <div style="width: 50%;float: right !important;text-align: center !important;">
                        .......................... ថ្ងៃទី  ............ ខែ   ....................  ឆ្នាំ  ...................<br><br><b>រៀបចំដោយ</b><br><br>
                    </div>

                </div>
                    </div>
           </span>
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import {GenerateFile} from '/imports/api/mixins/file-saver-fn.js';

    export default {
        mixins: [GenerateFile],
        data() {
            return {
                currencyClosingHtml: "",
                closingEntryDate: "",
                activeName: '0',
                params: {},

                waterBillingSetup: {
                    khName: '',
                    enNamer: ''
                },

                loading: false,
                exportLoading: false,
            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            }
        },
        watch: {},
        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })
            this.currencyClosingReport();

        },
        methods: {
            currencyClosingReport() {
                let q = FlowRouter.current().queryParams;
                Meteor.call("currencyClosingReport", q._id, (err, result) => {
                    this.currencyClosingHtml = result.currencyClosingListHTML;
                    this.closingEntryDate = result.closingEntryDate;
                })

            }

        },
        computed: {
            dataExist() {
//                return this.journalsData.length > 0;
            }
        },
        components: {
            a4: PageA4
        }
    }
</script>
