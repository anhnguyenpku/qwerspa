import {Sch_Register} from '../../../imports/collection/schRegister';
import {Sch_ClassTable} from '../../../imports/collection/schClassTable';

import {SpaceChar} from "../../../both/config.js/space"
import {Sch_Class} from "../../../imports/collection/schClass";
import {Sch_Transcript} from "../../../imports/collection/schTranscript";
import {Sch_PaymentSchedule} from "../../../imports/collection/schPaymentSchedule";
import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
import {Sch_Promotion} from "../../../imports/collection/schPromotion";

Meteor.methods({
    schGeneratePaymentSchedule(classDoc, levelDoc, classTableDoc) {
        if (classTableDoc && classTableDoc.studentList && classTableDoc.studentList.length > 0) {
            classTableDoc.studentList.map((obj) => {
                if (obj.isGenerated === undefined || obj.isGenerated === false) {
                    Meteor.call("schGeneratePaymentScheduleAStudent", classDoc, levelDoc, obj);

                    obj.isGenerated = true;
                    return obj;
                }
            });
            Sch_ClassTable.update({_id: classTableDoc._id}, {$set: {studentList: classTableDoc.studentList}});
        }
    },
    schGeneratePaymentScheduleAStudent(classDoc, levelDoc, doc) {
        let order = 1;
        let discount = 0;

        let promotionDoc = Sch_Promotion.findOne({_id: doc.promotionId});
        let pricePerUnitNotDiscount = levelDoc.price * doc.term / levelDoc.term;

        if (promotionDoc.promotionType === "Percent") {
            discount = levelDoc.price * promotionDoc.value / 100;
        } else {
            discount = promotionDoc.value;
        }

        let pricePerUnit = (levelDoc.price - discount) * doc.term / levelDoc.term;
        let discountPerUnit = discount * doc.term / levelDoc.term;

        let scheduleDoc = {};
        scheduleDoc.studentId = doc.studentId;
        scheduleDoc.classId = classDoc._id;
        scheduleDoc.levelId = levelDoc._id;
        scheduleDoc.isPaid = false;
        scheduleDoc.paid = 0;
        scheduleDoc.waived = 0;


        for (let i = 1; i <= levelDoc.term; i = i + doc.term) {
            scheduleDoc.order = order;
            scheduleDoc.amount = formatCurrency(pricePerUnitNotDiscount);
            scheduleDoc.rawAmount = formatCurrency(pricePerUnit);
            scheduleDoc.discount = formatCurrency(discountPerUnit);
            scheduleDoc.netAmount = formatCurrency(pricePerUnit);
            scheduleDoc.balanceUnPaid = formatCurrency(pricePerUnit);
            scheduleDoc.rolesArea = classDoc.rolesArea;
            scheduleDoc.term = doc.term;
            scheduleDoc.promotionId = doc.promotionId;
            scheduleDoc.receivePaymentScheduleDate = doc.startClassDate;
            scheduleDoc.receivePaymentScheduleDateName = moment(doc.startClassDate).format("DD/MM/YYYY");
            let reDoc = Sch_PaymentSchedule.insert(scheduleDoc);
            doc.startClassDate = moment(doc.startClassDate).add(doc.term, "months").toDate();
            order++;
        }
    },
    querySchPaymentScheduleByStudentId(studentId, classId) {
        let studentDoc = Sch_ClassTable.aggregate([
            {$match: {classId: classId}},
            {
                $unwind: {
                    path: "$studentList",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {"studentList.studentId": studentId}
            },
            {
                $lookup:
                    {
                        from: "sch_promotion",
                        localField: "studentList.promotionId",
                        foreignField: "_id",
                        as: "promotionDoc"
                    }
            },
            {
                $unwind: {
                    path: "$promotionDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        let d = Sch_PaymentSchedule.find({
            studentId: studentId,
            classId: classId,
            status: {$in: ["Active", "Partial"]}
        }, {sort: {order: 1}}).fetch();

        d.map((obj) => {
            obj.isShow = true;
            obj.isApplyTerm = false;
            obj.promotionDoc = studentDoc && studentDoc[0].promotionDoc || "";

            obj.amount = formatCurrency(obj.amount - obj.paid - (obj.waived || 0) - (obj.balanceNotCut || 0));
            obj.netAmount = formatCurrency(obj.netAmount - obj.paid - (obj.waived || 0) - (obj.balanceNotCut || 0));
            obj.paid = 0;
            obj.isPaid = false;
            obj.desc = "";
            obj.waived = 0;
            obj.dayOverDue = moment().startOf("days").diff(moment(obj.receivePaymentScheduleDate).startOf("days").toDate(), "days") < 0 ? 0 : moment().startOf("days").diff(moment(obj.receivePaymentScheduleDate).startOf("days").toDate(), "days");

            return obj;
        });
        return d;
    },
    removePaymentScheduleByClassAndStudent(classId, studentId) {
        return Sch_PaymentSchedule.remove({classId: classId, studentId: studentId});
    }

});