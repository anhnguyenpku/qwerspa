export default class Aggr {
    static lookup(from, local, foreign, as) {
        if(!!from && !!local && !!foreign && !!as){
            return {
                from: from,
                localField: local,
                foreignField: foreign,
                as: as
            }
        }else{
          throw new Meteor.Error('Lookup pipeline must have 4 args, from, localField,foreignField, as')
        }
    }

    static unwind(path) {
        if(typeof path != 'string'){
            throw new Meteor.Error('unwind pipeline' + path + ' must be a string');
        }
        return {
            path: path,
            preserveNullAndEmptyArrays: true
        }
    }

    static match({selector}) {
        return {
            selector
        }
    }

    //['item = {$filter: {input: '$items', as: 'item', cond: {}}', 'customerId']
    static project(arr) {
        let obj = {}
        arr.forEach(function (el) {
            if(typeof el != "string"){
                throw new Meteor.Error('Field Must Be A String')
            }else{
                let splitStr = el.split('=');
                obj[splitStr[0].trim()] = 1;
                if(splitStr.length > 1) {
                    obj[splitStr[0].trim()] = splitStr[1]
                }
            }
        });
        return obj;
    }
}