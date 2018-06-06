/**
 * Created by snr on 3/2/17.
 */
import {WB_ReferenceType} from '../../imports/collection/referenceType';
import {LoginSetup} from '../../imports/collection/loginSetup';

Meteor.startup(function () {
    if (WB_ReferenceType.find().count() == 0) {

        WB_ReferenceType.insert({
            _id: "001",
            name: "Type",
            description: "Type"
        })

        WB_ReferenceType.insert({
            _id: "002",
            name: "Unit Of Measure",
            description: "Unit Of Measure"
        })

        WB_ReferenceType.insert({
            _id: "003",
            name: "Floor",
            description: "Floor"
        })
    }

    if (LoginSetup.find().count() == 0) {
        LoginSetup.insert({
            _id: "001",
            name: "អង្គភាពរដ្ឋាករទឹកបាត់ដំបង",
            parentName: "មន្ទីរឧស្សាហកម្មនិង សិប្បកម្មខេត្ត"
        })
    }
})