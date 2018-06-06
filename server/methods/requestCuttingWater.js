import Payment from '../../imports/api/methods/payment';
import RequestCuttingWater from "../../imports/api/methods/requestCuttingWater";
Meteor.methods({
    payment_overdueCustomer(){
        let overdueCustomers = Payment.overdueCustomer();
        overdueCustomers.forEach(function(jb){
            jb.data.forEach(function(o){
                let today = moment().format('YYYY-MM-DD');
                let addDays = moment(o.newReadingDate).add(jb.invoiceExpiredAfter, 'days').format('YYYY-MM-DD');
                if(jb.invoiceExpiredAfter > 0){
                    if(moment(today).isAfter(addDays, 'day') && o.waterConsumption > 0){
                        let doc = {
                            journalBookDetailId: o._id,
                            blockId: o.block,
                            customerId: o.customerId,
                            invoiceExpiredAfter: jb.invoiceExpiredAfter,
                            status: 'active',
                            newReadingDate: o.newReadingDate,
                            streetNo: o.streetNo,
                            dpc: o.dpc,
                            rolesArea: o.rolesArea,
                        };
                        if(doc.journalBookDetailId){
                            RequestCuttingWater.insert(doc);
                        }
                    }
                }
            });

        });

    },
    payment_removeCuttingWater(_id){
        RequestCuttingWater.remove(_id)
    }
});