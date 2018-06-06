import DashboardFn from '../../../imports/api/methods/dashboard';


Meteor.methods({
    dashboard_countCustomer(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countCustomer(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_countFullCustomer(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countFullCustomer(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_countInActiveCustomer(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countInActiveCustomer(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_countCustomerInPeriod(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countCustomerInPeriod(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_customerTransaction(month, rolesArea) {
        let startDate = moment(month).startOf('month').toDate();
        let endDate = moment(month).endOf('month').toDate();
        return DashboardFn.customerTransaction(startDate, endDate, rolesArea);
    },
    dashboard_totalPostedGraph(rolesArea) {
        return DashboardFn.totalPostedGraph(rolesArea);
    },
    dashboard_totalOverdue(rolesArea, pipeline) {
        return DashboardFn.totalOverdue(rolesArea, pipeline);
    },

    dashboard_countCustomerSum(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countCustomerSum(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_countFullCustomerSum(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countFullCustomerSum(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_countInActiveCustomerSum(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countInActiveCustomerSum(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_countCustomerInPeriodSum(month, rolesArea) {
        let startOfMonth = moment(month).startOf('month').toDate();
        let endOfMonth = moment(month).endOf('month').toDate();
        return DashboardFn.countCustomerInPeriodSum(startOfMonth, endOfMonth, rolesArea);
    },
    dashboard_customerTransactionSum(month, rolesArea) {
        let startDate = moment(month).startOf('month').toDate();
        let endDate = moment(month).endOf('month').toDate();
        return DashboardFn.customerTransactionSum(startDate, endDate, rolesArea);
    }
});