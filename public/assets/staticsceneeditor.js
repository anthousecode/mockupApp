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
                    <div v-show="isAdjShow">
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
                        <span class="adj-text">{{scenestore.s_id}}</span>
                        <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isDeviceShow"></i>
                        <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <template v-if="isDeviceShow">
                        <!--<div class="device" @click="deviceDialog = true">
                            <div class="arrow-icon"></div>
                            <div class="device-upload">
                                <div class="upload-icon"></div>
                            </div>
                        </div>-->
                        
                         <span v-for="(layer, index) in layers" :key="layer.id">
                            <div v-if="layer.controller == 'mockup'">
                             <!--<el-button icon="icon-Plus" class="floatbutton button-mockup" :style="'background:url('+cover_object[layer.id].texture.baseTexture.imageUrl+');'" @click="showUploadWindow(layer.id)">
		                     </el-button>-->
		                     <div class="device"  @click="showUploadWindow(layer.id)">
                                 <div class="arrow-icon"></div>
                                    <div class="device-upload button-mockup" :style="'background:url('+cover_object[layer.id].texture.baseTexture.imageUrl+');'">
                                        <div class="upload-icon"></div>
                                    </div>
                                </div>
                            </div>
                            </span>
                        
                        
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
                                        <span>{{item.i_img_title}}</span>
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
                                    <el-slider v-model="opacity" :min="0" :max="1" :step="0.01" @input="changeShadowOpacity"></el-slider>
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
            
            <!-- Device dialog   -->
            <el-dialog  :visible.sync="deviceDialog" width="545px">
              <div class="modal-device-wrap"></div>
            </el-dialog>
        </div> 
    `,
    data: function(){
        return{
            layers: [],
            cover_object: [],
            scenestore: '',
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
            devices:[],
            blendingItems: [
                {value: "Multiply", label: "Multiply"}
            ],
            blending: null,
            opacity: 1,
            deviceDialog: false
        }
    },
    mounted: function() {
        var _this = this;
        axios.post('/api/scenes/' + this.$route.params.id).then(function (response) {
            store.commit('loaddata', response.data);
            console.log(response.data);
            // Генерация события - загрузка данных
            _this.$emit('eventname', true)
        })
            .then(() => {
                this.scenestore = store.state.scenestore
                this.cover_object = vm.cover_object
                let devicesData = this.scenestore.s_layers[0].l_data
                this.layers = vm.layers
                console.log(vm.layers)
                for (let i = 0; i < devicesData.length; i++) {
/*                    let device

                    device = {
                        title: devicesData[i].i_img_title,
                        color: `#d7d7d7`
                    }*/
                    this.devices.push(devicesData[i])
                }
            })
            .catch(function (error) {
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
        showUploadWindow(index){
            vm.openUploader(index)
        },
        changeShadowOpacity(){
            vm.shadow_opacity = this.opacity
        },
        deviceHandler(item){
            vm.changeDevice(item)
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
                // this.hideAdjBarBtn();
            }
        },
        hideAdjBarBtn(){
            let elements = document.querySelectorAll('.adj-dropdown .el-slider__runway');
            let bars = Array.prototype.slice.call( elements );
            // console.log('in -', bars);
            bars.forEach(item => {
                // console.log(parseInt(item.childNodes[0].style.left));
                if(parseInt(item.childNodes[0].style.left) <= 50 && parseInt(item.childNodes[0].style.width) != 0){
                    console.log('yes')
                    // item.querySelectorAll('.el-slider__button-wrapper')[1].style.display = 'none';
                }else
                {
                    console.log('no')
                    // item.querySelectorAll('.el-slider__button-wrapper')[0].style.display = 'none';
                }
            })
        },
        colorAdjBar(id, item) {
            // this.hideAdjBarBtn();
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