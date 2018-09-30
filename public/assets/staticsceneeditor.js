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
                            <div v-for="(range, index) in adjRanges" :key="index" class="block adj-bar" >
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
                        <span class="adj-text">{{scenestore.s_name}}</span>
                        <i class="el-icon-caret-right el-icon--right adj-arrow" v-if="!isDeviceShow"></i>
                        <i class="el-icon-caret-bottom el-icon--right adj-arrow" v-else></i>
                    </div>
                    <template v-if="isDeviceShow">
                         <span v-for="(layer, index) in layers" :key="layer.id">
                            <div v-if="layer.controller == 'mockup'">
		                     <div class="device"  @click="showUploadWindow(layer.id)">
                                 <div class="arrow-icon"></div>
                                    <div class="device-upload button-mockup"  :style="{ 'background-image' : 'url(' + cover_object[layer.id].texture.baseTexture.imageUrl + ')' }">
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
                                    <div class="material-list__item" @click="calcDevWidjetHeight">
                                        <div class="color-icon color"></div>
                                        <span @click="activeChangeableDevice">Changeable</span>
                                         <el-color-picker v-model="devColor" @active-change="changeDeviceColor"  :predefine="predefineColors">
                                         </el-color-picker>
                                        <!--<div class="color-btn-wrap">-->
                                            <!--<div class="color-btn" @click="isDevColorShow = !isDevColorShow"></div>-->
                                        <!--</div>-->
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
                                        <div v-for="(range, index) in adjDeviceRanges" :key="index" class="block adj-device-bar adj-bar" >
                                            <div class="adj-bar__icon">
                                                <img :src="range.icon">
                                            </div>
                                            <el-slider v-model="range.value" range="" :min="min" :max="max" :step="step" @input="colorAdjDeviceBar(index, range)"></el-slider>
                                        </div>
                                      </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </div>

                <!--<div class="device-color-wrap" v-show="isDevColorShow">-->
                   <!---->
                <!--</div>-->
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
        adjDeviceRanges: [
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
      devColor: '#ff5000',
      predefineColors: [
        '#e50000',
        '#ffa200',
        '#fce600',
        '#94531d',
        '#58d700',
        '#297700',
        '#cf00e8',
        '#2490e9',
        '#00e7c1',
        '#a9ec77',
        '#1a1a1a',
        '#4a4a4a',
        '#9b9b9b',
        '#ffffff'
        // '#ff3900'
      ]
    };
  },
  mounted: function() {
    var _this = this;
    axios
      .post('/api/scenes/' + this.$route.params.id)
      .then(function(response) {
        store.commit('loaddata', response.data);
        console.log(response.data);
        // Генерация события - загрузка данных
        _this.$emit('eventname', true);
      })
      .then(() => {
        this.scenestore = store.state.scenestore;
        this.cover_object = vm.cover_object;
        let devicesData = this.scenestore.s_layers[0].l_data;
        this.layers = vm.layers;
        console.log(vm.layers);
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
        changeShadowBlending(blendValue){
            vm.changeShadowBlending(blendValue)
        },
        activeChangeableDevice(){
            console.log(vm.activeChangeableDevice)
            vm.activeChangeableDevice = true
            console.log(vm.activeChangeableDevice)
        },
        changeDeviceColor(color) {
            vm.activeChangeableDevice = true
          /*console.log(this.rgbToHex(color))*/
            vm.changeableDeviceColor = "0x"+ this.rgbToHex(color)
            this.devColor = '#' + this.rgbToHex(color)
        },
        rgbToHex(color) {
            color = ""+ color;
            if (!color || color.indexOf("rgb") < 0) {
                return;
            }

            if (color.charAt(0) == "#") {
                return color;
            }
            var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
                r = parseInt(nums[2], 10).toString(16),
                g = parseInt(nums[3], 10).toString(16),
                b = parseInt(nums[4], 10).toString(16);

            return (
                (r.length == 1 ? "0"+ r : r) +
                (g.length == 1 ? "0"+ g : g) +
                (b.length == 1 ? "0"+ b : b)
            );
        },
        showUploadWindow(index){
            vm.openUploader(index)
            this.onDeviceDialogShow()
        },
        changeShadowOpacity(){
            vm.shadow_opacity = this.opacity
        },
        deviceHandler(item){
            vm.activeChangeableDevice = false
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
                //this.hideAdjBarBtn();
            }
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
        colorAdjDeviceBar(id, item) {
            this.AdjustmentsEffectDevice(id, item)
            // this.hideAdjBarBtn();
            let bar = document.getElementsByClassName("adj-device-bar")[id].querySelector('.el-slider__bar');
            if(item.value[0] < 0){
                bar.style.backgroundColor = '#f97050';
            }else{
                bar.style.backgroundColor = '#ffe100';
            }
        },
        AdjustmentsEffectScene(id, item) {
            console.log(vm.effectgamma)
            console.log(vm.effectcontrast)
            console.log(vm.effectbrightness)
            console.log( vm.effectsaturation)
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
        AdjustmentsEffectDevice(id, item) {
            switch (id) {
                case 0:
                    if(item.value[0] < 0) {
                        vm.devicesFilters.effectgamma= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters.effectgamma+= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters.effectgamma= item.value[1]
                    break;
                case 1:
                    if(item.value[0] < 0) {
                        vm.devicesFilters.effectcontrast= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters.effectcontrast= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters.effectcontrast= item.value[1]
                    break;
                case 2:
                    if(item.value[0] < 0) {
                        vm.devicesFilters.effectbrightness= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters.effectbrightness= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters.effectbrightness= item.value[1]
                    break;
                case 3:
                    if(item.value[0] < 0) {
                        vm.devicesFilters.effectsaturation= item.value[0]
                    }
                    if(item.value[1] > 0)vm.devicesFilters.effectsaturation= item.value[1]
                    if(item.value[1] == 0 && item.value[0] == 0)vm.devicesFilters.effectsaturation= item.value[1]
                    break;
                default:
                    return
            }
        },
        calcDevWidjetHeight() {
            this.deviceHandler(this.changebleDevice)
            this.activeChangeableDevice()
            // customize color picker display
            let devWidjet = document.querySelector('.device-wrap');
            let colorPicker = document.querySelectorAll(
                '.el-color-dropdown.el-color-picker__panel'
            )[0];
            let devHeight = devWidjet.offsetHeight;

            colorPicker.style.marginTop = `55px`;
            colorPicker.style.width = `198px`;
            colorPicker.style.marginRight = `17px`;
            colorPicker.style.borderRadius = `6px`;
            colorPicker.style.boxShadow = `-6px 6px 10px rgba(84, 104, 115, 0.12)`;
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
    },

    beforeDestroy() {
        store.commit('loaddata', []);
        //window.removeEventListener('resize', this.getWindowWidth);
        //window.removeEventListener('resize', this.getWindowHeight);
        _this.$emit('endsession', true)
    }
};