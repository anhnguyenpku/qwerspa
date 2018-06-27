<!--suppress ALL -->
<template>
    <div class="accountList-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">

                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span> Account List Report Filter <i class="header-icon el-icon-information"></i>
                            Provides the name, type for each account listed in your Chart of Accounts.</span>
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           style="float: right"
                                           size="small">RUN REPORT
                                </el-button>
                            </div>

                        </el-card>


                    </el-col>
                </el-row>
            </div>
            <span slot="content" style="margin: 0px !important;">
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
                                          <p style="font-family:tacteing;font-size: 40px; margin: 0px !important;">6</p>
                                     </span>

                                </div>
                          </div>
                          <div class="row">
                              <div class="col-md-3">

                              </div>
                              <div class="col-md-6"
                                   style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px; border: 0px !important;">
                                  <p>Account List Report</p>
                              </div>
                              <div class="col-md-3">
                              </div>
                          </div>
                      </caption>

                <thead style="margin-top: 5px">
                    <tr>
                        <th>#</th>
                        <th>Account</th>
                        <th>Type</th>
                        <th>Level</th>
                        <th>Sub Account Of</th>
                        <th>Is Paid Tax</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="accountListHtml">

                </tbody>


            </table>
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
                accountListHtml: "",
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
        },
        methods: {
            handleRun() {
                this.loading = true;
                Meteor.call('accountListReport', (err, result) => {
                    if (result) {
                        this.accountListHtml = result.accountListHTML;
                    }
                    this.loading = false;
                });
            }

        },
        computed: {
            dataExist() {
//                return this.journalsData.length > 0;
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
    }
</style>