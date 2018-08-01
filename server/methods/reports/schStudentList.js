import {Meteor} from 'meteor/meteor';
import {WB_waterBillingSetup} from '../../../imports/collection/waterBillingSetup';
import {Sch_ClassTable} from '../../../imports/collection/schClassTable';
import {Pos_ReceivePayment} from '../../../imports/collection/posReceivePayment';

import {SpaceChar} from "../../../both/config.js/space"

import numeral from 'numeral';
import {exchangeCoefficient} from "../../../imports/api/methods/roundCurrency"
import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency"
import {roundCurrency} from "../../../imports/api/methods/roundCurrency"
import {formatCurrency} from "../../../imports/api/methods/roundCurrency"

Meteor.methods({
    schStudentListReport(params, translate) {
        let parameter = {};

        if (params.area != "") {
            parameter.rolesArea = params.area;

        }
        if (params.programId != "") {
            parameter["studentList.programId"] = params.programId;
        }
        if (params.majorId != "") {
            parameter["studentList.majorId"] = params.majorId;
        }

        if (params.levelId != "") {
            parameter["studentList.levelId"] = params.levelId;
        }
        if (params.classId != "") {
            parameter["studentList.classId"] = params.classId;
        }
        let data = {};

        let companyDoc = WB_waterBillingSetup.findOne({});


        let studentListHTML = "";

        let studentListList = Sch_ClassTable.aggregate([
            {
                $unwind: {
                    path: "$studentList",
                    preserveNullAndEmptyArrays: true
                }
            },
            {$match: parameter},
            {
                $lookup: {
                    from: 'sch_level',
                    localField: 'studentList.levelId',
                    foreignField: '_id',
                    as: 'levelDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$levelDoc",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: 'sch_class',
                    localField: 'studentList.classId',
                    foreignField: '_id',
                    as: 'classDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$classDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_program',
                    localField: 'studentList.programId',
                    foreignField: '_id',
                    as: 'programDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$programDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_major',
                    localField: 'studentList.majorId',
                    foreignField: '_id',
                    as: 'majorDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$majorDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'sch_student',
                    localField: 'studentList.studentId',
                    foreignField: '_id',
                    as: 'studentDoc'
                }
            }
            ,
            {
                $unwind: {
                    path: "$studentDoc",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    "studentDoc.personal.name": 1
                }
            },
            {
                $group: {
                    _id: {
                        classDoc: "$classDoc",
                        levelDoc: "$levelDoc",
                        majorDoc: "$majorDoc",
                        programDoc: "$programDoc"
                    },
                    data: {$push: "$$ROOT"}
                }
            }

        ]);

        if (studentListList && studentListList.length > 0) {
            studentListList.forEach((obj) => {
                if (obj && obj.data.length > 0) {
                    studentListHTML += ` 
 <div class="row">
                              <div class="col-lg-3">
<img style="width: 70px;height: 70px;float: left !important;"
     src="/mih.png"
     alt="">
                              </div>
                                <div class="col-md-6" style="text-align: center !important;">

                                        <span style="font-family:Khmer os muol; font-size: 15px;">
                                            <p>${companyDoc.khName}</p> <p>${companyDoc.enName}</p>
                                         <p style="font-size: 9px !important; font-family: khmer os Battambang; margin-bottom: 0px !important;">
                                        ${companyDoc.address}(${companyDoc.phoneNumber})
                                            </p>
                                        </span>
                                 </div>
                              <div class="col-md-3"></div>
                          </div>
                <table class="table table-report-block-summary table-bordered">
                      <caption>

                          <div class="row">
                              <div class="col-lg-3">
                                  <span style="float: left !important;">${translate['no']}:.........</span>
                              </div>
                              <div class="col-md-6"
                                   style="text-align: center; border: 0px !important;">
                                  <p style="font-family: 'Khmer OS Muol'; font-size: 15px;">${translate['title']}</p>
                              </div>
                              <div class="col-lg-3"></div>
                          </div>
                       
                      </caption>
                    <thead style="margin-top: 5px">
                        <tr>
                            <th>${translate['no']}</th>
                            <th>${translate['name']}</th>
                            <th>${translate['gender']}</th>
                            <th>${translate['dob']}</th>
                            <th>${translate['phoneNumber']}</th>
                            <th>${translate['address']}</th>
                        </tr>
                    </thead>
                    <tbody style="margin-bottom: 5px;">`;


                    let i = 1;
                    obj.data.forEach((ob) => {
                        if (ob.studentDoc) {
                            studentListHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${ob.studentDoc.personal.name}</td>
                            <td style="text-align: left !important;">${ob.studentDoc.personal.gender}</td>
                            <td style="text-align: center !important;">${ob.studentDoc.personal.dobName}</td>
                            <td style="text-align: center !important;">${ob.studentDoc.personal.phoneNumber}</td>
                            <td style="text-align: left !important;">${ob.studentDoc.personal.villageCurrent} ${ob.studentDoc.personal.communeCurrent} ${ob.studentDoc.personal.districtCurrent} ${ob.studentDoc.personal.provinceCurrent}</td>
                           
                        </tr>
                    `;
                            i++;
                        }
                    });

                    studentListHTML += `  </tbody>
                 </table>
                 <div class="row" style="width: 100% !important;page-break-after: always !important;">
                    <div style="width: 50%;float: left !important;text-align: center !important;">
                        បានឃើញ និង ពិនិត្យត្រឹមត្រូវ<br>.......................... ថ្ងៃទី ............    ខែ  ....................  ឆ្នាំ ...................<br><span
                            style="font-family: 'Khmer OS Muol'">ប្រធាន</span>
                    </div>

                    <div style="width: 50%;float: right !important;text-align: center !important;">
                        .......................... ថ្ងៃទី  ............ ខែ   ....................  ឆ្នាំ  ...................<br><br><b>រៀបចំដោយ</b><br><br>
                    </div>

                </div>
                    `;

                }
            });
        }


        data.studentListHTML = studentListHTML;
        return data;
    }
})
;


function getVoucherSubString(invoiceNo) {
    let newInvoice = invoiceNo.length > 9 ? parseInt((invoiceNo || "0000000000000").substr(9, 13)) : parseInt(invoiceNo || "0");
    return pad(newInvoice, 6);
}

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}

function getTypePromotion(val) {
    if (val === "Percent") {
        return "%";
    }
    return "";
}
