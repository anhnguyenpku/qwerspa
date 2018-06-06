import excel from 'node-excel-export';

Meteor.methods({
    giveMeSaleReportAsExcelFile(data, total){
        const formatNumber = "0,0.00";
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
            headerField: {
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
            [{value: 'Sale Report', style: styles.mainHeader}],
            [],
            [],
            []
        ];

//Here you specify the export structure
        const specification = {
            index: { // <- the key should match the actual data key
                displayName: 'No', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 40 // <- width in pixels
            },
            khName: { // <- the key should match the actual data key
                displayName: 'Kh Name', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            enName: { // <- the key should match the actual data key
                displayName: 'En Name', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            district: { // <- the key should match the actual data key
                displayName: 'District', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    } // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            quartier: { // <- the key should match the actual data key
                displayName: 'Quartier', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            block: { // <- the key should match the actual data key
                displayName: 'Block', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            maintenanceFee: {
                displayName: 'Maintenance Fee', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            contributionFee: {
                displayName: 'Contribution Fee', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            total: {
                displayName: 'Total', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            grandTotal: {
                displayName: 'Grand Total', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            }
        }

// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification
//         const dataset = [
//             {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
//             {customer_name: 'HP', status_id: 0, note: 'some note'},
//             {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
//         ]
        const dataset = [];
        let i=1;
        data.forEach(function (doc) {
            dataset.push({
                index:i,
                khName: doc.customerDoc.khName,
                enName: doc.customerDoc.name,
                district: doc.districtDoc.name,
                block: doc.blockDoc.name,
                quartier: doc.quartierDoc.name,
                maintenanceFee: doc.maintenanceFee,
                contributionFee: doc.contributionFee,
                total: doc.total,
                grandTotal: doc.grandTotal
            });
            i++;
        });
        //footer
        dataset.push({
            index:'',
            total: 'Total',
            grandTotal: total
        })
// Define an array of merges. 1-1 = A:1
// The merges are independent of the data.
// A merge will overwrite all data _not_ in the top-left cell.
        const merges = [
            {start: {row: 1, column: 1}, end: {row: 4, column: 10}},
            {start: {row: 6, column: 1}, end: {row: 6, column: 1}},
            {start: {row: dataset.length + 5, column: 1}, end: {row: dataset.length + 5, column: 8}},
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
        return report

// You can then return this straight
//         res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
//         return res.send(report);

// OR you can save this buffer to the disk by creat

    },
    giveMePaymentReportAsExcelFile(payment){
        let data=payment.data;
        const formatNumber = "0,0.00";
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
            headerField: {
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
            [{value: 'Payment Report', style: styles.mainHeader}],
            [],
            [],
            []
        ];

//Here you specify the export structure
        const specification = {
            index: { // <- the key should match the actual data key
                displayName: 'No', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 40 // <- width in pixels
            },
            dueAmount: { // <- the key should match the actual data key
                displayName: 'Due Amount', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            paidAmount: { // <- the key should match the actual data key
                displayName: 'Paid Amount', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            balance: { // <- the key should match the actual data key
                displayName: 'Balance', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    } // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },


        };

// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification
//         const dataset = [
//             {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
//             {customer_name: 'HP', status_id: 0, note: 'some note'},
//             {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
//         ]
        const dataset = [];
        let i=1;
        data.forEach(function (doc) {
            dataset.push({
                index:i,
                dueAmount: doc.dueAmount,
                paidAmount: doc.paidAmount,
                balance: doc.balance
            });
            i++;
        });
        //footer
        dataset.push({
            index:"Total",
            dueAmount: payment.totalDueAmount,
            paidAmount: payment.totalPaidAmount,
            balance: payment.totalBalance
        });
// Define an array of merges. 1-1 = A:1
// The merges are independent of the data.
// A merge will overwrite all data _not_ in the top-left cell.
        const merges = [
            {start: {row: 1, column: 1}, end: {row: 4, column: 4}},
            {start: {row: 6, column: 1}, end: {row: 6, column: 1}},
           // {start: {row: dataset.length + 5, column: 1}, end: {row: dataset.length + 5, column: 7}},
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
        return report

// You can then return this straight
//         res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
//         return res.send(report);

// OR you can save this buffer to the disk by creat

    },
    giveMeMeterChangeReportAsExcelFile(data, total){
        const formatNumber = "0,0.00";
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
            headerField: {
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
            [{value: 'Meter Change Report', style: styles.mainHeader}],
            [],
            [],
            []
        ];

//Here you specify the export structure
        const specification = {
            index: { // <- the key should match the actual data key
                displayName: 'No', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 40 // <- width in pixels
            },
            khName: { // <- the key should match the actual data key
                displayName: 'Kh Name', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            name: { // <- the key should match the actual data key
                displayName: 'En Name', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            modifiedDate: { // <- the key should match the actual data key
                displayName: 'Date', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    } // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
        };

// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification
//         const dataset = [
//             {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
//             {customer_name: 'HP', status_id: 0, note: 'some note'},
//             {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
//         ]
        const dataset = [];
        let i=1;
        data.forEach(function (doc) {
            dataset.push({
                index:i,
                khName: doc.history.khName,
                name: doc.history.name,
                modifiedDate: doc.modifiedDate,
            });
        });
        //footer
       /* dataset.push({
            total: 'Total',
            khName: '',
            grandTotal: total
        })*/
// Define an array of merges. 1-1 = A:1
// The merges are independent of the data.
// A merge will overwrite all data _not_ in the top-left cell.
        const merges = [
            {start: {row: 1, column: 1}, end: {row: 4, column: 9}},
            {start: {row: 6, column: 1}, end: {row: 6, column: 1}},
           // {start: {row: dataset.length + 5, column: 1}, end: {row: dataset.length + 5, column: 7}},
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
        return report

// You can then return this straight
//         res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
//         return res.send(report);

// OR you can save this buffer to the disk by creat

    },
    giveMeUnpaidCustomerReportAsExcelFile(data, totalBalance){
        const formatNumber = "0,0.00";
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
            headerField: {
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
            [{value: 'Unpaid Customer Report', style: styles.mainHeader}],
            [],
            [],
            []
        ];

//Here you specify the export structure
        const specification = {
            index: { // <- the key should match the actual data key
                displayName: 'No', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 40 // <- width in pixels
            },
            khName: { // <- the key should match the actual data key
                displayName: 'Kh Name', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            enName: { // <- the key should match the actual data key
                displayName: 'En Name', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            district: { // <- the key should match the actual data key
                displayName: 'District', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    } // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            quartier: { // <- the key should match the actual data key
                displayName: 'Quartier', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            block: { // <- the key should match the actual data key
                displayName: 'Block', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            maintenanceFee: {
                displayName: 'Maintenance Fee', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            contributionFee: {
                displayName: 'Contribution Fee', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            total: {
                displayName: 'Total', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            },
            grandTotal: {
                displayName: 'Grand Total', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            } ,
            balance: {
                displayName: 'Balance', // <- Here you specify the column header
                headerStyle: styles.headerField, // <- Header style
                cellStyle: function (value, row) { // <- style renderer function
                    // if the status is 1 then color in green else color in red
                    // Notice how we use another cell value to style the current one
                    return {
                        numFmt: formatNumber,
                        border: styles.headerField.border,
                    }; // <- Inline cell style is possible
                },
                width: 120 // <- width in pixels
            }
        };

// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification
//         const dataset = [
//             {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
//             {customer_name: 'HP', status_id: 0, note: 'some note'},
//             {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
//         ]
        const dataset = [];
        let i=1;
        data.forEach(function (doc) {
            dataset.push({
                index:i,
                khName: doc.customerDoc.khName,
                enName: doc.customerDoc.name,
                district: doc.districtDoc.name,
                block: doc.blockDoc.name,
                quartier: doc.quartierDoc.name,
                maintenanceFee: doc.maintenanceFee,
                contributionFee: doc.contributionFee,
                total: doc.total,
                grandTotal: doc.grandTotal,
                balance: doc.balance
            });
            i++;
        });
        //footer
        dataset.push({
            index:'',
            grandTotal: "Total",
            balance: totalBalance,
        });
// Define an array of merges. 1-1 = A:1
// The merges are independent of the data.
// A merge will overwrite all data _not_ in the top-left cell.
        const merges = [
            {start: {row: 1, column: 1}, end: {row: 4, column: 11}},
            {start: {row: 6, column: 1}, end: {row: 6, column: 1}},
            {start: {row: dataset.length + 5, column: 1}, end: {row: dataset.length + 5, column: 9}},
        ];

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
        return report

// You can then return this straight
//         res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
//         return res.send(report);

// OR you can save this buffer to the disk by creat

    }
});