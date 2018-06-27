<!--suppress ALL -->
<template>
    <div class="meter-change-report">
        <a4>
            <div slot="header" class="no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Meter Change Report Filter <i class="header-icon el-icon-info"></i>
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
                                                <el-select filterable v-model="params.category" placeholder="All">
                                                    <el-option
                                                            v-for="item in categoryOptions"
                                                            :label="item.label"
                                                            :value="item.value" :key="item._id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form-item>
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


            <span slot="content">

                  <table class="table table-striped">
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
                      </caption>
                    <thead>
                     <!--<tr>
                        <td colspan="7" rowspan="3"><img style="width: 100px;height: 100px;float: left;" src="/mih.png"
                                                         alt=""><span
                                style="float: left; font-family: 'Khmer OS Muol light','Khmer OS Muol'; font-size: 15px;margin-left: 20px;"><br>
                            <p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p>
                        </span></td>
                    </tr>-->
                     <tr></tr>
                     <tr></tr>
                    <tr>
                        <td colspan="7" style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 15px;">របាយការណ៍ប្តូរម៉ែត្រ</td>
                    </tr>
                    <tr>
                        <th style="text-align: left !important;">No</th>
                        <th style="text-align: left !important;">Id</th>
                        <th style="text-align: left !important;">Name</th>
                        <th style="text-align: left !important;">DPC</th>
                        <th style="text-align: left !important;">Previous Reading</th>
                        <th style="text-align: left !important;">Meter Install Data</th>
                        <th style="text-align: left !important;">Change Date</th>
                    </tr>
                    </thead>

                    <tbody>
                     <slot v-for="(meterCh,index) in meterChanges">
                         <tr>
                            <td>{{index + 1}}</td>
                            <td>{{meterCh.history.customerId}}</td>
                            <td>{{meterCh.history.khName}}</td>
                            <td>{{meterCh.history.dpc}}</td>
                            <td>{{meterCh.newContract.newReadingOfOldMeter}}</td>
                            <td>{{meterCh.newContract.newReading}}</td>
                            <td>{{meterChmodifiedDate | momentFormat}}</td>
                        </tr>
                     </slot>
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
                districtOptions: [],
                quartierOptions: [],
                blockOptions: [],
                categoryOptions: [],
                params: {
                    district: '',
                    quartier: '',
                    block: '',
                    category: '',
                    date: null,
                },
                waterBillingSetup: {khName: '', enName: ''},
                exportLoading: false,
                meterChanges: [],
                rolesArea: '',
                loading: false,
                activeName: '1',
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

        created() {
            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })
            Meteor.call('fetchCategoryData', (err, result) => {
                if (result) {
                    this.categoryOptions = result;
                }
            });
        },
        computed: {
            dataExist() {
                return this.meterChanges.length > 0;
            }
        },
        methods: {
            exportToExcel() {
                Meteor.call('giveMeMeterChangeReportAsExcelFile', this.meterChanges, (err, workbookBuffer) => {
                    if (!err) {
                        //call mixin saveAs from '/imports/api/mixins/file-saver-fn.js'
                        this.saveAs(workbookBuffer, 'MeterChange');
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
                debugger;
                this.loading = true;
                Meteor.call('meterChangeReport', this.params, (err, result) => {
                    if (!err) {
                        this.meterChanges = result;
                    }
                    this.loading = false;
                });
            },
            formatDate(val) {
                return moment(val).format('DD-MM-YYYY');
            }
        },
        components: {
            a4: PageA4
        },
        watch: {
            'params.district'(val) {
                this.fetchQuartierByDistrictId(val);
            },
            'params.quartier'(val) {
                this.fetchBlockByQuariterId(val);
            },
            rolesArea(val) {
                this.fetchDistrictData(val);
            }
        },
    }
</script>
