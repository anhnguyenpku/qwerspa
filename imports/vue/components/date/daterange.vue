<template>
    <el-date-picker
            v-model="dateRange"
            type="daterange"
            :disabled="disabled"
            align="right"
            placeholder="Pick a range"
            :picker-options="pickerOptions">
    </el-date-picker>
</template>

<script>
    export default {
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            defaultDateRange: {
                type: Array
            },
            defaultPickerOptions: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data(){
            return {
                dateRange: this.defaultDateRange,
                pickerOptions: this.defaultPickerOptions,

            }
        },
        watch: {
            defaultDateRange(val){
                this.dateRange = val;
            },
            defaultPickerOptions(val){
                this.pickerOptions = val;
            },
            dateRange:{
                handler(val){
                    this.changeDate(this.dateRange);
                }
            }
        },
        methods: {
            changeDate(val){
                this.$emit('dateRangeVal', val);
            }
        }
    }
</script>