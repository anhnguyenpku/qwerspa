export const Sch_Student = new Mongo.Collection('sch_student');

Sch_Student.schema = new SimpleSchema({
    personal: {
        type: Object
    },
    "personal.name": {
        type: String
    },
    "personal.latinName": {
        type: String
    },
    "personal.code": {
        type: String
    },
    "personal.gender": {
        type: String
    }, "personal.nationality": {
        type: String,
        optional: true
    }, "personal.nation": {
        type: String,
        optional: true
    }, "personal.status": {
        type: String,
        optional: true
    }, "personal.dob": {
        type: Date,
        optional: true
    }, "personal.dobName": {
        type: String,
        optional: true
    }, "personal.village": {
        type: String,
        optional: true
    }, "personal.commune": {
        type: String,
        optional: true
    }, "personal.district": {
        type: String,
        optional: true
    }, "personal.province": {
        type: String,
        optional: true
    }, "personal.occupation": {
        type: String,
        optional: true
    }, "personal.occupationPlace": {
        type: String,
        optional: true
    },
    "personal.homeNoCurrent": {
        type: String,
        optional: true
    }, "personal.groupCurrent": {
        type: String,
        optional: true
    }, "personal.villageCurrent": {
        type: String,
        optional: true
    }, "personal.communeCurrent": {
        type: String,
        optional: true
    }, "personal.districtCurrent": {
        type: String,
        optional: true
    }, "personal.provinceCurrent": {
        type: String,
        optional: true
    }, "personal.degree": {
        type: String,
        optional: true
    }, "personal.degreeYear": {
        type: String,
        optional: true
    }, "personal.phoneNumber": {
        type: String,
        optional: true
    },

    family: {
        type: Object
    },
    "family.parent": {
        type: Object
    }, "family.parent.faName": {
        type: String,
        optional: true
    }, "family.parent.faYob": {
        type: String,
        optional: true
    }, "family.parent.faNationality": {
        type: String,
        optional: true
    }, "family.parent.faNation": {
        type: String,
        optional: true
    }, "family.parent.faIsDie": {
        type: Boolean,
        optional: true
    }, "family.parent.faOccupation": {
        type: String,
        optional: true
    }, "family.parent.moName": {
        type: String,
        optional: true
    }, "family.parent.moYob": {
        type: String,
        optional: true
    }, "family.parent.moNationality": {
        type: String,
        optional: true
    }, "family.parent.moNation": {
        type: String,
        optional: true
    }, "family.parent.moIsDie": {
        type: Boolean,
        optional: true
    }, "family.parent.moOccupation": {
        type: String,
        optional: true
    }, "family.parent.address": {
        type: String,
        optional: true
    },
    "family.cousin": {
        type: [Object]
    }, "family.cousin.$.name": {
        type: String,
        optional: true
    }, "family.cousin.$.gender": {
        type: String,
        optional: true
    }, "family.cousin.$.age": {
        type: Number,
        optional: true
    }, "family.cousin.$.occupation": {
        type: String,
        optional: true
    },

    personalStudy: {
        type: [Object],
        optional: true
    },
    "personalStudy.$.studyAt": {
        type: String,
        optional: true
    },
    "personalStudy.$.duration": {
        type: String,
        optional: true
    },
    "personalStudy.$.grade": {
        type: String,
        optional: true
    },
    "personalStudy.$.where": {
        type: String,
        optional: true
    },
    "personalStudy.$.graduatedYear": {
        type: String,
        optional: true
    },


    personalContract: {
        type: String,
        optional: true
    },
    note: {
        type: String,
        optional: true
    },
    fromSchool: {
        type: String,
        optional: true
    },
    provinceSchool: {
        type: String,
        optional: true
    },
    imgUrl: {
        type: String,
        optional: true
    },
    rolesArea: {
        type: String,
        label: "Role Area"
    },
    createdAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return moment().toDate();
            }
        }
    },
    updatedAt: {
        type: Date,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return moment().toDate();
            }
        }
    },
    createdUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
        }
    },
    updatedUser: {
        type: String,
        optional: true,

        autoValue() {
            if (this.isUpdate) {
                return Meteor.userId();
            }
        }
    }
});


Sch_Student.attachSchema(Sch_Student.schema);