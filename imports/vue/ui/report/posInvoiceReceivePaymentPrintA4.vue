<!--suppress ALL -->
<template>
    <div class="posInvoiceReceivePaymentPrintA4-report">
        <a4>
            <span slot="content" style="margin: 0px !important;">
                <div class="printInvoice">
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

                              <span style="text-align: center !important;font-size: 15px; border: 0px !important; float: right">
                                  <p style="font-family: 'Khmer OS Muol' !important;">វិក័យបត្របង់ប្រាក់</p>
                                  <p>Invoice Payment</p>
                              </span>
                              </div>
                          </div>
                          <br>
                          <div style="width: 100%; float: right">
                              <div style="width: 70% !important; float: left">
                                  {{langConfig['customer']}} : {{invoiceDoc && invoiceDoc.customerDoc && invoiceDoc.customerDoc.name || ""}}
                              </div>
                              <div style="width: 30% !important;float: right">
                                  {{langConfig['date']}} : {{invoiceDoc && invoiceDoc.receivePaymentDateName || ""}}
                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 70% !important;float: left">
                                  {{langConfig['address']}} : {{invoiceDoc && invoiceDoc.customerDoc && invoiceDoc.customerDoc.address || ""}}
                              </div>
                              <div style="width: 30% !important;float: right">
                                  {{langConfig['phoneNumber']}} : {{invoiceDoc && invoiceDoc.customerDoc && invoiceDoc.customerDoc.phoneNumber || ""}}
                              </div>
                          </div>
                      </caption>

                <thead style="margin-top: 5px">
                    <tr>
                        <td>{{langConfig['no']}}</td>
                        <td>{{langConfig['invoiceDate']}}</td>
                        <td>{{langConfig['invoiceNo']}}</td>
                        <td>{{langConfig['netAmount']}}</td>
                        <td>{{langConfig['paid']}}</td>
                        <td>{{langConfig['balanceUnpaid']}}</td>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="printInvoiceA4Html">

                </tbody>
            </table>
                                     <div style="width: 100% !important;">
                    <div style="width: 30%;text-align: center !important;float: left !important;">
                           <span style="font-family: 'Khmer OS Muol'">អ្នកទិញ/Buyer</span>
                    </div>

                    <div style="width: 40%;text-align: center !important;float: left !important;">
                        <span style="font-family: 'Khmer OS Muol'">អ្នកទទួល/Receiver</span>
                    </div>

                    <div style="width: 30%;text-align: center !important;float: left !important;">
                        <span style="font-family: 'Khmer OS Muol'">អ្នកលក់/Seller</span>
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
    import compoLangReport from '../../../../both/i18n/lang/elem-label-report';

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
                invoiceDoc: {},
                printInvoiceA4Html: "",
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
            handleRun(invoiceId) {
                this.loading = true;
                Meteor.call('posInvoiceReceivePaymentPrintA4Report', invoiceId, this.langConfig, (err, result) => {
                    if (result) {
                        this.printInvoiceA4Html = result.printInvoiceA4Html;
                        this.invoiceDoc = result.invoiceDoc;
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
                if (vm.printInvoiceA4Html != "" && vm.onLoad == true) {
                    setTimeout(function () {
                        window.print();
                        FlowRouter.go('/pos-sale/posReceivePayment');
                        vm.printInvoiceA4Html = "";
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
                let data = compoLangReport.filter(config => config.lang === this.langSessionReport)[0]['invoiceA4Print'];
                return data;
            }
        },
        components: {
            a4: PageA4
        }
    }
</script>
