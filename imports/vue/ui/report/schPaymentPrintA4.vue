<!--suppress ALL -->
<template>
    <div class="schPaymentPrintA4-report">
        <a4>
            <span slot="content" style="margin: 0px !important;">
                <div class="printPayment">
                <table class="table table-bordered">
                      <caption style="padding-top: 0px !important;">
                          <div class="row">
                                <div class="col-md-12" style="text-align: left !important;">
                                    <img style="width: auto;height: 100px; float: left;" src="/mih.png" alt=""
                                         :onLoad="onLoadHandler()">
                                        <span style="font-family:Khmer os muol; font-size: 15px; !important;float: left;">
                                            {{waterBillingSetup.khName}}<p>{{waterBillingSetup.enName}}</p>

                                            <p style="font-size: 9px !important; font-family: khmer os Battambang; margin-bottom: 0px !important;">
                                                {{waterBillingSetup && waterBillingSetup.address}}</p>
                                            </span>

                              <span style="text-align: center;font-size: 15px; border: 0px !important; float: right">
                                  <p style="font-family: 'Khmer OS Muol' !important;">វិក័យបត្រ</p>
                                  Payment<p class="paymentNo">{{paymentDoc && paymentDoc.paymentNo || ""}}</p>
                              </span>
                              </div>
                          </div>
                          <br>
                          <div style="width: 100%; float: right">
                              <div style="width: 70% !important; float: left">
                                  {{langConfig['student']}} : {{paymentDoc && paymentDoc.studentDoc && paymentDoc.studentDoc.personal.name || ""}}
                              </div>
                              <div style="width: 30% !important;float: right">
                                  {{langConfig['date']}} : {{paymentDoc && paymentDoc.paymentDateName || ""}}
                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 100% !important;float: left">
                                  {{langConfig['address']}} : {{paymentDoc && paymentDoc.studentDoc && paymentDoc.studentDoc.personal.villageCurrent || ""}}  {{paymentDoc && paymentDoc.studentDoc && paymentDoc.studentDoc.personal.communeCurrent || ""}}  {{paymentDoc && paymentDoc.studentDoc && paymentDoc.studentDoc.personal.districtCurrent || ""}}  {{paymentDoc && paymentDoc.studentDoc && paymentDoc.studentDoc.personal.provinceCurrent || ""}}
                              </div>
                          </div>
                      </caption>

                <thead style="margin-top: 5px">
                    <tr>
                        <td>{{langConfig['startDate']}}</td>
                        <td>{{langConfig['endDate']}}</td>
                        <td>{{langConfig['description']}}</td>
                        <td>{{langConfig['price']}}</td>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="printPaymentA4Html">

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
    import compoLangReport from '../../../../both/i18n/lang/elem-label-sch-report';

    export default {
        mixins: [GenerateFile],
        mounted() {
            this.$jQuery('body').off();

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
                paymentDoc: {},
                printPaymentA4Html: "",
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
            this.handleRun(FlowRouter.query.get('pmt'));
        },
        methods: {
            handleRun(paymentId) {
                this.loading = true;
                Meteor.call('schPaymentPrintA4Report', paymentId, this.langConfig, (err, result) => {
                    if (result) {
                        this.printPaymentA4Html = result.printPaymentA4Html;
                        this.paymentDoc = result.paymentDoc;
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
                if (vm.printPaymentA4Html != "" && vm.onLoad == true) {
                    setTimeout(function () {
                        window.print();
                        FlowRouter.go('/sch-data/schPayment');
                        vm.printPaymentA4Html = "";
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
                let data = compoLangReport.filter(config => config.lang === this.langSessionReport)[0]['paymentA4Print'];
                return data;
            }
        },
        components: {
            a4: PageA4
        }
    }
</script>
