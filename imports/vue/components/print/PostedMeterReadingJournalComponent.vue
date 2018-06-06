<template>
    <div class="barcode-component" style="margin-right: -11px; margin-top: -11px;">
        <svg class="barcode"></svg>
    </div>
</template>


<script>
    export default {
        props: ['doc', 'company'],
        mounted() {
            this.$nextTick(function () {
                JsBarcode(this.$el.querySelector('svg.barcode'), this.doc.sumBarcode || this.doc.barcode, {
                    textAlign: 'right',
                    fontSize: 9,
                    width: 1.6,
                    height: 40,
                    text: this.doc.waterBillingDoc.enShortName + (this.doc.sumBarcode || this.doc.barcode)
//                marginLeft: 920.7
                });
            });
        }
    }
</script>