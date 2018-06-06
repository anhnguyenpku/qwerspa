import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
Meteor.isClient && require('../../imports/ui/user/userSetting.html');
export const UserSettingTabular = new Tabular.Table({
    name: "wb.userSettingTabular",
    collection: Meteor.users,
    responsive: true,
    columnDefs: [
        {"width": "10px", "targets": 4}
    ],
    columns: [
        {data: "username", title: "Username"},
        {
            data: "emails",
            title: "Email",
            render: function (val) {
                return val && val[0].address;
            }
        },
        {
            data: "profile.approved",
            title: "Approved",
            render: function (val) {
                if (val) {
                    return `<span class="chip teal white-text">${val}</span>`
                }
                return `<span class="chip light-green accent-3 white-text">${val}</span>`
            }
        },
        // {data: "copies", title: "Copies Available"},
        // {
        //     data: "lastCheckedOut",
        //     title: "Last Checkout",
        //     render: function (val, type, doc) {
        //         if (val instanceof Date) {
        //             return moment(val).calendar();
        //         } else {
        //             return "Never";
        //         }
        //     }
        // },
        {data: "summary", title: "Summary"},
        {
            tmpl: Meteor.isClient && Template.wb_actionFromSemantic
        }
    ],
    extraFields: ["email", "profile", "password", "confirmPassword", "roles", "rolesBranch", "rolesArea", "areaId", "_id"]

});