<template>
    <div class="request-update">
        <br>
        <slot v-if="requestDocArr.length === 0">
            <h1 align="center">មិនមានទិន្នន័យ</h1>
        </slot>
        <slot v-else>
            <div class="col-md-6" v-for="requestDoc in requestDocArr" :key="requestDoc._id">
                <div class="well">
                    <div class="media">
                        <!--<a class="pull-left" href="#">-->
                        <!--<img class="media-object" src="http://placekitten.com/150/150">-->
                        <!--</a>-->
                        <div class="media-body">
                            <br>
                            <h4 class="media-heading" style="font-family: 'Khmer OS Moul';font-size: 15px">ស្នើរសុំដោយ
                                {{displayRequestUser(requestDoc.requestBy)}}</h4>
                            <p class="fz12">អតិថិជន៖ {{requestDoc.doc.customerDoc.khName}}, Street:
                                {{requestDoc.doc.streetNo}}</p>
                            <p class="fz12">អំណានចាស់៖ {{requestDoc.doc.prevReading}}</p>
                            <p class="fz12">អំណានថ្មី៖ {{requestDoc.doc.newReading}}</p>
                            <p class="fz12">ថ្ងៃបញ្ជូន៖ {{formatDate(requestDoc.doc.lastSynced)}}</p>
                            <p class="fz12">ចំនួនប្រើប្រាស់៖ {{requestDoc.doc.waterConsumption}}</p>
                            <ul class="list-inline list-unstyled">

                            <span @click="handleAccept(requestDoc)"><a class="btn btn-primary"><i
                                    class="fa fa-check"></i> Accept</a></span>
                                <li>
                                    <a class="btn btn-danger" @click="handleDecline(requestDoc)"><i
                                            class="fa fa-times"></i> Decline </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </slot>
    </div>
</template>

<style scoped>
    .fz12 {
        font-size: 12px;
    }
</style>
<script>
    import {WB_RequestUpdateJournalDetail} from '../../collection/requestUpdateJournalDetail'

    export default {
        meteor: {
            requestDocArr() {
                return WB_RequestUpdateJournalDetail.find({}, {sort: {requestDate: -1}}).fetch();
            }
        },
        data() {
            return {
                requestDocArr: []
            };
        },
        methods: {
            displayRequestUser(userId) {
                let user = Meteor.users.findOne({_id: userId});
                return user.username || '';
            },
            formatDate(date) {
                return moment(date).format('DD/MM/YYYY HH:mm');
            },
            handleAccept(request) {
                this.$confirm('Accept Request ?', 'Confirm', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    request.doc.bypassPrinted = true;
                    Meteor.call('api_syncJournalDetailToServer', request.doc.journalBookId, [request.doc], request.requestBy, (err, result) => {
                        if (!err) {
                            Meteor.call('requestUpdateJournalDetail_update', request._id, {$set: {status: 'accepted'}});
                        }
                    })
                }).catch((err) => {

                });
            },
            handleDecline(request) {
                this.$confirm('Accept Request ?', 'Confirm', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'error'
                }).then(() => {
                    Meteor.call('requestUpdateJournalDetail_update', request._id, {$set: {status: 'declined'}});
                }).catch((err) => {

                });

            }
        }
    }
</script>