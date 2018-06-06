<template>
    <div class="new-activity">
        <form @submit.prevent>
            <div class="input-field col s6">
                <input class="validate: errors.has('code')" name="code" type="text"
                       v-validate="{rules: {required: true}}"
                       v-model="activity.code"
                       @keyup.enter="addNewActivity">
                <label for="">Code</label>
                <span v-show="errors.has('code')" class="red-text">
                    {{errors.first('code')}}
                </span>
            </div>
            <div class="input-field col s6">
                <input class="validate: errors.has('name')" name="name" type="text"
                       v-validate="{rules: {required: true}}" v-model="activity.name" @keyup.enter="addNewActivity">
                <label for="">Name</label>
                <span v-show="errors.has('name')" class="red-text">
                {{errors.first('name')}}
                </span>
            </div>
        </form>
        <button @click="addNewActivity" class="btn waves waves-effect-light"><i class="material-icons left"></i>Save
        </button>
    </div>
</template>

<script>
    import {Session} from 'meteor/session';
    export default {
        data(){
            return {
                activity: {},
                rolesArea: ''
            };
        },
        meteor: {
            data: {
                rolesArea(){
                    return Session.get('area');
                }
            }
        },
        methods: {
            addNewActivity(){

                this.$validator.validateAll().then(success => {
                    if (!success) {
                        return;
                    } else {
                        this.activity.rolesArea = this.rolesArea;
                        Meteor.call('addNewActivity', {activity: this.activity}, (err, result) => {
                            if (result) {
                                Materialize.toast('Successful', 3000, 'lime accent-4 rounded');
                            } else {
                                Materialize.toast(err.message, 3000, 'red rounded');
                            }
                        });
                    }
                });
            }
        }
    }
</script>

<style scope>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
    {
        opacity: 0
    }
</style>