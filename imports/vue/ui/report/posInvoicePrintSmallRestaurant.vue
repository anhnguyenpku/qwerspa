<!--suppress ALL -->
<template>
    <div class="posInvoicePrintSmallRestaurant-report">
        <smallForm>
            <span slot="content" style="margin: 0px !important;">
                <div class="printInvoice">
                <table class="table table-bordered">
                      <caption style="padding-top: 0px !important;">
                          <div class="row"
                               style="text-align: center !important;display: flex !important;align-items: center !important;justify-content: center !important;margin-left: -60px !important;">
                                     <img style="width: 50px;height: 50px;vertical-align: baseline !important;"
                                          src="/mih.png"
                                          :onLoad="onLoadHandler()"
                                          alt="">
                                        <span style="font-family: 'Khmer OS Muol light','Khmer OS Muol';font-size: 12px !important;vertical-align: middle !important;">
                                            <p style="margin-bottom: 0px !important;">{{waterBillingSetup.khName}}</p><p
                                                style="margin-bottom: 0px !important;">{{waterBillingSetup.enName}}</p>

                            <p class="row"
                               style="text-align: center !important;font-family:'Khmer OS Battambang';font-size: 8px !important;">
                                  {{waterBillingSetup.address}}
                          </p>
                                        </span>
                          </div>
                          <br>
                          <div style="width: 100%; float: right">
                               <div style="width: 50% !important;float: left">
                                  {{langConfig['date']}} : {{invoiceDoc && invoiceDoc.invoiceDateName || ""}}
                              </div>
                              <div style="width: 50% !important; float: right">
                                  {{langConfig['invoiceNo']}} : {{invoiceDoc && invoiceDoc.invoiceNo || ""}}
                              </div>

                          </div>

                      </caption>
                <thead style="margin-top: 5px">
                    <tr>
                        <td>{{langConfig['no']}}</td>
                        <td>{{langConfig['productName']}}</td>
                        <td>{{langConfig['qty']}}</td>
                        <td>{{langConfig['price']}}</td>
                        <td>{{langConfig['total']}}</td>
                    </tr>
                </thead>
                <tbody style="margin-bottom: 5px;" v-html="printInvoiceSmallRestaurantHtml">
                </tbody>


            </table>
                    </div>
           </span>
        </smallForm>
    </div>
</template>

<script>
    import PageSmall from '/imports/vue/ui/report/page/PageSmall.vue';
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
                printInvoiceSmallRestaurantHtml: "",
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
                Meteor.call('posInvoicePrintSmallRestaurantReport', invoiceId, this.langConfig, (err, result) => {
                    if (result) {
                        this.printInvoiceSmallRestaurantHtml = result.printInvoiceSmallRestaurantHtml;
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
                if (vm.printInvoiceSmallRestaurantHtml != "" && vm.onLoad === true) {
                    setTimeout(function () {
                        window.print();
                        FlowRouter.go("/pos-sale/posTableBoard");
                        vm.printInvoiceSmallRestaurantHtml = "";
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
            smallForm: PageSmall
        }
    }
</script>
