import {Meteor} from "meteor/meteor";
import {FilesCollection} from "meteor/ostrio:files";


export const Images = new FilesCollection({
    collectionName: "Images",
    allowClientCode: false,
    onBeforeUpload(file) {
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        }
        return "Please Upload image ,with size equal or less than 10 MB";
    }
})


/*export const CategoryImage = new FS.Collection('categoryImage', {
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


export const Files=new Mongo.Collection("files");*/

