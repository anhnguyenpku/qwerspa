<!--suppress ALL -->
<template>
    <div class="customer-report">
        <a4>
            <div slot="header" class=" no-print">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-collapse v-model="activeName" accordion>
                            <el-collapse-item name="1">
                        <span slot="title">
                            Customer Report Filter <i class="header-icon el-icon-information"></i>
                        </span>
                                <el-form :inline="true">
                                    <el-row type="flex" class="row-bg" justify="center">
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
                                    </el-row>
                                </el-form>
                                <el-button :loading="loading" @click="handleRun" type="primary" icon="caret-right"
                                           size="small">RUN
                                </el-button>
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>
            </div>
            <!--<span slot="content">-->
            <!--<el-row :gutter="10">-->
            <!--<el-col :span="24">-->
            <!--<h5 align="center"><u>Customer Report</u></h5>-->
            <!--<el-table v-loading.body="loading" :data="customers" height="500" border-->
            <!--:default-sort="{prop: 'date', order: 'descending'}"-->
            <!--style="width: 100%">-->
            <!--<el-table-column prop="khName" label="Kh Name" sortable width="180"></el-table-column>-->
            <!--<el-table-column prop="name" label="Name" width="180"></el-table-column>-->
            <!--<el-table-column prop="districtDoc.name" label="District"></el-table-column>-->
            <!--<el-table-column prop="quartierDoc.name" label="Quartier"></el-table-column>-->
            <!--<el-table-column prop="blockDoc.name" label="Block"></el-table-column>-->
            <!--<el-table-column prop="address" label="Address"></el-table-column>-->
            <!--</el-table>-->
            <!--</el-col>-->
            <!--<div v-for="(customer,index) in customers" key="customer._id" class="qrbox"-->
            <!--align="center">-->
            <!--<h5 style="font-family: 'Khmer OS Moulpali'"><b>{{company && company.khShortName}}</b></h5>-->
            <!--<p style="font-family: 'Khmer OS Battambang'">{{customer.khName}}<br>{{customer.streetNo}}<br>{{splitDpc(customer)}}</p>-->
            <!--<qrcode-vue background="#9E34AE" foreground="#fff" :value="customer._id" :size="qrcodeSize" level="H"></qrcode-vue>-->
            <!--<p>{{customer._id}}</p>-->
            <!--</div>-->
            <span slot="content">
                            <div v-for="(customer,index) in customers" :key="customer._id" class="qrbox" align="center">
                        <h5 style="font-family: 'Khmer OS Moulpali';margin-top: -5px !important;"><b>{{company && company.khShortName}}</b></h5>
                            <p style="font-family: 'Khmer OS Battambang'">{{truncate(customer.khName)}}<br>{{customer.streetNo}}<br>{{splitDpc(customer)}}</p>
                          <qrcode-vue background="white" foreground="#0038AF" :value="customer._id" :size="qrcodeSize"
                                      level="H"></qrcode-vue>
                            <p style="color: rgba(0,56,175,0.8) !important;">{{customer._id}}</p>
                    </div>
                </span>
            <!--</el-row>-->


            <!--</span>-->
        </a4>
    </div>
</template>

<script>
    import PageA4 from '/imports/vue/ui/report/page/PageA4.vue';
    import QrcodeVue from 'qrcode.vue';
    import _ from 'lodash';
    export default {
        data() {
            return {
                company: null,
                qrcodeSize: 100,
                params: {
                    district: '',
                    quartier: '',
                    block: ''
                },
                rolesArea: '',
                activeName: '1',
                customers: [],
                districtOptions: [],
                quartierOptions: [],
                blockOptions: [],
                loading: false,

            }

        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            }
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
        methods: {
            truncate(val) {
                return _.truncate(val, {length: 15});
            },
            calcIndex(index) {
                return index % 14 === 0;
            },
            splitDpc(doc) {
                let dpcArr = doc.dpc.split('');
                let subDpc = dpcArr[0] + dpcArr[1] + " " + dpcArr[2] + dpcArr[3] + " " + dpcArr[4] + dpcArr[5] + " " + doc.folio + " " + doc.successor;
                return subDpc;
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
                this.loading = true;
                this.customers = [];
                Meteor.call('customerReport', this.params, (err, result) => {
                    if (!err) {
                        this.customers = result;
                    }
                    this.loading = false;
                });
            },
            getWaterBillingSetup() {
                Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                    if (!err) {
                        this.company = result;
                    }
                });
            }
        },
        components: {
            QrcodeVue,
            a4: PageA4
        },

        //life cycle
        created() {
            this.getWaterBillingSetup();
        }
    }
</script>

<style scoped>
    .qrbox {
        display: inline-block;
        border-top: 15px;
        height: 240px;
        width: 150px;
        border: 1px solid #000000 !important;
        padding: 15px;
        margin-top: 5px;
        margin-right: 2px;
        margin-left: 2px;
        background-color: rgba(255, 255, 255, 0);
        color: #000000;
        -webkit-print-color-adjust: exact;
        border-bottom: 5px;
        border-top: 5px;
        border-right: 5px;
        border-left: 5px;
    }
</style>
