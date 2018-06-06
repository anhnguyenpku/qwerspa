<template>
    <div :style="style" ref="lavContainer"></div>
</template>

<script>
    export default {
        props: {
            /**
             * Can pass options with animation data
             * */
            options: {
                type: Object,
                required: true
            },
            height: Number,
            width: Number,
        },
        data() {
            return {

                style: {
                    width: this.width ? `${this.width}px` : '100%',
                    height: this.height ? `${this.height}px` : '100%',
                    overflow: 'hidden',
                    margin: '0 auto'
                }
            }
        },
        created() {

        },
        mounted() {
            setTimeout(() => {
                this.anim = this.$_bodymovin.loadAnimation({
                        container: this.$refs.lavContainer,
                        renderer: 'svg',
                        loop: this.options.loop !== false,
                        autoplay:  this.options.autoplay !== false,
                        animationData: this.options.animationData,
                        rendererSettings: this.options.rendererSettings
                    }
                );
                this.$emit('animCreated', this.anim)
                /**
                 * Emit to use below function
                 */

                // stop: function () {
                //     this.anim.stop();
                // },
                //
                // play: function () {
                //     this.anim.play();
                // },
                //
                // pause: function () {
                //     this.anim.pause();
                // },
                //
                // onSpeedChange: function () {
                //     this.anim.setSpeed(this.animationSpeed);
                // }
            }, 100)

        }
    }
</script>