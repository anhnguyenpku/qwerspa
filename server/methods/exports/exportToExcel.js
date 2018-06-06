import XLSX from 'xlsx-style';
import excel from 'node-excel-export';
import {WB_MeterReadingJournalDetail} from '../../../imports/collection/meterReadingJournal'

Meteor.methods({
    giveMeTheExcelFile(data) {
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
                    underline: true
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
        const heading = [
            [{value: 'Battambang Water Supply', style: styles.mainHeader}],
            [],
            [],
            []
        ];

//Here you specify the export structure
        const specification = {
            customer_name: { // <- the key should match the actual data key
                displayName: 'Customer', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return (row.status_id == 1) ? styles.cellGreen : {
                        border: styles.headerDark.border,
                        fill: {fgColor: {rgb: 'FFFF0000'}}
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            status_id: {
                displayName: 'Status',
                headerStyle: styles.headerDark,
                cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
                    return (value == 1) ? 'Active' : 'Inactive';
                },
                width: '10' // <- width in chars (when the number is passed as string)
            },
            note: {
                displayName: 'Description',
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink, // <- Cell style
                width: 220 // <- width in pixels
            }
        }

// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification
        const dataset = [
            {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
            {customer_name: 'HP', status_id: 0, note: 'some note'},
            {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
        ]

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
                    name: 'Report', // <- Specify sheet name (optional)
                    heading: heading, // <- Raw heading array (optional)
                    merges: merges, // <- Merge cell ranges
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );
        // console.log(report);
        return report

// You can then return this straight
//         res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
//         return res.send(report);

// OR you can save this buffer to the disk by creat
    },
    downloadMeterReadingJournal(meterJournalId,date) {
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
        const heading = [
        ];

        //Here you specify the export structure
        const specification = {
            _id: { // <- the key should match the actual data key
                displayName: '_id', // <- Here you specify the column header
                headerStyle: styles.headerDark, // <- Header style
                width: 120 // <- width in pixels
            },
            customerId: {
                displayName: 'customerId',
                headerStyle: styles.headerDark,
                width: 100
            },
            streetNo: {
                displayName: 'streetNo',
                headerStyle: styles.headerDark,
                width: 70 // <- width in pixels
            },
            block: {
                displayName: 'block',
                headerStyle: styles.headerDark,
                width: 70
            },
            prevReadingDate: {
                displayName: 'prevReadingDate',
                headerStyle: styles.headerDark,
                width: 120 // <- width in pixels
            },
            newReadingDate: {
                displayName: 'newReadingDate',
                headerStyle: styles.headerDark,
                width: 100 // <- width in pixels
            },
            prevReading: {
                displayName: 'prevReading',
                headerStyle: styles.headerDark,
                width: 100 // <- width in pixels
            },
            newReading: {
                displayName: 'newReading',
                headerStyle: styles.headerDark,
                width: 100 // <- width in pixels
            },

        }

        // The data set should have the following shape (Array of Objects)
        // The order of the keys is irrelevant, it is also irrelevant if the
        // dataset contains more fields as the report is build based on the
        // specification provided above. But you should have all the fields
        // that are listed in the report specification

        let journalDetails = WB_MeterReadingJournalDetail.aggregate([
            {$match: {meterReadingJournalId:meterJournalId}},
            {
                $lookup: {
                    from: 'wb_customer',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDoc'
                }
            },
            {
                $lookup: {
                    from: 'wb_block',
                    localField: 'block',
                    foreignField: '_id',
                    as: 'blockDoc'
                }
            },
            {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$blockDoc', preserveNullAndEmptyArrays: true}},
            {
                $project: {
                    _id:1,
                    customerId:1,
                    streetNo:{$ifNull:["$streetNo", "$customerDoc.streetNo"]},
                    block:"$blockDoc.code",
                    prevReadingDate: {$dateToString: { format: "%Y-%m-%d", date: "$prevReadingDate" }},
                    newReadingDate: {$dateToString: { format: "%Y-%m-%d", date: "$newReadingDate" }},
                    prevReading: 1,
                    newReading: 1
                }
            },
            {
                $sort: {
                    'dpc': 1
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
                    name: 'Report', // <- Specify sheet name (optional)
                    heading: heading, // <- Raw heading array (optional)
                   // merges: merges, // <- Merge cell ranges
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );
        // console.log(report);
        return report

        // You can then return this straight
        //         res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
        //         return res.send(report);

        // OR you can save this buffer to the disk by creat
    }
})