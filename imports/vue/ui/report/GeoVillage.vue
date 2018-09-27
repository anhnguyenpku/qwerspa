<!--suppress ALL -->
<template>
    <div class="geo-village-report">
        <a4>
            <div slot="header">
                <el-row type="flex" class="row-bg no-print" justify="center">
                    <el-col :span="24" style="padding: 10px;">
                        <el-button type="primary" @click.native="handleRun">Run</el-button>
                        <el-button type="success" @click.native="exportToExcel">Export</el-button>
                    </el-col>
                </el-row>

            </div>
            <span slot="content">
                <div class="row">
                        <div class="col-md-3"><img
                                style="width: 100px;height: 100px;float: left;" src="/mih.png"
                                alt="">
                            <span style="float: left; font-family: 'Khmer OS Muol light','Khmer OS Muol'; font-size: 15px;margin-left: 20px;"><br>
                               <p>{{waterBillingSetup.khName}}</p> <p>{{waterBillingSetup.enName}}</p>
                            </span>
                        </div>
                </div>
                    <div class="row">
                        <div class="col-md-12"
                             style="text-align: center;font-family: 'Khmer OS Muol'; font-size: 16px; margin-bottom: 5px;text-decoration: underline;">
                            GEO VILLAGES
                        </div>
                    </div>

                    <table border="1" style="font-size:11px;width: 100%">
                        <thead>
                            <tr>
                                <td><b>ឃំុ</b></td>
                                <td><b>ភូមិ</b></td>
                                <td><b>ភូមិសាស្រ្ត</b></td>
                            </tr>
                            <slot v-for="village in villages">
                                <tr>
                                    <td>{{village.properties.NAME3}}</td>
                                    <td>{{village.properties.NAME}}</td>
                                    <td>{{village.properties.ADMIN_ID}}</td>
                                </tr>
                            </slot>
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
        mounted() {
            this.$jQuery('body').off();

        },
        data() {
            return {
                exportLoading: false,
                waterBillingSetup: {khName: '', enName: ''},
                user: null,
                rolesArea: '',
                loading: false,
                villages: []
            };
        },
        meteor: {
            rolesArea() {
                return Session.get('area');
            }
        },

        methods: {
            exportToExcel() {
                if (this.villages.length > 0) {
                    Meteor.call('village_exportVillages', this.villages, (err, workbookBuffer) => {
                        if (!err) {
                            //call mixin saveAs from '/imports/api/mixins/file-saver-fn.js'
                            this.saveAs(workbookBuffer, 'Villages');
                        }
                    })
                }
            },
            handleRun() {
                if (!!this.rolesArea) {
                    Meteor.call('village_getVillageWithADMIN_ID2', this.rolesArea, (err, result) => {
                        if (!err) {
                            this.villages = result;
                        }
                    });
                }
            }
        },
        components: {
            a4: PageA4
        },
    }
</script>
