<template>
    <div class="barcode-product-component" style="margin-right: -11px; margin-top: -11px;">
        <svg class="barcode"></svg>
    </div>
</template>
<script>
    export default {
        props: ['doc', 'company'],
        mounted() {
            this.$nextTick(function () {
                JsBarcode(this.$el.querySelector('svg.barcode'), (this.doc.barcode || "Hello"), {
                    textAlign: 'right',
                    fontSize: 9,
                    width: 1.6,
                    height: 40,
                    text: this.company.enShortName + (this.doc.barcode || "Hello")
//                marginLeft: 920.7
                });
            });
        }
    }
</script>