/*
module.exports = {
    student(storage, prefix, studentId) {
        return storage.ref(prefix + `/images/students/${studentId}`)
    },

};*/


module.exports = {
    fileImage(storage, prefix, id, category) {
        //console.log(storage);
        return storage.ref(prefix + `/${category}/${id}`)
    },

};
