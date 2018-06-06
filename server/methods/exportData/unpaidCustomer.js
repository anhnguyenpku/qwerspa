import {WB_MeterReadingJournalDetail} from "../../../imports/collection/meterReadingJournal";
import excel from "node-excel-export";

Meteor.methods({
    exportUnpaidCustomers({fields, date, dateRange, isPaid}) {
        const styles = {
            mainHeader: {
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                },
                font: {
                    color: {
                        rgb: '000000'
                    },
                    sz: 18,
                    bold: true,
                    underline: true
                }
            },
            headerDark: {
                border: {
                    top: {
                        style: 'thin',
                        color: {rgb: "000000"}
                    }, right: {
                        style: 'thin',
                        color: {rgb: "000000"}
                    }, left: {
                        style: 'thin',
                        color: {rgb: "000000"}
                    }, bottom: {
                        style: 'thin',
                        color: {rgb: "000000"}
                    }
                },
                // fill: {
                //     fgColor: {
                //         rgb: 'FF000000'
                //     }
                // },
                font: {
                    color: {
                        rgb: '000000'
                    },
                    sz: 11,
                    bold: true,
                }
            },
            cellPink: {
                fill: {
                    fgColor: {
                        rgb: 'FFFFCCFF'
                    }
                }
            },
            cellGreen: {
                fill: {
                    fgColor: {
                        rgb: 'FF00FF00'
                    }
                }
            }
        };
        //for style info go to https://www.npmjs.com/package/xlsx-style#style

        //Array of objects representing heading rows (very top)
        const heading = [];
        let specification = {
            month: {
                displayName: 'month',
                headerStyle: styles.headerDark, // <- Header style
                width: 100 // <- width in pixels

            },
            newReadingDate: {
                displayName: 'newReadingDate',
                headerStyle: styles.headerDark, // <- Header style
                width: 100 // <- width in pixels
            }
        };
        let project = {
            month: {$dateToString: {format: '%m-%Y', date: '$newReadingDate'}},
            newReadingDate: {$dateToString: {format: '%d-%m-%Y', date: '$newReadingDate'}}
        };
        fields.forEach(function (o) {
            specification[o] = {
                displayName: o,
                headerStyle: styles.headerDark, // <- Header style
                width: 100 // <- width in pixels
            };
            switch (o) {
                case 'customerName':
                    project[o] = '$customerDoc.khName';
                    break;
                case 'customerId':
                    project[o] = '$customerDoc._id';
                    break;
                case 'sumId':
                    project[o] = '$customerDoc.sumId';
                    break;
                default:
                    project[o] = 1;
            }
        });
        let querySelector = {};
        if (isPaid) {
            let startDate = moment(dateRange[0]).startOf('days').toDate();
            let endDate = moment(dateRange[1]).endOf('days').toDate();
            querySelector = {
                closedAt: {$gte: startDate, $lte: endDate},
                paymentStatus: 'closed'
            };
        } else {
            querySelector = {
                balance: {$gt: 1000},
                newReadingDate: {$lte: moment(date).endOf('days').toDate()},
                $or: [
                    {paymentStatus: {$ne: 'closed'}},
                    {closedAt: {$gt: date}}
                ]
            }
        }
        let journalDetails = WB_MeterReadingJournalDetail.aggregate([
            {
                $match: querySelector
            },
            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
            {
                $project: project
            },
            {
                $sort: {
                    'streetNo': 1
                }
            },

        ]);


        const dataset = journalDetails;
        // Define an array of merges. 1-1 = A:1
        // The merges are independent of the data.
        // A merge will overwrite all data _not_ in the top-left cell.
        const merges = [
            {start: {row: 1, column: 1}, end: {row: 4, column: 3}},
            {start: {row: 6, column: 1}, end: {row: 6, column: 1}},
        ]

        // Create the excel report.
        // This function will return Buffer
        const report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Unpaid Customers', // <- Specify sheet name (optional)
                    heading: heading, // <- Raw heading array (optional)
                    // merges: merges, // <- Merge cell ranges
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );
        return report

    }
})