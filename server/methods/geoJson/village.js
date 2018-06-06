import {WB_VILLAGES} from '../../../imports/collection/village';
import excel from 'node-excel-export';

Meteor.methods({
    village_getVillageByDPC(adminId) {
        let village = WB_VILLAGES.findOne({'properties.ADMIN_ID': adminId});
        return village;
    },
    village_getVillageWithADMIN_ID2(adminId2) {
        return WB_VILLAGES.find({'properties.ADMIN_ID2': adminId2}).fetch();
    },
    village_exportVillages(data) {

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
            [{value: 'GEO Village', style: styles.mainHeader}],
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
            commune: { // <- the key should match the actual data key
                displayName: 'Commune', // <- Here you specify the column header
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
            village: { // <- the key should match the actual data key
                displayName: 'Village', // <- Here you specify the column header
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
            adminId: { // <- the key should match the actual data key
                displayName: 'ADMIN_ID', // <- Here you specify the column header
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
        let i = 1;
        data.forEach(function (doc) {
            dataset.push({
                index: i,
                commune: doc.properties.NAME3,
                village: doc.properties.NAME,
                adminId: doc.properties.ADMIN_ID
            });
            i++;
        });
        //footer
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
    }
});