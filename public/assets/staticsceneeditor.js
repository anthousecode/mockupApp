const StaticSceneEditor = {
    template: `
        <div class="st-scene-wrap">
            <div id="workspace" class="st-scene__main">
                <canvas id="canvas" class="el-workspace-background"></canvas>
            </div>
            <div class="st-scene__aside">
                <div class="adj-wrap">
                    <div class="adj-btn" @click="showFilters">
                        <div class="adj-icon" alt="Icon"></div>
                        <span class="adj-text">Adjustments</span>
                        <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isAdjShow"></i>
                        <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <div v-if="isAdjShow">
                        <div class="adj-dropdown">
                            <div v-for="(range, index) in adjRanges" :key="index" class="block adj-bar">
                                <div class="adj-bar__icon">
                                    <img :src="range.icon">
                                </div>
                                <el-slider v-model="range.value" range="" :min="min" :max="max" :step="step" @input="colorAdjBar(index, range)"></el-slider>
                            </div>
                        </div>
                    </div>   
                </div>
                
                <div class="device-wrap">
                    <div class="adj-btn" @click="showDevice">
                        <div class="device-icon"></div>
                        <span class="adj-text">iPhone X</span>
                        <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isDeviceShow"></i>
                        <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <template v-if="isDeviceShow">
                        <div class="device">
                            <div class="arrow-icon"></div>
                            <div class="device-upload">
                                <div class="upload-icon"></div>
                            </div>
                        </div>
                        <div class="device-filter-wrap">
                            <div class="device-filter-header" @click="showMaterials">
                                <i class="el-icon-caret-right el-icon--right mat-arrow" v-if="!isMaterialsShow"></i>
                                <i class="el-icon-caret-bottom el-icon--right mat-arrow" v-else></i>
                                <span class="adj-text">Materials</span>
                            </div>
                            <template v-if="isMaterialsShow">
                                <div class="material-list">
                                    <div class="material-list__item" v-for="(item, i) in devices" :key="i" @click="deviceHandler(item)">
                                        <div class="color-icon" :style="{backgroundColor: item.color}"></div>
                                        <span>{{item.title}}</span>
                                    </div>
                                    <div class="material-list__item">
                                        <div class="color-icon color"></div>
                                        <span>Changeable</span>
                                        <div class="color-btn-wrap">
                                            <div class="color-btn"></div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="device-filter-wrap">
                            <div class="device-filter-header" @click="showShadow">
                                <i class="el-icon-caret-right el-icon--right mat-arrow" v-if="!isShadowShow"></i>
                                <i class="el-icon-caret-bottom el-icon--right mat-arrow" v-else></i>
                                <span class="adj-text">Shadow</span>
                            </div>
                            <template v-if="isShadowShow">
                                <div class="shadow-prop">
                                    <span>Blending</span>
                                    <el-select v-model="blending">
                                        <el-option v-for="item in blendingItems" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="shadow-prop">
                                    <span>Opacity</span>
                                    <el-slider v-model="opacity"></el-slider>
                                </div>
                            </template>
                        </div>
                        <div class="device-filter-wrap">
                            <div class="device-filter-header" @click="showDevAdj">
                                <i class="el-icon-caret-right el-icon--right mat-arrow" v-if="!isDevAdjShow"></i>
                                <i class="el-icon-caret-bottom el-icon--right mat-arrow" v-else></i>
                                <span class="adj-text">Adjustments</span>
                            </div>
                            <template v-if="isDevAdjShow">
                                <div class="material-list">
                                    
                                </div>
                            </template>
                        </div>
                    </template>   
                </div>
            </div>
        </div>     
    `,
    data: function(){
        return{
            isAdjShow: false,
            isDeviceShow: false,
            isMaterialsShow: false,
            isShadowShow: false,
            isDevAdjShow: false,
            min: -1,
            max: 1,
            step: 0.1,
            adjRanges:[
                {
                    value: [0,0],
                    icon: '/images/icons/exposure.svg'
                },
                {
                    value: [0,0],
                    icon: '/images/icons/saturation.svg'
                },
                {
                    value: [0,0],
                    icon: '/images/icons/contrast.svg'

                },
                {
                    value: [0,0],
                    icon: '/images/icons/brightness.svg'

                }
            ],
            devices:[
                {
                    color: '#d7d7d7',
                    title: 'White Clay'
                },{
                    color: '#161616',
                    title: 'Black Clay'
                },{
                    color: '#5a5a5a',
                    title: 'Official color'
                }
            ],
            blendingItems: [
                {value: "Multiply", label: "Multiply"}
            ],
            blending: null,
            opacity: 20
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
        deviceHandler(item){
            console.log(item)
        },
        showDevice(){
            this.isDeviceShow = !this.isDeviceShow;
        },
        showMaterials(){
            this.isMaterialsShow = !this.isMaterialsShow;
        },
        showShadow(){
            this.isShadowShow = !this.isShadowShow;
        },
        showDevAdj(){
            this.isDevAdjShow = !this.isDevAdjShow;
        },
        showFilters(){
            this.isAdjShow = !this.isAdjShow;
            if(this.isAdjShow){
                this.hideAdjBarBtn();
            }
        },
        hideAdjBarBtn(){
            let elements = document.getElementsByClassName('.el-slider__bar');
            let bars = Array.prototype.slice.call( elements );
            console.log('in -', elements);
            bars.forEach(item => {
                console.log(parseInt(item.style.left));
                if(parseInt(item.style.left) <= 50){
                    console.log('yes')
                    bars.querySelectorAll('.el-slider__button-wrapper')[0].style.display = 'none';
                }else{
                    console.log('no')
                    bars.querySelectorAll('.el-slider__button-wrapper')[1].style.display = 'none';
                }
            })
        },
        colorAdjBar(id, item) {
            this.
            let bar = document.getElementsByClassName("adj-bar")[id].querySelector('.el-slider__bar');
            if(item.value[0] < 0){
                bar.style.backgroundColor = '#f97050';
            }else{
                bar.style.backgroundColor = '#ffe100';
            }
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