export const CategoryImage = new FS.Collection('categoryImage', {
    stores: [new FS.Store.GridFS("categoryImage")]
});

CategoryImage.allow({
    insert: function (userId, doc) {
        return true;
    }, update: function (userId, doc, fields, modifier) {
        return true;
    },
    download: function () {
        return true;
    }
})

