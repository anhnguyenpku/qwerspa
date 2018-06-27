<!--suppress ALL -->
<template>
    <div class="daikaom-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Block Summary Report Filter <i class="header-icon el-icon-info"></i>
                        </span>
                                <el-form :inline="true">
                                    <el-row type="flex" class="row-bg" justify="center">
                                        <el-form-item label="Date">
                                            <el-date-picker
                                                    v-model="params.date"
                                                    type="daterange"
                                                    :picker-options="pickerDateOptions"
                                                    placeholder="Select time range"
                                                    align="right">
                                            </el-date-picker>

                                        </el-form-item>
                                        <el-form-item label="District">
                                            <el-select filterable v-model="params.district" placeholder="All">
                                                <el-option
                                                        v-for="item in districtOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Quartier">
                                            <el-select filterable v-model="params.quartier" placeholder="All">
                                                <el-option
                                                        v-for="item in quartierOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Block">
                                            <el-select filterable v-model="params.block" placeholder="All">
                                                <el-option
                                                        v-for="item in blockOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="Category">
                                            <el-select filterable v-model="params.category" clearable placeholder="All">
                                                <el-option
                                                        v-for="item in categoryOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- just custom will update later-->
                                        <el-form-item label="Divide">
                                            <el-select filterable v-model="params.divideUpDown" placeholder="All">
                                                <el-option
                                                        v-for="item in divideOptions"
                                                        :label="item.label"
                                                        :value="item.value" :key="item._id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- --------------------------- -->
                                        <label>វិភាគទានលូទឹកស្អុយ</label>
                                        <el-switch
                                                v-model="params.isContributionFee"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                on-value="1"
                                                off-value="0">
                                        </el-switch>
                                    </el-row>
                                </el-form>
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           size="small">RUN
                                </el-button>
                                <el-button v-show="dataExist" :loading="exportLoading" type="success"
                                           @click="exportToExcel" size="small"><i class="fa fa-file-excel-o"></i>
                                    Export to Excel
                                </el-button>
                            </el-collapse-item>
                        </el-collapse>
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
                                     </span>

                                </div>
                          </div>
                          <div class="row">
                              <div class="col-md-3">
                                  លេខ..........រ.ទ
                              </div>
                              <div class="col-md-6"
                                   style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px; border: 0px !important;">
                                  <p>ដីការអមតាមប្លុក</p>ប្រចាំខែ {{daikaom.monthFooter | switchMonthToKh}} ឆ្នាំ {{daikaom.yearFooter | switchNumMultiToKh}}
                              </div>
                              <div class="col-md-3">

                              </div>
                          </div>
                      </caption>
                    <thead style="margin-top: 5px">
                    <tr>
                        <th rowspan="2" style="vertical-align: middle">ប្លុក</th>
                        <th rowspan="2" style="vertical-align: middle">កម្រិត</th>
                        <th colspan="4" style="padding: 10px !important;">ចំនួនវិក័យបត្រ</th>
                        <th colspan="4" style="padding: 10px !important;">បរិំាណទឹកប្រើប្រាស់</th>
                        <th colspan="4" style="padding: 10px !important;">ទឹកប្រាក់ប្រើប្រាស់ទឹក</th>
                        <th rowspan="2" style="vertical-align:middle; text-align: center;padding: 0px !important">ថែកុងទ័រ</th>
                        <th rowspan="2" style="vertical-align:middle; text-align: center;padding: 0px !important">វិភាគទានលូ</th>
                        <th rowspan="2" style="vertical-align: middle; padding: 0px">ទឹកប្រាក់សរុប</th>
                    </tr>
                    <tr>
                        <th style="vertical-align:middle; text-align: center; !important;">ជីវភាព</th>
                        <th style="vertical-align:middle; text-align: center;!important;">អាជីវកម្ម</th>
                        <th style="vertical-align:middle; text-align: center;!important;">រដ្ឋនិងសួន</th>

                        <th style="vertical-align: middle">សរុប</th>
                        <th style="padding: 10px;">ជីវភាព</th>
                        <th style="padding: 10px;">អាជីវកម្ម</th>
                        <th style="padding: 10px;">រដ្ឋនិងសួន</th>
                        <th style="padding: 10px;">សរុប</th>
                       <th style="padding: 10px;">ជីវភាព</th>
                        <th style="padding: 10px;">អាជីវកម្ម</th>
                        <th style="padding: 10px;">រដ្ឋនិងសួន</th>
                        <th style="padding: 10px;">សរុប</th>
                    </tr>
                    </thead>

                    <tbody style="margin-bottom: 5px;">
                        <slot v-for="blockData in daikaom.data">
                            <tr>
                                <td rowspan="3"
                                    style="vertical-align: middle; text-align: left !important;">{{blockData._id.district + blockData._id.quartier + blockData._id.block}}</td>
                                <td style="text-align: left !important;">ក១:</td>
                                <td>{{blockData.invoiceDomestic1 | numFormatRiel}}</td>
                                <td>{{blockData.invoiceCommercial1 | numFormatRiel}}</td>
                                <td>{{blockData.invoiceAdmin1 | numFormatRiel}}</td>
                                <td>{{blockData.invoicelevel1 | numFormatRiel}}</td>
                                <!--<td>{{blockData.totalInvoiceNotZero | numFormatRiel}}</td>-->
                                <td>{{blockData.qtyDomesticlevel1 | numFormatRiel}}</td>
                                <td>{{blockData.qtyCommerciallevel1 | numFormatRiel}}</td>
                                <td>{{blockData.qtyAdminlevel1 | numFormatRiel}}</td>
                                <td>{{blockData.qtyDomesticlevel1 + blockData.qtyCommerciallevel1 + blockData.qtyAdminlevel1 | numFormatRiel}}</td>

                                <td>{{blockData.priceDomesticlevel1 | numFormatRiel}}</td>
                                <td>{{blockData.priceCommerciallevel1 | numFormatRiel}}</td>
                                <td>{{blockData.priceAdminlevel1 | numFormatRiel}}</td>
                                <td>{{blockData.priceDomesticlevel1 + blockData.priceCommerciallevel1 + blockData.priceAdminlevel1 | numFormatRiel}}</td>

                                <td rowspan="3"
                                    style="vertical-align: middle">{{blockData.totalMaintenance | numFormatRiel}}</td>
                                <td rowspan="3"
                                    style="vertical-align: middle">{{blockData.totalContributionFee | numFormatRiel}}</td>
                                <th rowspan="3"
                                    style="vertical-align: middle">{{blockData.totalMaintenance + blockData.total+ blockData.totalContributionFee | numFormatRiel}}</th>
                            </tr>
                            <tr>
                                <td style="text-align: left !important;">ក២:</td>
                                <td>{{blockData.invoiceDomestic2 | numFormatRiel}}</td>
                                <td>{{blockData.invoiceCommercial2 | numFormatRiel}}</td>
                                <td>{{blockData.invoiceAdmin2 | numFormatRiel}}</td>
                                <td>{{blockData.invoicelevel2 | numFormatRiel}}</td>

                                <td>{{blockData.qtyDomesticlevel2 | numFormatRiel}}</td>
                                <td>{{blockData.qtyCommerciallevel2 | numFormatRiel}}</td>
                                <td>{{blockData.qtyAdminlevel2 | numFormatRiel}}</td>
                                <td>{{blockData.qtyDomesticlevel2 + blockData.qtyCommerciallevel2 + blockData.qtyAdminlevel2 | numFormatRiel}}</td>


                                <td>{{blockData.priceDomesticlevel2 | numFormatRiel}}</td>
                                <td>{{blockData.priceCommerciallevel2 | numFormatRiel}}</td>
                                <td>{{blockData.priceAdminlevel2 | numFormatRiel}}</td>
                                <td>{{blockData.priceDomesticlevel2 + blockData.priceCommerciallevel2 + blockData.priceAdminlevel2 | numFormatRiel}}</td>

                            </tr>
                            <tr>
                                <th style="text-align: left !important;">សរុប</th>
                                <td>{{blockData.invoiceDomestic1 + blockData.invoiceDomestic2 | numFormatRiel}}</td>
                                <td>{{blockData.invoiceCommercial1 + blockData.invoiceCommercial2 | numFormatRiel}}</td>
                                <td>{{blockData.invoiceAdmin1 + blockData.invoiceAdmin2 | numFormatRiel}}</td>
                                <th>{{blockData.invoicelevel1 + blockData.invoicelevel2 | numFormatRiel}}</th>
                                <td>{{blockData.qtyDomesticlevel1 + blockData.qtyDomesticlevel2 | numFormatRiel}}</td>
                                <td>{{blockData.qtyCommerciallevel1 + blockData.qtyCommerciallevel2 | numFormatRiel}}</td>
                                <td>{{blockData.qtyAdminlevel1 + blockData.qtyAdminlevel2 | numFormatRiel}}</td>
                                <th>{{blockData.totalConsumption | numFormatRiel}}</th>

                                <td>{{blockData.priceDomesticlevel1 + blockData.priceDomesticlevel2 | numFormatRiel}}</td>
                                <td>{{blockData.priceCommerciallevel1 + blockData.priceCommerciallevel2 | numFormatRiel}}</td>
                                <td>{{blockData.priceAdminlevel1 + blockData.priceAdminlevel2 | numFormatRiel}}</td>

                                <th>{{blockData.total | numFormatRiel}}</th>
                            </tr>
                        </slot>
                            <tr>
                               <th colspan="5" style="text-align: right">Total Invoice : </th>
                               <th>{{daikaom.grandTotalInvoice | numFormatRiel}}</th>
                               <th colspan="3" style="text-align: right">Total Consumption : </th>
                               <th>{{daikaom.grandTotalComsumption | numFormatRiel}}</th>
                               <th colspan="3" style="text-align: right">Total Price : </th>
                               <th>{{daikaom.grandTotalPrice | numFormatRiel}}</th>
                               <th>{{daikaom.grandTotalMaintenance | numFormatRiel}}</th>
                               <th>{{daikaom.grandTotalContributionFee | numFormatRiel}}</th>
                               <th>{{daikaom.grandTotalMaintenance + daikaom.grandTotalPrice+ daikaom.grandTotalContributionFee | numFormatRiel}}</th>

                            </tr>

                    </tbody>
                    <thead>
                        <tr></tr>
                        <tr>
                            <td colspan="4"
                                style="text-align: center; font-size: 11px;border: 0px !important;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{daikaom.dayFooter | switchNumMultiToKh}}    ខែ  {{daikaom.monthFooter | switchMonthToKh}}   ឆ្នាំ {{daikaom.yearFooter | switchNumMultiToKh}}   <br><span
                                    style="font-family: 'Khmer OS System'"><b>អង្គភាពរដ្ឋាករទឹកបាត់ដំបង</b></span><br><span
                                    style="font-family: 'Khmer OS Muol'">ប្រធាន</span></td>
                            <td colspan="4"
                                style="text-align: center; font-size: 11px;border: 0px !important;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{daikaom.dayFooter | switchNumMultiToKh}}    ខែ  {{daikaom.monthFooter | switchMonthToKh}}   ឆ្នាំ  {{daikaom.yearFooter | switchNumMultiToKh}}  <br><span
                                    style="font-family: 'Khmer OS System'"><b>ប្រធាន ផ្នែក គណនេយ្យ</b></span></td>
                            <td colspan="5"
                                style="text-align: center; font-size: 11px;border: 0px !important;">បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>បាត់ដំបង ថ្ងៃទី {{daikaom.dayFooter | switchNumMultiToKh}}    ខែ  {{daikaom.monthFooter | switchMonthToKh}}   ឆ្នាំ  {{daikaom.yearFooter | switchNumMultiToKh}}  <br><span
                                    style="font-family: 'Khmer OS System'"><b>ប្រធាន ផ្នែក អាជីវកម្ម</b></span></td>
                            <td colspan="4"
                                style="text-align: center; font-size: 11px;border: 0px !important;">បាត់ដំបង ថ្ងៃទី  {{daikaom.dayFooter | switchNumMultiToKh}}    ខែ   {{daikaom.monthFooter | switchMonthToKh}}    ឆ្នាំ  {{daikaom.yearFooter | switchNumMultiToKh}}   <br><br><b>អ្នកធ្វើតារាង</b><br><br></td>
                        </tr>
                    </thead>
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
                params: {
                    district: '',
                    quartier: '',
                    block: '',
                    category: '',
                    tariff: '',
                    isContributionFee: "1",
                    date: null,
                    divideUpDown: ''
                },
                divideOptions: [
                    {value: "", label: "All"},
                    {value: "down", label: "Down"},
                    {value: "up", label: "Up"}
                ],
                rolesArea: '',
                activeName: '1',
                daikaom: {
                    data: [],
                    total: 0
                },
                waterBillingSetup:{
                    khName:'',
                    enNamer:'',
                    cutValue:0
                },
                districtOptions: [],
                quartierOptions: [],
                blockOptions: [],
                loading: false,
                exportLoading: false,
                categoryOptions: [],
                tariffOptions: [],
                pickerDateOptions: {
                    shortcuts: [{
                        text: 'Last week',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
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
                    }, {
                        text: 'This month',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Today',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            }
        },
        watch: {
            'params.district'(val) {
                this.fetchQuartierByDistrictId(val);
                this.params.quartier = "";

            },
            'params.quartier'(val) {
                this.fetchBlockByQuariterId(val);
                this.params.block = "";
            },
            rolesArea(val) {
                this.fetchDistrictData(val);
            }
        },
        created() {
            Meteor.call('getWaterBillingSetup',Session.get('area'),(err,result)=>{
                if(result){
                    this.waterBillingSetup=result;
                }
            })
            Meteor.call('fetchCategoryData', (err, result) => {
                if (result) {
                    this.categoryOptions = result;
                }
            });
        },
        methods: {
            exportToExcel() {
                Meteor.call('giveMeSaleReportAsExcelFile', this.daikaom.data, this.daikaom.total, (err, workbookBuffer) => {
                    if (!err) {
                        //call mixin saveAs from '/imports/api/mixins/file-saver-fn.js'
                        this.saveAs(workbookBuffer, 'SaleReport');
                    }
                })
            },
            fetchDistrictData(rolesArea) {
                Meteor.call('fetchGeneralDistrictData', {rolesArea}, (err, result) => {
                    if (result) {
                        this.districtOptions = result;
                    }
                });
            },
            fetchQuartierByDistrictId(districtId) {
                Meteor.call('fetchQuartierByDistrictCodeId', districtId, (err, result) => {
                    if (result) {
                        this.quartierOptions = result;
                    }
                });
            },
            fetchBlockByQuariterId(quartierId) {
                Meteor.call('fetchBlockByQuartierCode', quartierId, (err, result) => {
                    if (result) {
                        this.blockOptions = result;
                    }
                });
            },
            handleRun() {
                this.daikaom = {};
                this.loading = true;

                if (this.params.date == "" || this.params.date == undefined) {
                    alertify.error("Date can't not empty!!");
                    this.loading = false;
                    return false;
                }
                let selector={};
                if (this.params.divideUpDown != "") {
                    let cutValue=this.waterBillingSetup.cutValue+"";
                    selector.street = this.params.divideUpDown == "up" ? {$gt: cutValue} : {$lte: cutValue};
                }
                Meteor.call('daikaomReport', this.params,selector, (err, result) => {
                    if (result) {
                        console.log(result);
                        this.daikaom = result;
                    }
                    this.loading = false;
                });
            }
        },
        computed: {
            dataExist() {
                return this.daikaom != undefined;
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
