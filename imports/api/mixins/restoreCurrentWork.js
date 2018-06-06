export const RestoreCurrentWork = {
    methods: {
        restoreCurrentWork({title, type, data, fromCollection, insertIntoTmpCollection, reinsertToFromCollection, removeFromCollectionSelector, removeMethodName}){
            type = type || 'warning';
            reinsertToFromCollection = reinsertToFromCollection || true;
            this.$confirm(title, 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: type
            }).then(() => {
                let ids = [];
                data.forEach(function (doc) {
                    ids.push(doc._id); //remove current save doc
                    delete doc._id;
                    let id = insertIntoTmpCollection.insert(doc);
                    if (reinsertToFromCollection) { //reinsert into unfinish collection when flag is true
                        doc._id = id;
                        fromCollection.insert(doc);
                    }

                });
                Meteor.call(removeMethodName, {_id: {$in: ids}});
                this.$message({
                    type: 'success',
                    message: 'Restore completed!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Restore canceled'
                });
                Meteor.call(removeMethodName, removeFromCollectionSelector); // remove current saved work
            });
        }
    }
}