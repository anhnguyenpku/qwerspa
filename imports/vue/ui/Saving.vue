<template>
    <div class="saving">
        <!--<el-row type="flex" justify="left" class="customer-breadcrumb">
            <el-col :span="12">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <a href="/">Home</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <a href="/wb-data/customer-list">Customer List</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>Add Saving
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>-->
        <div class="card" v-loading="isSavingData" element-loading-text="Loading...">
            <div class="card-content">
                <el-form style="padding: 10px; background: #F4F5F8" labelPosition="top" :inline="true"
                         class="demo-form-inline">
                    <el-row type="flex">
                        <el-form-item label="Customer">
                            <el-input v-model="customer.khName" disabled>
                            </el-input>

                        </el-form-item>
                        <el-form-item label="Date">
                            <el-date-picker v-model="date" type="date" placeholder="Pick a day">
                            </el-date-picker>
                        </el-form-item>
                        <el-col :span="6">
                            <el-form-item label="Amount">
                                <el-input @keyup.native.enter="handleInsertTmpData" v-model.number="amount">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7"></el-col>
                        <el-col :span="3">
                            <h4 align="center">
                                <span style="color: #93939E; font-size: 13px">AMOUNT DEPOSIT</span>
                                <br>
                                <span style="font-weight:600;font-size: 23px">KHR {{depositAmount}}</span>
                            </h4>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="Description">
                            <el-input type="textarea" v-model="description">
                            </el-input>
                        </el-form-item>
                    </el-row>
                    <el-row type="flex">
                        <el-button :disabled="isDisabled" @click.native="handleInsertTmpData" type="success"
                                   icon="plus">Add
                        </el-button>
                    </el-row>
                </el-form>
                <div style="margin-top: 20px">
                    <el-table ref="multipleTable" :data="savingData" border style="width: 100%">
                        <el-table-column type="index" width="80">
                        </el-table-column>
                        <el-table-column property="date" label="Date" width="200" :formatter="formatter">
                        </el-table-column>
                        <el-table-column label="Amount" width="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.amount"
                                          @keyup.native.enter="updateAmount(scope.row)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="description" label="Description" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column fixed="right" label="Action" width="120">
                            <template slot-scope="scope">
                                <el-button @click="handleRemove(scope.row)" icon="el-icon-delete" size="small"
                                           type="text">
                                    Remove
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>
                    <el-row type="flex">
                        <el-button :disabled="!savable" @click.native="saveCurrentWork" type="primary">
                            <i class="fa fa-save"></i> Save Work
                        </el-button>
                        <el-button @click.native="gotoSavingList" type="success">
                            <i class="fa fa-list-alt"></i> GOTO SAVING
                        </el-button>
                    </el-row>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    const savingTmp = new Mongo.Collection(null);
    import {unfinishedSaving} from '../../collection/unfinshed-work'
    import {RestoreCurrentWork} from '../../api/mixins/restoreCurrentWork';
    import numeral from 'numeral';

    export default {
        mixins: [RestoreCurrentWork],
        meteor: {
            savingData() {
                return savingTmp.find({}).fetch()
            },
            depositAmount() {
                let saving = savingTmp.find({}).fetch();
                let depositAmount = 0;
                saving.forEach(function (doc) {
                    depositAmount += doc.amount;
                });
                return numeral(depositAmount).format('0,0.00');
            }
        },
        watch: {
            amount(val) {
                if (val <= 0) {
                    this.isDisabled = true;
                } else {
                    this.isDisabled = false;
                }
            },
            savingData(val) {
                if (val.length > 0) {
                    this.savable = true;
                } else {
                    this.savable = false;
                }
            }
        },
        data() {
            return {
                customer: {
                    name: ''
                },
                savable: false,
                isDisabled: true,
                isSavingData: false,
                savingData: [],
                amount: '',
                depositAmount: 0,
                description: '',
                date: moment().toDate()
            }
        },
        methods: {
            removeUnfinishedSaving(selector) {
                Meteor.call("removeUnfinishedSaving", selector);
            },
            numFormatter(row) {
                return numeral(row.amount).format('0,0.00');
            },
            formatter(row) {
                return moment(row.date).format('DD/MM/YYYY');
            },
            updateAmount(row) {
                savingTmp.update({_id: row._id}, {$set: {amount: row.amount}});
                unfinishedSaving.update({_id: row._id}, {$set: {amount: row.amount}});//add to unfinished work
                this.$message({
                    showClose: true,
                    message: 'update បានជោគជ័យ',
                    type: 'success',
                    duration: '1500'
                });
            },
            handleRemove(row) {
                if (row) {
                    let _id = row._id;
                    savingTmp.remove({_id}, (err) => {
                        if (!err) {
                            this.removeUnfinishedSaving({_id});
                        }
                    });
                } else {
                    savingTmp.find({}).fetch().forEach((doc) => {
                        this.handleRemove(doc);
                    });
                }

            },
            saveCurrentWork() {
                this.isSavingData = true;
                Meteor.call('insertSaving', {data: this.savingData}, (err, result) => {
                    if (!result) {
                        this.$message({
                            showClose: true,
                            message: 'បញ្ចូល Saving បានជោគជ័យ',
                            type: 'success',
                            duration: '1500'
                        });
                        this.handleRemove();
                    } else {
                        this.$message({
                            showClose: true,
                            message: err.message,
                            type: 'error',
                            duration: '3000'
                        })
                    }
                    this.isSavingData = false;
                });
            },
            handleInsertTmpData() {
//            if (this.amount > 0) {
                let date = this.date == '' ? moment().toDate() : this.date;
                let doc = {
                    customerId: this.customer._id,
                    amount: !!this.amount ? (isNaN(this.amount) ? 0 : this.amount) : 0,
                    createdBy: Meteor.userId(),
                    type: 'deposit',
                    date,
                    rolesArea: Session.get('area'),
                    description: this.description
                }
                let id = savingTmp.insert(doc);
                doc._id = id;
                unfinishedSaving.insert(doc);//add to unfinished work

//            } else {
//                this.$message({
//                    showClose: true,
//                    message: 'ចំនួនត្រូវធំជាងសូន្យ',
//                    type: 'warning',
//                    duration: '3000'
//                })
//            }
                this.amount = '';

            },
            giveMeCustomerAsObj(customerId) {
                Meteor.call('getCustomerById', {_id: customerId}, (err, result) => {
                    if (!err) {
                        this.customer = result;
                    }

                });
            },
            gotoSavingList() {
                FlowRouter.go('/wb-setting/customer/' + this.customer._id + '/detail?activeName=savingAccount');
            }
        },
        created() {
            let customerId = FlowRouter.getParam('customerId');
            let editableSaving = FlowRouter.query.get('e');
            this.giveMeCustomerAsObj(customerId);
            savingTmp.remove({});
            Meteor.call("giveMeUnfinishedSavingAsArrayObj", {
                createdBy: Meteor.userId(),
                customerId,
                rolesArea: Session.get('area')
            }, (err, currentWorks) => {
                if (currentWorks.length > 0) {
                    this.restoreCurrentWork(
                        {
                            title: 'Restore your current work?',
                            data: currentWorks,
                            fromCollection: unfinishedSaving,
                            insertIntoTmpCollection: savingTmp,
                            removeFromCollectionSelector: {
                                rolesArea: Session.get('area'), createdBy: Meteor.userId
                            },
                            removeMethodName: 'removeUnfinishedSaving'
                        }
                    )
                }
            });

        }
    }
</script>