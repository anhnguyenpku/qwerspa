<template>
    <div>
        <div class="card">
            <div class="card-header card-header-icon" data-background-color="orange">
                <i class="material-icons">access_alarm</i>
            </div>
            <div class="card-content">
                <h4 class="card-title" style="font-family: 'Khmer OS Battambang'">ប្តូរនាឡិកា  <a><i class="fa fa-user-circle-o"></i> {{customerObj.khName}}</a></h4>
                <div class="col-md-12" style="padding:20px;">
                    <transition name="el-zoom-in-top">
                        <div style="padding: 5px;" class="transition-box">
                            <el-row justify="center">
                                <el-col :span="24">
                                    <h5 class="f15">
                                        <br><b>Remain WC: </b> {{ruleForm.remainWaterConsumption}}
                                    </h5>
                                </el-col>
                            </el-row>
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px"
                                     class="demo-ruleForm">
                                <hr>
                                <el-form-item label="Pre-Reading">
                                    <el-input v-model="ruleForm.prevReading" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="New Reading of old Meter" prop="newReadingOfOldMeter">
                                    <el-input v-model="ruleForm.newReadingOfOldMeter"></el-input>
                                </el-form-item>
                                <el-form-item label="Water consumption">
                                    <el-input disabled v-model="ruleForm.remainWaterConsumption"></el-input>
                                </el-form-item>
                                <el-form-item label="Date" prop="date">
                                    <el-date-picker type="date" placeholder="Pick a date"
                                                    v-model="ruleForm.date"></el-date-picker>
                                </el-form-item>

                                <el-form-item label="New Reading" prop="newReading">
                                    <el-input v-model="ruleForm.newReading"></el-input>
                                </el-form-item>
                                <el-form-item label="Meter Size" prop="meterType">
                                    <el-select v-model="ruleForm.meterTypeId" filterable
                                               placeholder="choose meter type">
                                        <el-option v-for="item in meterType" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Type" prop="type">
                                    <el-select v-model="ruleForm.type" filterable placeholder="choose meter type">
                                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="Meter Serial" prop="meterSerial">
                                    <el-input v-model="ruleForm.meterSerial"></el-input>
                                </el-form-item>
                                <el-form-item label="Description" prop="desc">
                                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
                                    <el-button @click="resetForm('ruleForm')">Reset</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        data() {
            return {
                customerObj: {},
                customer: {},
                meterType: [],
                typeOptions: [
                    {label: 'ប្តូរនាឡិកា (Meter Change)', value: 'Meter Change'},
                    {label: 'នាឡិកាវិលជុំ (Meter Reset)', value: 'Meter Reset'},
                    {label: 'កែលេខអានចាស់ (Edit)', value: 'Edit'},
                ],
                ruleForm: {
                    newReadingOfOldMeter: 0,
                    remainWaterConsumption: 0,
                    prevReading: 0,
                    date: null,
                    newReading: 0,
                    meterTypeId: '',
                    meterSerial: '',
                    desc: '',
                    customerId: '',
                    type: ''
                },
                rolesArea: '',
                rules: {
                    newReadingOfOldMeter: [{
                        required: true, message: 'Remain Water Consumption is required.', trigger: 'blur'
                    }],
                    name: [
                        {required: true, message: 'Please input Activity name', trigger: 'blur'},
                        {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'}
                    ],
                    date: [
                        {type: 'date', message: 'Date is required', required: true, trigger: 'change'}
                    ],
                    meterTypeId: [
                        {required: true, message: 'Meter Type is required', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: 'Type is required', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            fetchCustomer() {
                let customerId = FlowRouter.query.get('q');
                Meteor.call("getCustomerById", {_id: customerId}, (err, result) => {
                    if (!err) {
                        this.customer = result;
                    }
                });
            },
            closeMeterChangeForm() {
                this.$emit('closeMeterChangeForm', false);
            },
            customerMeterType(customer) {
                console.log(customer)
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Meteor.call('insertMeterChange', {
                            oldMeterChange: this.customerObj,
                            meterChange: this.ruleForm,
                            modifiedDate: moment().toDate(),
                            rolesArea: Session.get('area')
                        }, (err, result) => {
                            if (!err) {
                                this.$message({
                                    message: 'Change successfully!',
                                    type: 'success'
                                });
                                this.resetForm(formName);
                                FlowRouter.go('wb.meterChange');
                            } else {
                                this.$message({
                                    message: err.message,
                                    type: 'error'
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        watch: {
            customer(val) {
                val.customerId = val._id;
                this.customerObj = val;
                this.ruleForm.meterTypeId = val.contract && val.contract.meterTypeId;
                this.ruleForm.prevReading = val.prevReading === 0 ? val.contract && val.contract.prevReading || 0 : val.prevReading;
                this.ruleForm.customerId = val._id;
            },
            'ruleForm.newReadingOfOldMeter'(val) {
                if (val < this.ruleForm.prevReading) {
//                        this.$message.warning('New of old reading must > Pre-Reading');
                } else {
                    this.ruleForm.remainWaterConsumption = val - this.ruleForm.prevReading;
                }
            }
        },
        created() {
            this.fetchCustomer();
            Meteor.call('findMeterType', (err, result) => {
                if (!err) {
                    let list = [];
                    result.forEach(function (doc) {
                        list.push({label: doc.diameter + ' ' + doc.unit, value: doc._id});
                    });
                    this.meterType = list;
                }
            });
        }
    }
</script>

<style lang="less">
    .f15 {
        font-size: 15px;
    }
</style>