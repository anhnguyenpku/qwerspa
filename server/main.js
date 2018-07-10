import { Meteor } from 'meteor/meteor';
Meteor.methods({
    sumTwoNumbers({a,b} = {a: 0, b: 0}){
        return a+b;
    },
    listCustomers(){
        return [{name: "kevin"},{name: "Narong"}]
    }
});
Meteor.startup(() => {
  // code to run on server at startup
});
