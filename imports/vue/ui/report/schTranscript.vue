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


                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">{{waterBillingSetup.ministryKhName || ""}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">{{waterBillingSetup.ministryEnName || ""}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">{{waterBillingSetup.khName}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">    {{waterBillingSetup.enName}}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">    លេខ៖ .............................{{waterBillingSetup.khShortName}}</p>

                                            </span>

                              <span style="text-align: center;font-size: 15px; border: 0px !important; float: right;"
                              >
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">ព្រះរាជាណាចក្រកម្ពុជា</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">Kingdom Of Cambodia</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                                  <p style="font-family: 'Khmer OS Muol' !important; margin-bottom: 0px !important;"
                                     class="blueOnPrint">Nation Religion King</p>
                                  <p style="font-family:tacteing;font-size: 40px; margin: 0px !important;">6</p>

                              </span>
                              </div>
                          </div>
                          <br>
                          <div class="row">
                              <div class="col-md-12  balckOnPrint" style="text-align: center;">
                                  ACADEMIC TRANSCRIPT
                                  <br>
                                  <p style="font-family:tacteing ">rs</p>
                              </div>
                          </div>
                          <div style="width: 100%; float: right">
                              <div style="width: 20% !important; float: left">
                                  Name
                              </div>
                              <div style="width: 80% !important;float: right">
                                  : {{transcriptDoc && transcriptDoc.studentDoc && transcriptDoc.studentDoc.personal && transcriptDoc.studentDoc.personal.latinName || ""}}
                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 20% !important; float: left">
                                  Date of Birth
                              </div>
                              <div style="width: 80% !important;float: right">
                                  : {{transcriptDoc && transcriptDoc.studentDoc && transcriptDoc.studentDoc.personal && transcriptDoc.studentDoc.personal.dob | switchDate}}

                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 20% !important; float: left">
                                  Place of Birth
                              </div>
                              <div style="width: 80% !important;float: right">
                                : {{transcriptDoc && transcriptDoc.studentDoc && transcriptDoc.studentDoc.personal && transcriptDoc.studentDoc.personal.provinceCurrent || ""}}

                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 20% !important; float: left">
                                  Degree
                              </div>
                              <div style="width: 80% !important;float: right">
                                  : {{majorDoc && majorDoc.degree || ""}}

                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 20% !important; float: left">
                                  Faculty
                              </div>
                              <div style="width: 80% !important;float: right">
                                  : {{facultyDoc && facultyDoc.name || ""}}

                              </div>
                          </div>
                          <div style="width: 100%">
                              <div style="width: 20% !important; float: left">
                                  Academic Year
                              </div>
                              <div style="width: 80% !important;float: right">
                                : {{transcriptDoc && transcriptDoc.yearFrom || ""}} - {{transcriptDoc && transcriptDoc.yearTo || ""}}

                              </div>
                          </div>
                      </caption>
                <thead style="margin-top: 5px;-webkit-print-color-adjust: exact !important;">
                    <tr class="back_color"
                        style="-webkit-print-color-adjust: exact !important;">
                        <th class="report-center" rowspan="2" style="width: 6% !important;">Year</th>
                        <th colspan="5" class="report-center" style="width:47% !important;">Semester I</th>
                        <th colspan="5" class="report-center" style="width:47% !important;">Semester II</th>
                    </tr>
                <tr style="font-size: 12pz !important;-webkit-print-color-adjust: exact !important;">
                        <th class="report-center" style="width: 200px !important;">Course Title</th>
                        <th class="report-center">Cr</th>
                        <th class="report-center">Gr</th>
                        <th class="report-center">GP</th>
                        <th class="report-center">GPA</th>
                        <th class="report-center" style="width: 200px !important;">Course Title</th>
                        <th class="report-center">Cr</th>
                        <th class="report-center">Gr</th>
                        <th class="report-center">GP</th>
                        <th class="report-center">GPA</th>

                </tr>
                <tr></tr>
                </thead>
                <tbody style="margin-bottom: 5px;font-size: 12px !important;" class="transcript"
                       v-html="printTranscriptHtml">
                </tbody>
                    <thead>
                        <tr></tr>
                     <tr>
                            <td colspan="6"
                                style="text-align: center; font-size: 12px;border: 0px !important;"></td>
                            <td colspan="4"
                                style="text-align: left; font-size: 12px;border: 0px !important;">
                                <br><br><br>
                                <hr>
                                {{waterBillingSetup.province}}...............................................................................<br>
                                {{waterBillingSetup.director}}<br>
                                Director of Institute
                            </td>
                         <td style="text-align: center; font-size: 12px;border: 0px !important;"></td>
                        </tr>
                    </thead>
            </table>
<footer style="border-top: 1px solid darkblue; text-align: center !important; font-size: 10px !important;">
  <p style="padding: 0px !important; margin: 0px !important;">
       អាស័យដ្ឋានទំនាក់ទំនង ៖ {{waterBillingSetup.khAddress || ""}}
  </p>
    <p style="padding: 0px !important;; margin: 0px !important;">
       Address : {{waterBillingSetup.address || ""}}
  </p>
    <p style="padding: 0px !important;; margin: 0px !important;"> Tel : {{waterBillingSetup.phoneNumber}}, Fax: {{waterBillingSetup.phoneNumber}}, Website : {{waterBillingSetup.website}}, Email : {{waterBillingSetup.email}}</p>
</footer>
                    </div>
           </span>
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import {GenerateFile} from '/imports/api/mixins/file-saver-fn.js';
    import '../../../../client/config/plugin/plugin';
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
                invoiceDoc: {},
                printTranscriptHtml: "",
                labelPosition: 'top',
                waterBillingSetup: {
                    khName: '',
                    enName: '',
                    address: "",
                    phoneNumber: ""
                },
                transcriptDoc: {},
                majorDoc: {},
                facultyDoc: {},

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
                        this.transcriptDoc = result.transcriptDoc;
                        this.majorDoc = result.majorDoc;
                        this.facultyDoc = result.facultyDoc;
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
                if (vm.printTranscriptHtml !== "" && vm.onLoad === true) {
                    setTimeout(function () {
                        window.print();
                        vm.printTranscriptHtml = "";
                        FlowRouter.go('/sch-data/schStudent');
                    }, 600);

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
