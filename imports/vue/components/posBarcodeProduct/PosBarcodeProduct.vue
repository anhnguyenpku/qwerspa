<template>
    <div class="barcode-product-component">
        <!--<div class="barcode-product-component" style="margin-right: -11px; margin-top: -11px;">-->
        <svg class="barcode"></svg>
    </div>
</template>
<script>
    export default {
        props: ['doc', 'company'],
        mounted() {
            this.$nextTick(function () {
                JsBarcode(this.$el.querySelector('svg.barcode'), (this.doc && this.doc.code || ""), {
                    textAlign: 'left',
                    fontSize: 9,
                    width: 3.2,
                    height: 50,
                    text: this.company.enShortName + (this.doc && this.doc.code || "")
//                marginLeft: 920.7
                });
            });
        }
    }
</script>