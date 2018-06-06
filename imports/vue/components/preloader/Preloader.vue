<template>
        <div :class="enablePreLoader">
            <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
            </div>
        </div>
</template>

<script>
    export default {
        props: {
            size: String, required: true
        },
        computed: {
            enablePreLoader(){
                return `preloader-wrapper ${this.size} active`
            }
        }
    }
</script>