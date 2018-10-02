const StaticSceneEditor = {
    template: `
        <div class="st-scene-wrap">
            <div id="workspace" class="st-scene__main">
                <canvas id="canvas" class="el-workspace-background"></canvas>
            </div>
            <div class="st-scene__aside">
                <div :class="{'block_active':isAdjShow, 'adj-wrap': true}">
                    <div class="adj-btn" @click="showFilters">
                        <div class="adj-icon" alt="Icon"></div>
                        <span class="adj-text">Adjustments</span>
                        <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isAdjShow"></i>
                        <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <div v-show="isAdjShow">
                        <div class="adj-dropdown">
                            <div v-for="(range, index) in adjRanges" :key="index" class="block adj-bar" >
                                <div class="adj-bar__icon">
                                    <img :src="range.icon">
                                </div>
                                <el-slider v-model="range.value" range="" :min="min" :max="max" :step="step" @input="colorAdjBar(index, range)"></el-slider>
                            </div>
                        </div>
                    </div>
                </div>

                <div :class="{'block_active':isDeviceShow, 'device-wrap': true}" v-for="(layer, index) in layers" :key="layer.id">
                    <div class="adj-btn" @click="showDevice">
                        <div class="device-icon"></div>
                        <span class="adj-text">{{scenestore.s_name}}</span>
                        <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isDeviceShow"></i>
                        <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <template v-if="isDeviceShow">
                         <span>
                            <div>
		                     <div class="device"  @click="showUploadWindow(layer.id)">
                                 <div class="arrow-icon"></div>
                                    <div class="device-upload button-mockup"  :style="{ 'background-image' : 'url(' + cover_object[index].texture.baseTexture.imageUrl + ')' }">
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
                                    <div class="material-list__item" v-for="(item, i) in devices" :key="i" @click="deviceHandler(item, index)">
                                        <div class="color-icon" :style="{backgroundColor: item.color}"></div>
                                        <span>{{item.i_img_title}}</span>
                                    </div>
                                    <div class="material-list__item color-picker">
                                        <div class="color-icon color"></div>
                                        <span @click="activeChangeableDevice(index)">Changeable</span>
                                        <div class="color-btn-wrap">
                                            <div class="color-btn" @click="isDevColorShow = !isDevColorShow" :style="{backgroundColor: calcDevColor}"></div>
                                        </div>
                                         <!--<el-color-picker v-model="devColor" @active-change="changeDeviceColor"  :predefine="predefineColors">-->
                                         <!--</el-color-picker>-->
                                    </div>
                                    <colorpicker v-model="devColor[index]" @input="changeDeviceColor(index)" v-show="isDevColorShow">
                                    </colorpicker>
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
                                    <el-select v-model="blending" value-key="blending" placeholder="Normal" @change="changeShadowBlending(blending)">
                                        <el-option v-for="item in blendingItems" :key="item.value" :label="item.label" :value="item.value" >
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
                                      <div class="adj-dropdown">
                                        <div v-for="(range, id) in adjDeviceRanges[index]" :key="id" class="block adj-device-bar adj-bar" >
                                            <div class="adj-bar__icon">
                                                <img :src="range.icon">
                                            </div>
                                            <el-slider v-model="range.value" range="" :min="min" :max="max" :step="step" @input="colorAdjDeviceBar(id, range, index)"></el-slider>
                                        </div>
                                      </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>
                <div :class="{'block_active':isBgShow, 'bg-wrap': true}">
                    <div class="adj-btn" @click="showBgPicker">
                            <div class="bg-icon" alt="Icon"></div>
                            <span class="adj-text">Background</span>
                            <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isBgShow"></i>
                            <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <div v-show="isBgShow">
                        <div class="tabs-wrap">
                            <el-radio-group  style="">
                              <el-radio-button  v-model="gradientType" @change="changeGradientType" label="flat" class="grad flat"></el-radio-button>
                              <el-radio-button  v-model="gradientType" @change="changeGradientType" label="linear" class="grad linear"></el-radio-button>
                              <el-radio-button  v-model="gradientType" @change="changeGradientType" label="radial" class="grad radial"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div class="rad-slider-wrap" v-show="gradientType='linear'">
                            <rad-slider name="rad" :degree="rad" @rotate="rotate"></rad-slider>
                            <div class="degree-text">{{radDegree}}&#176;</div>
                        </div>
                        <div class="gp-wrap" v-show="gradientType='linear'||'radial'">
                            <div id="grapick"></div>
                        </div>
                       <colorpicker v-model="bgColor" @input="changeBgColor" id="staticColorPicker">
                       </colorpicker>
                    </div>
                </div>
                    
                <div :class="{'block_active':isExportShow, 'export-wrap': true}">
                    <div class="adj-btn" @click="showExport">
                            <span class="adj-text">Export</span>
                            <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isExportShow"></i>
                            <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <div v-show="isExportShow">
                        <p>
                           <input type="text" size="4" v-model="exportSize[0]" @input="onChangeSize"><span> x {{exportSize[1]}}px</span>
                        </p>
                        <p>
                            <input type="checkbox" v-model="isTransparent">
                            <span>Transparent</span>
                        </p>
                        <p class="export-btn-wrap">
                            <button class="export-btn" @click="exportLayer" v-show="!isTransparent">jpg</button>
                            <button class="export-btn" @click="exportLayer" :class="{'btn_full-width': isTransparent}">png</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `,
  data: function() {
    return {
      layers: [],
      cover_object: [],
      scenestore: '',
      changebleDevice: ``,
      isAdjShow: false,
      isDeviceShow: false,
      isMaterialsShow: false,
      isShadowShow: false,
      isDevAdjShow: false,
      isDevColorShow: false,
      isBgShow:false,
      isExportShow:false,
      min: -1,
      max: 1,
      step: 0.1,
      adjRanges: [
        {
          value: [0, 0],
          icon: '/images/icons/exposure.svg'
        },
        {
          value: [0, 0],
          icon: '/images/icons/saturation.svg'
        },
        {
          value: [0, 0],
          icon: '/images/icons/contrast.svg'
        },
        {
          value: [0, 0],
          icon: '/images/icons/brightness.svg'
        }
      ],
      adjDeviceRanges: [],
      devices: [],
      blendingItems: [
          { value: 'NORMAL', label: 'Normal' },
          { value: 'MULTIPLY', label: 'Multiply' },
          { value: 'COLOR_BURN', label: 'Color burn' },
          { value: 'OVERLAY', label: 'Overlay' },
          ],
      blending: null,
      opacity: 1,
      deviceDialog: false,
      devColor: [],
      calcDevColor: [],
      bgColor: '#fff',
      gradientType: 'flat',
      radDegree: 130,
      rad: 130,
      // predefineColors: [
      //   '#e50000',
      //   '#ffa200',
      //   '#fce600',
      //   '#94531d',
      //   '#58d700',
      //   '#297700',
      //   '#cf00e8',
      //   '#2490e9',
      //   '#00e7c1',
      //   '#a9ec77',
      //   '#1a1a1a',
      //   '#4a4a4a',
      //   '#9b9b9b',
      //   '#ffffff'
      // ],
      sketch: null,
      colorgradient:{
            rgba: {
                'a': 1,
                'b': 255,
                'g': 255,
                'r': 255
            },
      },
      exportSize: [0,0],
      proportion: 1,
      isTransparent: false,
      activeBlocks: 0
    };
  },
  created(){
    Vue.component('colorpicker', VueColor.Sketch);
    Vue.component('rad-slider', radslider);
  },
  mounted: function() {

    var _this = this;
    axios
      .post('/api/scenes/' + this.$route.params.id)
      .then(function(response) {
        store.commit('loaddata', response.data);
        // Генерация события - загрузка данных
        _this.$emit('eventname', true);
      })
      .then(() => {
        this.scenestore = store.state.scenestore;
        this.cover_object = vm.cover_object;
        let devicesData = this.scenestore.s_layers[0].l_data;
          this.layers = this.scenestore.s_layers;
        console.log(vm.layers);
        this.exportSize = vm.size;
        this.proportion = this.exportSize[1]/this.exportSize[0];

          for (layersindex = 0; layersindex < vm.scenestore.s_mcount; layersindex++) {
              this.devColor[layersindex] = '#ff5000'
              this.calcDevColor[layersindex] = '#ff5000'

              this.adjDeviceRanges[layersindex] = [
                  {
                      value: [0, 0],
                      icon: '/images/icons/exposure.svg'
                  },
                  {
                      value: [0, 0],
                      icon: '/images/icons/saturation.svg'
                  },
                  {
                      value: [0, 0],
                      icon: '/images/icons/contrast.svg'
                  },
                  {
                      value: [0, 0],
                      icon: '/images/icons/brightness.svg'
                  }
              ]
          }

        for (let i = 0; i < devicesData.length; i++) {
            this.devices.push(devicesData[i])
          if(devicesData[i].i_img_title == `White Clay`){
                this.changebleDevice = devicesData[i]
          }
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
        async exportLayer(){
          await vm.preloadHiresStaticScene()
            vm.compositeStaticLayer()
        },
        changeShadowBlending(blendValue){
            vm.changeShadowBlending(blendValue)
        },
        activeChangeableDevice(index){
            console.log(index)
            vm.activeChangeableDevice[index] = true

            for(var i = 0; i < vm.scenestore.s_layers[index].l_data.length; i++) {
                if(vm.scenestore.s_layers[index].l_data[i].i_img_title == "White Clay") {
                    vm.changeDevice(vm.scenestore.s_layers[index].l_data[i], index)
                }
            }
        },
        changeDeviceColor(index) {
            this.calcDevColor[index] = this.devColor[index].hex;
            vm.activeChangeableDevice[index] = true
            let color = this.calcDevColor[index].substring(1);
            console.log('color - ',color)
            vm.changeableDeviceColor[index] = "0x"+ color
            // this.devColor = '#' + this.rgbToHex(color)
        },
        showUploadWindow(index){
            vm.openUploader(index)
            this.onDeviceDialogShow()
        },
        changeShadowOpacity(){
            vm.shadow_opacity = this.opacity
        },
        deviceHandler(item, index){
            vm.activeChangeableDevice[index] = false
            vm.changeDevice(item, index)
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
                //this.hideAdjBarBtn();
            }
        },
        showExport(){
            this.isExportShow = !this.isExportShow;
        },
        hideAdjBarBtn(){
            let elements = document.querySelectorAll('.adj-dropdown .el-slider__runway');
            let bars = Array.prototype.slice.call( elements );
            /*console.log('in -', bars);*/
            //console.log(`===================================`)
            bars.forEach(item => {
                //console.log(`width`,parseInt(item.childNodes[0].style.width));
                //console.log(`left`,parseInt(item.childNodes[0].style.left));

                if(parseInt(item.childNodes[0].style.left) == 50 && parseInt(item.childNodes[0].style.width) == 0){
                    console.log('yes')
                    item.querySelectorAll('.el-slider__button-wrapper')[0].style.display = 'inline-block';
                    item.querySelectorAll('.el-slider__button-wrapper')[1].style.display = 'none';
                }

                if(parseInt(item.childNodes[0].style.left) == 50 && parseInt(item.childNodes[0].style.width) != 0){
                    console.log('yes')
                    item.querySelectorAll('.el-slider__button-wrapper')[0].style.display = 'none';
                    item.querySelectorAll('.el-slider__button-wrapper')[1].style.display = 'inline-block';
                }
                if(parseInt(item.childNodes[0].style.left) != 50 && parseInt(item.childNodes[0].style.width) != 0 && item.querySelectorAll('.el-slider__button-wrapper')[1].style.display != 'none') {
                    item.querySelectorAll('.el-slider__button-wrapper')[0].style.display = 'none';
                    item.querySelectorAll('.el-slider__button-wrapper')[1].style.display = 'inline-block';
                }

                if(parseInt(item.childNodes[0].style.left) == 50 && parseInt(item.childNodes[0].style.width) != 0 && item.querySelectorAll('.el-slider__button-wrapper')[0].style.display != 'none') {
                    item.querySelectorAll('.el-slider__button-wrapper')[1].style.display = 'none';
                    item.querySelectorAll('.el-slider__button-wrapper')[0].style.display = 'inline-block';
                }

                if(parseInt(item.childNodes[0].style.left) != 50 && parseInt(item.childNodes[0].style.width) == 0) {
                    item.querySelectorAll('.el-slider__button-wrapper')[0].style.display = 'none';
                    item.querySelectorAll('.el-slider__button-wrapper')[1].style.display = 'inline-block';
                }
            })
        },
        colorAdjBar(id, item) {
            this.AdjustmentsEffectScene(id, item)
            // this.hideAdjBarBtn();
            let bar = document.getElementsByClassName("adj-bar")[id].querySelector('.el-slider__bar');
            if(item.value[0] < 0){
                bar.style.backgroundColor = '#f97050';
            }else{
                bar.style.backgroundColor = '#ffe100';
            }
        },
        colorAdjDeviceBar(id, item, index) {
            console.log(id, item, index)
            this.AdjustmentsEffectDevice(id, item, index)
            // this.hideAdjBarBtn();
            let bar = document.getElementsByClassName("adj-device-bar")[id].querySelector('.el-slider__bar');
            if(item.value[0] < 0){
                bar.style.backgroundColor = '#f97050';
            }else{
                bar.style.backgroundColor = '#ffe100';
            }
        },
        AdjustmentsEffectScene(id, item) {
            switch (id) {
                case 0:
                    if(item.value[0] < 0) {
                        vm.effectgamma= item.value[0]
                    }
                    if(item.value[1] > 0)vm.effectgamma= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.effectgamma= item.value[1]
                    break;
                case 1:
                    if(item.value[0] < 0) {
                        vm.effectcontrast= item.value[0]
                    }
                    if(item.value[1] > 0)vm.effectcontrast= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.effectcontrast= item.value[1]
                    break;
                case 2:
                    if(item.value[0] < 0) {
                        vm.effectbrightness= item.value[0]
                    }
                    if(item.value[1] > 0)vm.effectbrightness= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.effectbrightness= item.value[1]
                    break;
                case 3:
                    if(item.value[0] < 0) {
                        vm.effectsaturation= item.value[0]
                    }
                    if(item.value[1] > 0)vm.effectsaturation= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.effectsaturation= item.value[1]
                    break;
                default:
                    return
            }
        },
        AdjustmentsEffectDevice(id, item, index) {
            switch (id) {
                case 0:
                    if(item.value[0] < 0) {
                        vm.devicesFilters[index].effectgamma= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters[index].effectgamma= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters[index].effectgamma= item.value[1]
                    break;
                case 1:
                    if(item.value[0] < 0) {
                        vm.devicesFilters[index].effectcontrast= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters[index].effectcontrast= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters[index].effectcontrast= item.value[1]
                    break;
                case 2:
                    if(item.value[0] < 0) {
                        vm.devicesFilters[index].effectbrightness= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters[index].effectbrightness= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters[index].effectbrightness= item.value[1]
                    break;
                case 3:
                    if(item.value[0] < 0) {
                        vm.devicesFilters[index].effectsaturation= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters[index].effectsaturation= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters[index].effectsaturation= item.value[1]
                    break;
                default:
                    break
            }
        },
        showBgPicker(){
            this.isBgShow = !this.isBgShow;
        },
        changeGradientPicker(){
            console.log('choose color')
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
        },
        onDeviceDialogShow(){
            vm.staticDeviceDialog = true;
        },
        onChangeSize(){
            this.exportSize[1] = Math.round(this.exportSize[0]*this.proportion);
        },
        changeBgColor(){
          console.log(this.bgColor.hex)
        },
        rotate(name, degree){
          console.log(degree);
          this.radDegree = degree;
        },
      changeGradientType(){
          console.log('gradient - ', this.gradientType)
      }
    },

    beforeDestroy() {
        store.commit('loaddata', []);
        //window.removeEventListener('resize', this.getWindowWidth);
        //window.removeEventListener('resize', this.getWindowHeight);
        _this.$emit('endsession', true)
    }
};