<template>
    <div class="edit-activity">
        <div class="container">
            <div class="card">
                <div class="card-content">
                    <div class="card-title"><i class="material-icons">build</i> Edit Activity <span class="right"><a
                            href="/waterBilling/activity"><i class="material-icons">arrow_back</i></a></span></div>
                    <div v-if="waiting">
                        <div class="progress">
                            <div class="indeterminate"></div>
                        </div>
                    </div>
                    <form @submit.prevent>
                        <div class="input-field col s6">
                            <input class="validate: errors.has('code')" name="code" type="text"
                                   v-validate="{rules: {required: true}}"
                                   v-model="activity.code"
                                   @keyup.enter="editActivity">
                            <label for="">Code</label>
                            <span v-show="errors.has('code')" class="red-text">
                    {{errors.first('code')}}
                </span>
                        </div>
                        <div class= "input-field col s6">
                            <input class="validate: errors.has('name')" name="name"  type="text" v-validate="{rules: {required: true}}" v-model="activity.name" @keyup.enter="editActivity">
                            <label for="" >Name</label>
                            <span v-show="errors.has('name')" class="red-text">
                {{errors.first('name')}}
                </span>
                        </div>
                    </form>
                    <button  @click="editActivity" class="btn waves waves-effect-light"><i class="material-icons left"></i>Update</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Session} from 'meteor/session';
    import {FlowRouter} from 'meteor/kadira:flow-router';
    import {Wb_activity} from '/imports/collection/activity';
    export default {
        data(){
            return {
                activity:  {},
                waiting: true,
                rolesArea: ''
            };
        },
        methods:{
            editActivity(){
                this.$validator.validateAll().then(success => {
                    if (!success) {
                        return;
                    }
                });
                this.activity.rolesArea = this.rolesArea;
                Meteor.call('updateActivity',{activity: this.activity}, (err,result) => {
                    if(result){
                        Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
                        FlowRouter.go('wb.activity');
                    }else{
                        console.log(err);
                        Materialize.toast(err.message, 3000, 'red rounded');
                    }
                });

            }
        },
        mounted(){
            Meteor.call('fetchActivity', {_id: FlowRouter.getParam('id')}, (err, result) => {
                if(result) {
                    this.activity = result;
                    this.waiting =false;
                }
            });
        }
    }
</script>

<style scope>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
        opacity: 0
    }
</style>