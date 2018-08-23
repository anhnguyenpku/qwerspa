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
import {Sch_Class} from "../../../imports/collection/schClass";

Meteor.methods({
    schStudentListReport(params, translate) {
        let parameter = {};
        let selectorStatus = {};
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

        } else {
            if (params.date !== null && params.date !== "") {
                let classList = Sch_Class.find({
                    classDate: {
                        $lte: moment(params.date[1]).endOf("day").toDate(),
                        $gte: moment(params.date[0]).startOf("day").toDate()
                    }
                }).map((obj) => {
                    return obj._id;
                });
                parameter["studentList.classId"] = {$in: classList};

            } else {
                selectorStatus["classDoc.status"] = true;
            }
        }
        if (params.status) {
            parameter["studentList.status"] = params.status;
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
            },
            {
                $match: selectorStatus
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
                if (obj && obj.data.length > 0 && obj._id.classDoc !== undefined) {
                    let i = 1;
                    studentListHTML += ` 
                <table class="table table-report-block-summary table-bordered">
                      <caption>

                          <div class="row">
                                <div class="col-md-12" style="text-align: center !important;">
                                    <img style="width: auto;height: 100px; float: left;padding-top: 20px !important;"
                                         src="/mih.png"
                                         alt=""
                                         ">
                                        <span class="blueOnPrint"
                                              style="font-family:Khmer os muol; font-size: 15px  !important;padding-top: 15px !important;float: left;text-align: left !important;">

                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">ក្រសួងការងារ និង បណ្តុបណ្តាលវិជ្ជាជីវៈ</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">Ministry of Labor and Vocational Training</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">${companyDoc.khName}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">   ${companyDoc.enName}</p>
                                              <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">    លេខ៖ .............................${companyDoc.khShortName}</p>

                                            </span>

                              <span style="text-align: center;font-size: 15px; border: 0px !important; float: right;"
                              >
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">ព្រះរាជាណាចក្រកម្ពុជា</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">Kingdom Of Cambodia</p>
                                  <p style="font-family: 'Khmer OS Muol' !important;" class="blueOnPrint">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
                                  <p style="font-family: 'Khmer OS Muol' !important; margin-bottom: 0px !important;"
                                     class="blueOnPrint">Nation Religion King</p>
                                  <p style="font-family:tacteing;font-size: 40px; margin: 0px !important;">6</p>

                              </span>
                              </div>
                          </div>
                          <br>
                          <div class="row">
                              <div class="col-md-12  balckOnPrint" style="text-align: center;font-family:'Khmer OS Muol Light'">
                                 ${translate['title']}
                                  <br>
                                  <p>${translate['major']} ${obj._id.majorDoc.name}</p>
                                  <p>${obj._id.classDoc.name}</p>
                                  <p style="font-family:tacteing ">rs</p>
                              </div>
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
                    obj.data.forEach((ob) => {
                        if (ob.studentDoc) {
                            studentListHTML += `
                        <tr>
                            <td style="text-align: center !important;">${i}</td>
                            <td style="text-align: left !important;">${ob.studentDoc.personal.name}</td>
                            <td style="text-align: left !important;">${ob.studentDoc.personal.gender}</td>
                            <td style="text-align: center !important;">${ob.studentDoc.personal.dobName}</td>
                            <td style="text-align: center !important;">${ob.studentDoc.personal.phoneNumber || ""}</td>
                            <td style="text-align: left !important;">${ob.studentDoc.personal.villageCurrent || ""} ${ob.studentDoc.personal.communeCurrent || ""} ${ob.studentDoc.personal.districtCurrent || ""} ${ob.studentDoc.personal.provinceCurrent || ""}</td>
                           
                        </tr>
                    `;
                            i++;
                        }
                    });

                    studentListHTML += `  </tbody>
                 </table>
                 <div class="row" style="width: 100% !important;page-break-after: always !important;">
                    <div style="width: 50%;float: left !important;text-align: center !important;">
                        បានឃើញ និង ពិនិត្យត្រឹមត្រូវ
                        <br><br>ថ្ងៃ ........................    ខែ  ........................ឆ្នាំ .................................<br>
                        <br>.......................... ថ្ងៃទី ............    ខែ  ....................  ឆ្នាំ ...................<br>
                        <span style="font-family: 'Khmer OS Muol'">នាយក</span>
                    </div>

                    <div style="width: 50%;float: right !important;text-align: center !important;">
                        ថ្ងៃ ........................    ខែ  ........................ឆ្នាំ .................................<br><br>

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
