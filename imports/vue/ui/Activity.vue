<template>
    <div class="activity">
        <div class="container">
            <div class="card">
                <div class="card-content">
                    <div class="cursor-pointer waves waves-effect card-title">
                        <i class="material-icons">add</i> Activity

                    </div>
                    <span class="right"><a
                            href="/"><i class="material-icons">home</i></a></span>
                    <new-activity></new-activity>
                    <div v-if="!$subReady.wb_activity">Loading....</div>
                    <div class="v-else">
                        <blockquote>Note:  Click to Edit item.</blockquote>
                        <table class="table">
                            <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr class="cursor-pointer" v-for="act in activityData">
                                <td>{{act.code}}</td>
                                <td>{{act.name}}</td>
                                <td><a @click="editActivity(act)"><i class="material-icons">mode_edit</i></a></td>
                                <td><a @click="removeActivity(act)"><i class="material-icons">delete</i></a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import NewActivity from '/imports/vue/components/activity/NewActivity.vue'
    import {Wb_activity} from '/imports/collection/activity.js';
    import {Session} from 'meteor/session';
    import {FlowRouter} from 'meteor/kadira:flow-router';
    export default {
        meteor: {
            data: {
                rolesArea(){
                    return Session.get('area')
                },
                activityData(){
                    return Wb_activity.find({}).fetch();
                }
            },
            subscribe: {
                'wb_activity': function () {
                    return [{rolesArea: Session.get('area')}]
                }
            }
        },
        components: {
            NewActivity
        },
        data(){
            return {
                activity: {},
                rolesArea: '',
                activityData: [],
            }
        },
        methods: {
            editActivity(value){
                FlowRouter.go('wb.activityEdit', {id: value._id});
            },
            removeActivity(value){
                Meteor.call('removeActivity', {_id: value._id}, function (err, result) {
                    if (!err) {
                        Materialize.toast(`Remove ${value.code} success`, 3000, 'lime accent-4 rounded');

                    }
                })
            }
        }
    };

</script>
<style scope>

</style>