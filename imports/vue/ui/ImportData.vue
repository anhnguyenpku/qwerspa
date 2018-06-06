<template>
    <div class="import-data">
        <el-row >
            <el-col :span="24">
                <div class="card" style="padding: 10px;">
                    <h4>Upload Customer</h4>
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
                    <el-button type="primary" @click.native="customerUpload" :disabled="!fileListIsNotEmpty" :loading="loading">
                        Upload Customer
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import XLSX from 'xlsx';
    import FileSaver from 'file-saver';

    export default {
        data() {
            return {
                fileList: [],
                loading: false
            };
        },
        computed: {
            fileListIsNotEmpty() {
                return this.fileList.length > 0
            }
        },
        methods: {
            customerUpload() {
                this.loading = true;
                this.fileList.map(file => {
                        this.blobToDataString(file.url, (data) => {
                            Meteor.call('upload', data, file.name, (err, result) => {
                                if (err) {
                                    this.loading = false;
                                    console.error(err);
                                }
                                else {
                                    this.loading = false;
                                    this.fileList = [];

                                }
                                /* do something here -- this just dumps an array of arrays to console */
                                // console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 }));

                            });                                    this.$message.success("Uploading customer finished!");

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

<style scoped>

</style>