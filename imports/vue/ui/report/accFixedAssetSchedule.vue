<!--suppress ALL -->
<template>
    <div class="accFixedAssetSchedule-report">
        <a4>
            <span slot="content" style="margin: 0px !important;">
                <div class="printPayment">
                <table class="table table-bordered">
                      <caption style="padding-top: 0px !important;">



<div class="row"
     style="text-align: center !important;display: flex !important;align-items: center !important;justify-content: center !important;margin-left: -100px !important;">
                                     <img style="width: 100px;height: 100px;vertical-align: baseline !important;"
                                          src="/mih.png"
                                          alt="">
                                        <span style="font-family: 'Khmer OS Muol light','Khmer OS Muol';font-size: 15px;vertical-align: middle !important;"><br>
                                            <p style="font-size: 18px;">{{waterBillingSetup.khName}}</p><p>{{waterBillingSetup.enName}}</p>

  <p class="row"
     style="text-align: center !important;font-family:'Khmer OS Battambang';font-size: 11 !important;">
                                  អាស័យដ្ឋាន ៖ {{waterBillingSetup.address}}
                          </p>
                          <p class="row"
                             style="text-align: center !important;font-family:'Khmer OS Battambang';font-size: 11 !important;">
                                  លេខទំនាក់ទំនង ៖ {{waterBillingSetup.phoneNumber}}
                          </p>
                                        </span>
                          </div>
                          <br>

                          <div class="row">
                              <div class="col-lg-3">
                              </div>
                              <div class="col-md-6"
                                   style="text-align: center; border: 0px !important;">
                                  <p style="font-family: 'Khmer OS Muol'; font-size: 15px;">{{langConfig['title']}}</p>
                              </div>
                              <div class="col-lg-3"></div>
                          </div>

                          <div class="row">
                              <div style="widows: 50% !important; float:right">
                                  {{langConfig['currency']}}: {{fixedAssetDoc.currencyId}}
                              </div>
                              <div style="width: 50% !important;">
                                  {{langConfig['buyDate']}}: {{fixedAssetDoc.buyDateName}}
                              </div>

                          </div>
                          <div class="row">
                              <div style="widows: 50% !important; float:right">
                                  {{langConfig['code']}}: {{fixedAssetDoc.code}}
                              </div>
                              <div style="width: 50% !important;">
                                  {{langConfig['note']}}: {{fixedAssetDoc.description}}
                              </div>

                          </div>
                      </caption>

                <thead style="margin-top: 5px">
                    <tr>
                        <td>{{langConfig['year']}}</td>
                        <td>{{langConfig['perMonth']}}</td>
                        <td>{{langConfig['perYear']}}</td>
                        <td>{{langConfig['cumDepre']}}</td>
                        <td>{{langConfig['bvEndYear']}}</td>
                        <td>{{langConfig['maxMonth']}}</td>
                        <td>{{langConfig['expenseMonth']}}</td>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="fixedAssetScheduleHtml">

                </tbody>


            </table>
                    </div>
           </span>
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import {GenerateFile} from '/imports/api/mixins/file-saver-fn.js';
    import compoLangReport from '../../../../both/i18n/lang/elem-label-acc-report';

    export default {
        mixins: [GenerateFile],
        data() {
            return {
                params: {
                    branch: '',
                    area: '',
                    date: null,
                },
                rolesArea: '',
                activeName: '1',
                fixedAssetDoc: {},
                fixedAssetScheduleHtml: "",
                labelPosition: 'top',
                waterBillingSetup: {
                    khName: '',
                    enName: '',
                    address: "",
                    phoneNumber: ""
                },

                loading: false,
                onLoad: false,
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
        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })
            this.handleRun(FlowRouter.query.get('inv'));
        },
        methods: {
            handleRun(paymentId) {
                this.loading = true;
                Meteor.call('accFixedAssetScheduleReport', paymentId, this.langConfig, (err, result) => {
                    if (result) {
                        this.fixedAssetScheduleHtml = result.fixedAssetScheduleHtml;
                        this.fixedAssetDoc = result.fixedAssetDoc;
                        this.loading = false;
                    } else {
                        this.loading = false;
                    }
                });
            },
            onLoadHandler: function () {
                this.onLoad = true;
            }
        },
        updated: function () {
            let vm = this;
            vm.$nextTick(function () {
                // Code that will run only after the
                // entire view has been rendered
                if (vm.fixedAssetScheduleHtml != "" && vm.onLoad == true) {
                    setTimeout(function () {
                        window.print();
                        FlowRouter.go('/acc-data/fixedAsset');
                        vm.fixedAssetScheduleHtml = "";
                        vm.$message({
                            duration: 1000,
                            message: vm.langConfig['saveSuccess'],
                            type: 'success'
                        });

                    }, 400);

                }
            })
        },

        computed: {
            langConfig() {
                let data = compoLangReport.filter(config => config.lang === this.langSessionReport)[0]['fixedAssetSchedule'];
                return data;
            }
        },
        components: {
            a4: PageA4
        }
    }
</script>
