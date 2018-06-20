<!--suppress ALL -->
<template>
    <div class="posProductList-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title" style="width: auto !important;">
                            {{langConfig['titleFilter']}} <i class="header-icon el-icon-information"></i>
                        </span>
                                <!--<el-form :inline="true">-->
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           style="float: right"
                                           size="small">{{langConfig['run']}}
                                </el-button>
                                <!--<el-button v-show="dataExist" :loading="exportLoading" type="success"
                                           @click="exportToExcel" size="small"><i class="fa fa-file-excel-o"></i>
                                    Export to Excel
                                </el-button>-->
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
            </div>
            <span slot="content" style="margin: 0px !important;">

                          <div class="row">
                              <div class="col-lg-3">
<img style="width: 70px;height: 70px;float: left !important;"
     src="/mih.png"
     alt="">
                              </div>
                                <div class="col-md-6" style="text-align: center !important;">

                                        <span style="font-family:Khmer os muol; font-size: 15px;">
                                            <p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p>
                                         <p style="font-size: 9px !important; font-family: khmer os Battambang; margin-bottom: 0px !important;">
                                        {{waterBillingSetup.address}}({{waterBillingSetup.phoneNumber}})
                                            </p>
                                        </span>
                                 </div>
                              <div class="col-md-3"></div>
                          </div>
                <table class="table table-report-block-summary table-bordered">
                      <caption>

                          <div class="row">
                              <div class="col-lg-3">
                                  <span style="float: left !important;">{{langConfig['no']}}:.........</span>
                              </div>
                              <div class="col-md-6"
                                   style="text-align: center; border: 0px !important;">
                                  <p style="font-family: 'Khmer OS Muol'; font-size: 15px;">{{langConfig['title']}}</p>
                              </div>
                              <div class="col-lg-3"></div>
                          </div>
                      </caption>

                <thead style="margin-top: 5px">
                    <tr>
                        <th>{{langConfig['no']}}</th>
                        <th>{{langConfig['product']}}</th>
                        <th>{{langConfig['type']}}</th>
                        <th>{{langConfig['description']}}</th>
                        <th>{{langConfig['price']}}</th>
                        <th>{{langConfig['cost']}}</th>
                        <th>{{langConfig['qtyOnHand']}}</th>
                        <th>{{langConfig['barcode']}}</th>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="productListHtml">

                </tbody>


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
           </span>
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import {GenerateFile} from '/imports/api/mixins/file-saver-fn.js';
    import compoLangReport from '../../../../both/i18n/lang/elem-label-report';

    import PosBarcodeProduct from '/imports/vue/components/posBarcodeProduct/PosBarcodeProduct';


    export default {
        mixins: [GenerateFile],
        components: {
            PosBarcodeProduct
        },
        data() {
            return {
                params: {
                    branch: '',
                    area: '',
                    date: null,
                },
                rolesArea: '',
                activeName: '1',
                productListHtml: "",
                labelPosition: 'top',
                branchOptions: [],
                areaOptions: [],


                waterBillingSetup: {
                    khName: '',
                    enNamer: ''
                },

                loading: false,
                exportLoading: false,

                checkAll: false,
                isIndeterminate: true,

            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            },
            langSessionReport() {
                return Session.get('lang') || "en";
            }
        },
        watch: {

            "params.branch"(val) {
                this.fetchArea(val);
            }
        },
        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })
            this.fetchBranch();
        },
        methods: {

            fetchBranch() {
                Meteor.call("queryRoleBranchOptionReport", (err, result) => {
                    if (result) {
                        this.branchOptions = result;
                    }
                })
            },
            fetchArea(branchList) {
                Meteor.call("queryRoleAreaOptionReport", branchList, (err, result) => {
                    if (result) {
                        this.areaOptions = result;
                    }
                })
            },
            handleRun() {
                this.loading = true;
                Meteor.call('posProductListReport', this.params, (err, result) => {
                    if (result) {
                        this.productListHtml = result.productListHTML;
                    }
                    this.loading = false;
                });
            }


        },
        computed: {
            dataExist() {
                // return this.posSaleData.length > 0;
            },
            langConfig() {
                let data = compoLangReport.filter(config => config.lang === this.langSessionReport)[0]['productList'];
                return data;
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
