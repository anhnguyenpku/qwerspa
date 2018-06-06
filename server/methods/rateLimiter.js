import {Meteor} from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
const LISTS_METHODS = [
    'fetchGeneralDistrictData',
    'wp_fetchCategory',
    'wp_fetchType',
    'wp_fetchMeasure',
    'wp_fetchFloorBy',
    'wp_fetchReferenceType',
    'fetchProvinces',
    'fetchDistricts',
    'fetchCommunes',
    'fetchVillages',
    'fetchRolesBranch',
    'fetchRolesArea',
    'fetchQuartierByDistrictCodeId',
    'fetchBlockByQuariterCode',
    'addNewActivity',
    'updateActivity',
    'meterReadingJournalReport',
    'fineOneMeterReadingJournalDetail',
    'getMeterJournalByBarcode',
    'journalBook_toggleLock'
];

DDPRateLimiter.addRule({
    name(name) {
        return _.contains(LISTS_METHODS, name);
    },
    // Rate limit per connection ID
    connectionId() {
        return true;
    }
}, 5, 1000);