<template>
    <canvas :id="c_id">
    </canvas>
    <!-- <div style="width:100px; height: 100px; background-color: #000000">

    </div> -->
</template>

<script>
    export default {
        props: {
            visual_field: {
                type: Object,
            },
            c_id: {
                type: String,
            }
        },

        data() {
            return {
                canvas: null,
                width: 0,
                height: 0,
            }
        },

        methods: {
            drawCircle() {
                const ctx = this.canvas.getContext('2d');
                ctx.strokeStyle = 'rgb(180, 180, 180)';

                ctx.beginPath();
                ctx.arc(this.width/2, this.height/2, (this.width/2)-20, 0, this.degToRad(360), false);
                ctx.stroke();

                ctx.fillStyle = 'rgb(180, 180, 180)';
                ctx.fill();
                // ctx.strokeRect(0, 0, this.width-20, this.height-20);
            },

            degToRad(degrees) {
                return degrees * Math.PI / 180;
            },

            initCanvas() {
                this.canvas = document.querySelector('#'+this.c_id);
                this.width = this.canvas.width = 180;
                this.height = this.canvas.height = 180;
            },

            drawAxes() {
                const ctx = this.canvas.getContext('2d');
                ctx.strokeStyle = 'rgb(10, 10, 10)';

                ctx.beginPath();
                ctx.moveTo(this.width/2, 0);
                ctx.lineTo(this.width/2, this.height);
                ctx.stroke();

                ctx.moveTo(0, this.height/2);
                ctx.lineTo(this.width, this.height/2);
                ctx.stroke();
            },

            drawSector(quadrant) {

                switch (quadrant) {
                    case 1:
                        this.drawSectorArc(270, 360)
                        break;

                    case 2:
                        this.drawSectorArc(0, 90)
                        break;

                    case 3:
                        this.drawSectorArc(90, 180)
                        break;
                
                    case 4:
                        this.drawSectorArc(180, 270)
                        break;
                    default:
                        break;
                }

            },

            drawSectorArc(startAngle, endAngle) {
                const ctx = this.canvas.getContext('2d');
                ctx.fillStyle = 'rgba(0, 100, 0, 5)';
                ctx.beginPath();
                ctx.arc(this.width/2, this.height/2, (this.width/2)-15, 
                          this.degToRad(startAngle), this.degToRad(endAngle), false);

                ctx.lineTo(this.width/2, this.height/2);
                ctx.fill();

            }
        },

        computed: {
        },

        mounted () {
            this.initCanvas();
            this.drawCircle();

            /** track all quadrants in visual field object */
            if(this.visual_field.q1 == "good") {
                this.drawSector(1);
            }
            if(this.visual_field.q2 == "good") {
                this.drawSector(2);
            }
            if(this.visual_field.q3 == "good") {
                this.drawSector(3);
            }
            if(this.visual_field.q4 == "good") {
                this.drawSector(4);
            }

            this.drawAxes();
        },
        
    }
</script>

<style scoped>

</style>