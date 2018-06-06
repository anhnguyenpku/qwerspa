export const WB_Tariff = new Mongo.Collection('wb_tariff');
WB_Tariff.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    code: {
        type: String,
        label: "Code"
    },
    startDate: {
        type: Date,
        label: "Start Date",
        autoform: {
            type: "bootstrap-datepicker"
        }
    },
    typeId: {
        type: String,
        label: "Type",
        optional: true,
        autoform: {
            type: 'select2',
        }
    },
    measureId: {
        type: String,
        label: "Unit Of Measure",
        optional: true,
        autoform: {
            type: 'select2',
        }
    },
    floorBy: {
        type: String,
        label: "Floor By",
        optional: true,
        autoform: {
            type: 'select2',
        }
    },
    isFixedFloor: {
        type: Boolean,
        label: "Fixed Floor",
        optional: true
    },
    categoryId: {
        type: String,
        optional: true,
        autoform: {
            type: 'select2'
        }
    },
    contributionFeePrice: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 100
    },
    isFixedMaintenance: {
        type: Boolean,
        label: "Fixed Maintenance",
        optional: true
    },
    rangePrice: {
        type: [Object],
        optional: true,
        blackbox: true
    },
    'rangePrice.$.price': {
        type: Number,
        decimal: true,
        defaultValue: 0.1,
        min: 0.1,
        autoform: {
            type: 'inputmask',
            afFieldInput: {
                inputmaskOptions: inputmaskOptions.decimal()
            }
        }
    },
    'rangePrice.$.startRange': {
        type: Number,
        decimal: true,
        defaultValue: 0.0
    },
    'rangePrice.$.endRange': {
        type: Number,
        decimal: true,
        defaultValue: 0.0
    },
    maintenance: {
        type: Number,
        defaultValue: 0,
    },
    status: {
        type: String,
        autoValue(){
            if (this.isInsert) {
                return 'enable'
            }
        },
        autoform: {
            type: 'select2',
            options(){
                return [
                    {label: '(Please Choose)', value: ''},
                    {label: 'Enable', value: 'enable'},
                    {label: 'Disable', value: 'disable'}
                ]
            }
        }
    },
    rolesArea: {
        type: String,
        optional: true
    },
    penaltyAmount:{
        type:Number,
        decimal:true,
        label:"Penalty Amount"
    },
    feeAmount:{
        type:Number,
        decimal:true,
        label:"Fee Amount"
    },
    getMaintenanceEvenWaterConsumption: {
        type: Boolean,
        label: "Get maintenance if water consumption 0",
        optional: true
    },
});

WB_Tariff.priceRange = new SimpleSchema({
    level: {
        type: Number,
        label: "Level"
    },
    startRange: {
        type: Number,
        label: "Start Range",
        decimal: true,
        defaultValue: 0
    },
    endRange: {
        type: Number,
        label: "End Range",
        decimal: true,
        defaultValue: 0
    },
    price: {
        type: Number,
        label: "Price",
        decimal: true,
        defaultValue: 0,
        autoform: {
            type: 'inputmask',
            afFieldInput: {
                inputmaskOptions: inputmaskOptions.decimal()
            }
        }
    },
    startRangeOutput: {
        type: Number,
        label: "Start Range",
        decimal: true,
        defaultValue: 0
    },
    endRangeOutput: {
        type: Number,
        label: "End Range",
        decimal: true,
        defaultValue: 0
    },
    priceOutput: {
        type: Number,
        label: "Price",
        decimal: true,
        defaultValue: 0,
        autoform: {
            type: 'inputmask',
            afFieldInput: {
                inputmaskOptions: inputmaskOptions.decimal()
            }
        }
    }
})

WB_Tariff.attachSchema(WB_Tariff.schema);