export const areaSchema = new SimpleSchema({
    rolesBranch: {
        type: String,
        autoform: {
            type: 'select2'
        }
    },
    rolesArea: {
        type: String,
        autoform: {
            type: 'select2'
        }
    },

});