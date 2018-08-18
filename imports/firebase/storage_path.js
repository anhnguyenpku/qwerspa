module.exports = {
    student(storage, prefix, studentId) {
        return storage.ref(prefix + `/images/students/${studentId}`)
    },

};