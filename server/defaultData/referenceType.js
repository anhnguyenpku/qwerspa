/**
 * Created by snr on 3/2/17.
 */
import {LoginSetup} from '../../imports/collection/loginSetup';

Meteor.startup(function () {
    if (LoginSetup.find().count() == 0) {
        LoginSetup.insert({
            _id: "001",
            name: "អង្គភាពរដ្ឋាករទឹកបាត់ដំបង",
            parentName: "មន្ទីរឧស្សាហកម្មនិង សិប្បកម្មខេត្ត"
        })
    }
});