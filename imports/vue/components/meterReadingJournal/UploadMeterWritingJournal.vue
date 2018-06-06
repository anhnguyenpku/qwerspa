<template>
    <div class="uploadMeterWritingJournal">
        <div class="container-fluid">
            <div class="card" style="padding: 20px;">
                <h4>Upload Meter Journal Detail</h4>
                <el-upload
                        class="upload-demo"
                        ref="upload"
                        drag
                        action="#"
                        :file-list="fileList"
                        :on-change="onUploadChange"
                        :auto-upload="false"
                        :on-success="onSuccess"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                    <div class="el-upload__tip" slot="tip">Accept xlsx/xls/csv only 1 file</div>
                </el-upload>
                <el-button @click.native="uploadJournalDetail" :disabled="!fileListIsNotEmpty" :loading="loading">Upload Journal Detail
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import XLSX from 'xlsx';
    import FileSaver from 'file-saver';

    export default {
        data() {
            return {
                loading: false,
                fileList: [],
            };
        },
        computed: {
            fileListIsNotEmpty() {
                return this.fileList.length > 0
            }
        },
        methods: {
            uploadJournalDetail() {
                this.loading = true;
                let readingDate=FlowRouter.getQueryParam("date");
                let reader = new FileReader();
                let vm = this;
                const jbId = FlowRouter.getParam('mrId');
                this.fileList.map(file => {
                        this.blobToDataString(file.url, (data) => {
                            Meteor.call('uploadNewReading', data, name,readingDate,jbId, function (err, wb) {
                                if (err) {
                                    vm.loading = false;
                                    vm.$message.error(err.message);
                                }
                                else {
                                    vm.$message.success("uploading journal detail finished!");
                                    vm.loading = false;
                                    vm.fileList = [];
                                }
                            });
                        })
                    }
                )
            },
            onUploadChange(file, fileList) {

                const matchExtension = file.name.match(/xlsx|xls|csv/g);
                if (!matchExtension) {
                    this.$message.error("Must be a xlsx, xls or csv file");
                    this.fileList = [];
                } else {
                    if (fileList.length > 0) {
                        this.fileList = fileList.slice(-1);
                    } else {
                        this.fileList = fileList;

                    }
                }
            }
            ,
            onSuccess() {
                this.$message.success("upload success")
            }
            ,
            blobToDataString(blob, callback) {
                let xhr = new XMLHttpRequest();
                xhr.responseType = "blob";

                xhr.onload = function () {
                    let recoveredBlob = xhr.response;

                    let reader = new FileReader();

                    reader.onload = function () {
                        let blobAsDataString = reader.result;
                        callback(blobAsDataString);
                    };

                    reader.readAsBinaryString(recoveredBlob);
                };

                xhr.open("GET", blob);
                xhr.send();
            }



        }
    }
</script>