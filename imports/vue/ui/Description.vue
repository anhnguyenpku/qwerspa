<template>
    <div class="description">
        <div class="card">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons">chat</i>
            </div>
            <div class="card-content">
                <h4 class="card-title" style="cursor: pointer !important;font-family: 'Khmer OS Battambang'"><a
                        class="add" @click="dailog = true"><i class="fa fa-plus"></i> Description </a></h4>
                <div class="col-md-12" style="padding:20px;">
                    <div class="animated fadeIn">
                        <el-table
                                :data="gridData"
                                style="width: 100%">
                            <el-table-column
                                    prop="kh"
                                    label="Kh"
                                    fit>
                            </el-table-column>
                            <el-table-column
                                    prop="en"
                                    label="En"
                                    fit>
                            </el-table-column>
                            <el-table-column prop="isPinned" label="Pinned Desc" fit>
                                <template slot-scope="scope">
                                    <p v-if="scope.row.isPinned">
                                        បិទភ្ជាប់ទៅអតិថន
                                    </p>
                                </template>

                            </el-table-column>
                            <el-table-column prop="type" label="Type" fit>
                                <template slot-scope="scope">
                                    <p v-if="scope.row.type">
                                        {{scope.row.type}}
                                    </p>
                                </template>

                            </el-table-column>
                            <el-table-column
                                    prop="value"
                                    label="Value"
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="icon"
                                    label="Icon"
                                    width="200">
                            </el-table-column>
                            <el-table-column
                                    fixed="right"
                                    label="Actions"
                                    width="150">
                                <template slot-scope="scope">
                                    <el-button @click.navtive="handleRemove(scope.$index, scope.row)" type="text"
                                               size="small">
                                        Remove
                                    </el-button>
                                    <el-button type="text" size="small" @click.navtive="handleEdit(scope.row)">Edit
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <el-dialog :title="title" :visible.sync="dailog">
                    <el-form :model="form" ref="descriptionForm" :rules="rules">
                        <el-row :gutter="5">
                            <el-col :span="12">
                                <el-form-item label="kh" prop="kh">
                                    <el-input type="textarea" v-model="form.kh"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="en" prop="en">
                                    <el-input type="textarea" v-model="form.en"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5">
                            <el-col :span="12">
                                <el-form-item label="Icon" prop="icon">
                                    <el-input v-model="form.icon"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="Value">
                                    <el-input v-model="form.value"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-select v-model="form.type" placeholder="Select Type">
                                <el-option
                                        v-for="item in types"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-row>
                        <br>
                        <el-checkbox v-model="form.isPinned">ភ្ជាប់ទៅអតិថិជន</el-checkbox>

                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">Cancel</el-button>
                        <el-button type="primary" @click.native="submitForm">Confirm</el-button>
                     </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        created() {
            this.fetchDescription();
        },
        data() {
            return {
                docId: '',
                form: {
                    type: '',
                    en: '',
                    kh: '',
                    icon: 'ios-text-outline',
                    value: '',
                    isPinned: false
                },
                rules: {
                    kh: [
                        {required: true, trigger: 'blur'}
                    ],
                    en: [
                        {required: true, trigger: 'blur'}
                    ],
                    icon: [
                        {required: true, trigger: 'blur'}
                    ],
                    value: [
                        {required: true, trigger: 'blur'}
                    ]
                },
                types: [
                    {label: 'Meter Reading', value: 'meterReading'},
                    {label: 'Overdue', value: 'overdue'},
                ],
                gridData: [],
                title: 'Add Description',
                dailog: false
            }
        },
        methods: {
            submitForm() {
                this.$refs['descriptionForm'].validate((valid) => {
                    if (valid) {
                        Meteor.call('description_insert', this.form, this.docId, (err, result) => {
                            if (!err) {
                                this.resetForm();
                                this.$message.success('ប្រតិបត្តិការជោគជ័យ');
                                this.fetchDescription();
                            } else {
                                this.$message.error(err.message);
                            }
                        });
                    }
                });
            },
            resetForm() {
                this.docId = '';
                this.form = {};
                this.form.type = '';
                this.form.isPinned = false;
                this.form.icon = 'ios-text-outline'
            },
            fetchDescription() {
                Meteor.call('description_fetchDescription', (err, result) => {
                    if (!err) {
                        this.gridData = result;
                    }
                });
            },
            handleEdit(row) {
                this.docId = row._id;
                this.form = row;
                this.dailog = true;
            },
            handleRemove(index, row) {
                this.$confirm(`This will permanently delete ${row.kh}. Continue?`, 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call('description_removeDescription', row._id, (err, result) => {
                        if (!err) {
                            this.gridData.splice(index, 1);
                        }
                    });
                    this.$message({
                        type: 'success',
                        message: 'Delete completed'
                    });
                }).catch(() => {

                });
            }

        }
    }
</script>