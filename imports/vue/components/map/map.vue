<template>
    <div>
        <div id="mapid"></div>
    </div>
</template>

<script>
    export default {
        props: {
            //user for query propertie.ADMIN_ID inside wb_village collection
            adminId: {
                type: String,
                optional: true
            }
        },
        data() {
            return {
                mapOptions: {
                    center: {lat: 13.094769984560811, lng: 103.18824063475529},
                    zoom: 15
                }
            }
        },
        methods: {
            lookupAdminId() {
                Meteor.call('village_getVillageByDPC', this.adminId, (err, result) => {
                    if (!err) {
                        let latln = result.geometry.coordinates;
                        this.mapOptions.center = {
                            lat: latln[1],
                            lng: latln[0]
                        }
                    }
                });
            }
        },
        created() {
            this.lookupAdminId();
        },
        mounted() {
            let el = this.$el.querySelector('#mapid');
            setTimeout(() => {
                this.$_GoogleMapsLoader.load(() => {
                    let map = new google.maps.Map(el, this.mapOptions)
                    let marker = new google.maps.Marker({
                        position: this.mapOptions.center,
                        map: map
                    })
                });
            }, 500);
        }
    }
</script>
<style scoped>
    #mapid {
        height: 500px;
    }
</style>