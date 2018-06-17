<!--suppress ALL -->
<template>
    <div class="schTranscript-report">
        <a4>
            <span slot="content" style="margin: 0px !important;">
                <div class="printInvoice">
                <table class="table table-bordered">
                      <caption style="padding-top: 0px !important;">
                          <div class="row">
                                <div class="col-md-12" style="text-align: center !important;">
                                    <img style="width: auto;height: 100px; float: left;padding-top: 20px !important;"
                                         src="/mih.png"
                                         alt=""
                                         :onLoad="onLoadHandler()">
                                        <span class="blueOnPrint"
                                              style="font-family:Khmer os muol; font-size: 15px  !important;padding-top: 15px !important;float: left;text-align: left !important;">

                                              <p style="font-family: 'Khmer OS Muol' !important;">ក្រសួងការងារ និង បណ្តុបណ្តាលវិជ្ជាជីវៈ</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;">Ministry of Labor and Vocational Training</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;">{{waterBillingSetup.khName}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;">    {{waterBillingSetup.enName}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;">    លេខ៖ .............................វ.ព.ភ.ត.ស.ប</p>

                                            </span>

                              <span style="text-align: center;font-size: 15px; border: 0px !important; float: right;"
                                    class="blueOnPrint">
                                  <p style="font-family: 'Khmer OS Muol' !important;">ព្រះរាជាណាចក្រកម្ពុជា</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;">Kingdom Of Cambodia</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;">Nation Religion King</p>
                              </span>
                              </div>
                          </div>
                          <br>
                          <div class="row">
                              <div class="col-md-12  balckOnPrint" style="text-align: center;">
                                  ACADEMIC TRANSCRIPT
                                  <br>
                                  
                              </div>
                          </div>
                          <div style="width: 100%; float: right">
                              <div style="width: 70% !important; float: left">
                                  {{langConfig['customer']}} : {{invoiceDoc && invoiceDoc.customerDoc && invoiceDoc.customerDoc.name || ""}}
                              </div>
                              <div style="width: 30% !important;float: right">
                                  {{langConfig['date']}} : {{invoiceDoc && invoiceDoc.invoiceDateName || ""}}
                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 70% !important;float: left">
                                  {{langConfig['address']}} : {{invoiceDoc && invoiceDoc.customerDoc && invoiceDoc.customerDoc.address || ""}}
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
                <tbody style="margin-bottom: 5px;" v-html="printTranscriptHtml">

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
                printTranscriptHtml: "",
                labelPosition: 'top',
                waterBillingSetup: {
                    khName: '',
                    enNamer: '',
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
            this.handleRun(FlowRouter.query.get('studentId'), FlowRouter.query.get('majorId'));
        },
        methods: {
            handleRun(studentId, majorId) {
                this.loading = true;
                Meteor.call('schTranscriptReport', studentId, majorId, this.langConfig, (err, result) => {
                    if (result) {
                        this.printTranscriptHtml = result.printTranscriptHtml;
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
                if (vm.printTranscriptHtml != "" && vm.onLoad == true) {
                    setTimeout(function () {
                        window.print();
                        FlowRouter.go('/sch-data/schStudent');
                        vm.printTranscriptHtml = "";
                        vm.$message({
                            duration: 1000,
                            message: this.langConfig['saveSuccess'],
                            type: 'success'
                        });

                    }, 400);

                }
            })
        },
        computed: {
            langConfig() {
                let data = compoLangReport.filter(config => config.lang === this.langSessionReport)[0]['transcript'];
                return data;
            }
        },
        components: {
            a4: PageA4
        }
    }
</script>
