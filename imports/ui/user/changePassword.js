import './changePassword.html';
import _ from 'lodash';

Template.wb_changePassword.onCreated(function () {
    Meteor.subscribe('wb_userId');
    this.loading = new ReactiveVar(false);
    this.isSubmitAble = new ReactiveVar(false);
    this.passwordMatch = new ReactiveVar();
    this.currentPasswordExist = new ReactiveVar(false);
    this.currentPassword = new ReactiveVar();
    this.newPassword = new ReactiveVar();
    this.confirmPassword = new ReactiveVar();
    this.fullName = new ReactiveVar();
    this.autorun(() => {
        let password = this.currentPassword.get();
        let newPassword = this.newPassword.get();
        let confirmPassword = this.confirmPassword.get();
        let currentPasswordExist = this.currentPasswordExist.get();
        let fullName = this.fullName.get();
        if (currentPasswordExist && !!newPassword && !!confirmPassword) {
            if (_.lowerCase(newPassword.trim()) === _.lowerCase(confirmPassword.trim())) {
                this.passwordMatch.set(true);
                this.isSubmitAble.set(true);
            } else {
                this.isSubmitAble.set(false);
                this.passwordMatch.set(false);
            }
        } else {
            if ((!currentPasswordExist || !password) && !password && !!fullName) {
                this.isSubmitAble.set(true);
            } else {
                this.isSubmitAble.set(false);
            }
        }
        if (!!password) {
            Meteor.call('checkUserCurrentPassword', Meteor.user(), password, (err, result) => {
                if (result) {
                    if (result.error) {
                        this.currentPasswordExist.set(false);
                    } else {
                        this.currentPasswordExist.set(true);
                    }
                }
            });
        }

    });
});


Template.wb_changePassword.events({
    'keyup [name="full-name"]'(event, instance) {
        instance.fullName.set($(event.currentTarget).val());
    },
    'keyup [name="current-password"]': _.debounce(function (event, instance) {
        instance.currentPassword.set($(event.currentTarget).val());
    }, 500),
    'keyup [name="new-password"]': _.debounce(function (event, instance) {
        instance.newPassword.set($(event.currentTarget).val());
    }, 500),
    'keyup [name="confirm-password"]': _.debounce(function (event, instance) {
        instance.confirmPassword.set($(event.currentTarget).val());
    }, 500),
    'click .handle-change'(event, instance) {
        if (instance.isSubmitAble.get()) {
            instance.loading.set(true);
            let oldPassword = instance.currentPassword.get();
            let newPassword = instance.newPassword.get();
            let fullName = instance.fullName.get();
            if (!!oldPassword && !!newPassword) {
                Accounts.changePassword(oldPassword, newPassword, (err) => {
                    let msg = 'ពាក្យសម្ងាត់ប្តូរបានជោគជ័យ';
                    if (!err) {
                        if (!!fullName) {
                            Meteor.call('updateFullName', fullName, (err, result) => {
                                if (!err) {
                                    msg = 'ពាក្យសម្ងាត់និងឈ្មោះប្តូរបានជោគជ័យ';
                                }
                            });
                        }
                        alertify.success(msg);
                        FlowRouter.go('/');
                    }
                });
            } else {
                if (!!fullName) {
                    Meteor.call('updateFullName', fullName, (err, result) => {
                        if (!err) {
                            let msg = 'ឈ្មោះប្តូរបានជោគជ័យ';
                            alertify.success(msg);
                            FlowRouter.go('/');
                        }
                    });
                }
            }
            // instance.loading.set(false);
        }
    }
});

Template.wb_changePassword.helpers({
    loading(){
        let instance = Template.instance();
        return instance.loading.get();
    },
    isDisabled() {
        let instance = Template.instance();
        return !instance.isSubmitAble.get();
    },
    fullName() {
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        return user.fullName || '';
    },
    currentPasswordExist() {
        let instance = Template.instance();
        let currentPassword = instance.currentPassword.get();
        let currentPasswordExist = instance.currentPasswordExist.get();
        if (!!currentPassword) {
            if (!currentPasswordExist) {
                return {
                    enable: true,
                    isExist: false
                };
            } else {
                return {
                    enable: true,
                    isExist: true
                };
            }
        }
        return {
            enable: false,
            isExist: false
        };
    },
    passwordAndConfirmPasswordMatch() {
        let instance = Template.instance();
        let passwordMatch = instance.passwordMatch.get();
        return passwordMatch;
    },
    newPasswordAndConfirmEnter() {
        let instance = Template.instance();
        let newPassword = instance.newPassword.get();
        let confirmPassword = instance.confirmPassword.get();
        if (!!newPassword && !!confirmPassword) {
            return true;
        }
        return false;
    }
});