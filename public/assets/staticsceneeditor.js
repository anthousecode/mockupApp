const StaticSceneEditor = {
    template: `
        <div class="st-scene-wrap">
            <div id="workspace" class="st-scene__main">
                <canvas id="canvas" class="el-workspace-background"></canvas>
            </div>
            <div class="st-scene__aside">
                <div class="adj-wrap">
                    <div class="adj-btn" @click="isAdjShow = !isAdjShow">
                        <div class="adj-icon" alt="Icon"></div>
                        <span class="adj-text">Adjustments</span>
                        <i class="el-icon-caret-right el-icon--right adj-arrow"></i>
                    </div>
                    <div v-if="isAdjShow">
                        <div class="adj-dropdown">
                            <div class="block adj-bar">
                                <div class="adj-bar__icon"></div>
                                <el-slider v-model="value1" range="" :min="min" :max="max" :step="step" @change=""></el-slider>
                            </div>
                            <div class="block adj-bar">
                                <div class="adj-bar__icon"></div>
                                <el-slider v-model="value2" range="" :min="min" :max="max" :step="step"></el-slider>
                            </div>
                            <div class="block adj-bar">
                                <div class="adj-bar__icon"></div>
                                <el-slider v-model="value3" range="" :min="min" :max="max" :step="step"></el-slider>
                            </div>
                            <div class="block adj-bar">
                                <div class="adj-bar__icon"></div>
                                <el-slider v-model="value4" range="" :min="min" :max="max" :step="step"></el-slider>
                            </div>
                        </div>
                    </div>   
                </div>
            </div>
             </div>     
    `,
    data: function(){
        return{
            isAdjShow: false,
            min: -1,
            max: 1,
            step: 0.1,
            value1: [0, 0],
            value2: [0, 0],
            value3: [0, 0],
            value4: [0, 0]
        }
    },
    mounted: function() {
        var _this = this;
        axios.post('/api/scenes/' + this.$route.params.id).then(function (response) {
            store.commit('loaddata', response.data);
            console.log(response.data);
            // Генерация события - загрузка данных
            _this.$emit('eventname', true)
        }).catch(function (error) {
            console.log(error);
        });
        this.$nextTick(function() {
            window.addEventListener('resize', this.getWindowWidth);
            window.addEventListener('resize', this.getWindowHeight);
            this.getWindowWidth()
            this.getWindowHeight();
        })
    },
    methods:{
        colorAdjBar(e){
            console.log(e.target)
            // let bars = document.getElementsByClassName('el-slider__runway');
            // console.log('bars - ',bars)
        },
        nextTooltip() {
            this.tooltips.unshift(false);
            this.tooltips.pop();
            if (this.tooltips.indexOf(true) == -1) this.showtooltips = false;
        },
        getWindowWidth(event) {
            document.getElementById("canvas").style.width = (document.getElementById("workspace").offsetWidth) + 'px';
        },
        getWindowHeight(event) {
            document.getElementById("canvas").style.height = (document.getElementById("workspace").offsetHeight) + 'px';
        }
    },
    beforeDestroy() {
        store.commit('loaddata', []);
        //window.removeEventListener('resize', this.getWindowWidth);
        //window.removeEventListener('resize', this.getWindowHeight);
        _this.$emit('endsession', true)
    }
};