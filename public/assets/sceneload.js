const SceneLoad = {
	template: `    
<el-container v-loading.fullscreen.lock="fullscreenLoading">
  <el-dialog :visible.sync="centerDialogVisible" width="100%" fullscreen top="0px" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false" class="blackwindow">
    <el-container :style="browser.cssheight" >
      <el-aside class="leftsidebar" width="336px">
        <div class="_wf-left-panel">
          <img src="images/Logo.svg" class="_wf-image">
          <h1 class="_wf-heading">
            <strong>Free animated 
            </strong>
            <br>
            <strong>and static mockups 
            </strong>
            <br>
            <strong>for your presentations
            </strong>
            <br>
            <br>
            <br>
          </h1>
          <div class="_wf-menu w-clearfix">
            <div class="_wf-icon">
              <img src="images/lighting.svg" class="_wf-image-2">
            </div>
            <a href="#" class="_wf-link-2">Presentation
              <br>
            </a>
          </div>
          <div class="_wf-menu w-clearfix">
            <div class="_wf-icon">
              <img src="images/AE.svg" class="_wf-image-2">
            </div>
            <a href="#" class="_wf-link-2">After Effects Version
              <br>
            </a>
          </div>
          <div class="_wf-menu w-clearfix">
            <div class="_wf-icon">
              <img src="images/our-logo.svg" class="_wf-image-2">
            </div>
            <a href="#" class="_wf-link-2">More Design Tools
              <br>
            </a>
          </div>
          <a href="#" class="_wf-subscribe-yellow w-button">Subscribe
          </a>
          <div class="_wf-text-block-3">Follow us:
            <br>
          </div>
          <div class="_wf-follow-us">
            <img src="images/dr.svg" class="_wf-follow-icon">
            <img src="images/be.svg" class="_wf-follow-icon">
            <img src="images/tw.svg" class="_wf-follow-icon">
            <img src="images/fb.svg" class="_wf-follow-icon">
          </div>
        </div>
      </el-aside>
      <el-main style="width:100%;padding-top:36px;">
        <!-- 304x314 -->
        <waterfall :line-gap="270" :min-line-gap="270" :max-line-gap="400" :watch="scenedlist" align="center">
          <waterfall-slot v-for="(scene, index) in scenedlist" :width="scene.s_uri_preiew_width" :height="scene.s_uri_preiew_height" :order="index" :key="scene.s_id">
            <span v-if="scene.s_name == '--subscribe--'">
              <div class="_wf-preview-subscribe" v-if="index % 4">
                <h2 class="_wf-heading-4">
                  <strong>More Mockups 
                    <br>will be added 
                    <br>soon
                  </strong>
                  <br>
                </h2>
                <a href="#" class="_wf-subscribe-red w-button">Subscribe to not miss
                </a>
              </div>
            </span>
            <span v-else>
              <div class="_wf-preview">
                <el-button type="text" @click="openscene(scene.s_id)" @mouseover.native.prevent="startsequence(index)" @mouseleave.native.prevent="stopsequence(index)">
                  <img :src="scene.s_uri_poster" class="imageres _wf-image">
                </el-button>              
                <el-button type="text" @click="openscene(scene.s_id)">
                  <div class="_wf-description">
                    <h1 class="_wf-heading-3">
                      <strong>{{scene.s_name}}
                      </strong>
                      <br>
                    </h1>
                    <div class="_wf-tag w-clearfix">
                      <img src="images/Animated.svg" class="_wf-icon-tag">
                      <div class="_wf-tag-text">Animated
                        <br>
                      </div>
                    </div>
                    <div class="_wf-tag w-clearfix" v-if="scene.s_looped">
                      <img src="images/Looped.svg" class="_wf-icon-tag">
                      <div class="_wf-tag-text">Looped
                        <br>
                      </div>
                    </div>
                  </div>
                </el-button>    
              </div>
            </span>
          </waterfall-slot>
        </waterfall>
      </el-main>
      <el-footer slot="footer">Some ads text
      </el-footer>
    </el-container>
  </el-dialog>
</el-container>
    `,
	components: {
		'waterfall': Waterfall.waterfall,
		'waterfall-slot': Waterfall.waterfallSlot,
	},
	data: function() {
		return {
			centerDialogVisible: true,
			sequenceplay: false,
			scenedlist: [],
			fullscreenLoading: true,
			browser: {
				width: 0,
				height: 0,
				csswidth: 0,
				cssheight: 0
			}
		}
	},
	mounted: function() {
		this.browser.height = "innerHeight" in window ?
			window.innerHeight :
			document.documentElement.offsetHeight;
		this.browser.width = "innerWidth" in window ?
			window.innerWidth :
			document.documentElement.offsetWidth;
		this.browser.cssheight = 'height:' + (this.browser.height) + 'px;'
		this.browser.csswidth = 'width:' + (this.browser.width) + 'px;'
		var _this = this;
		axios.post('/api/sceneslist/').then(function(response) {
			_this.scenedlist = response.data;
			/*
			var previews = [];
			for (var i = 0; i < _this.scenedlist.length; i++) {
			previews[i] = new Image();
			previews[i].src = _this.scenedlist[i].s_uri_preview[0];
			}
			 */
			_this.fullscreenLoading = false
		}).catch(function(error) {
			console.log(error);
		});
	},
	methods: {
		// Старт проигрывания сиквенса из картинок в превью
		startsequence: function(id) {
			this.sequenceplay = id;
			var images = [];
			for (var i = 0; i < this.scenedlist[id].s_uri_preview.length; i++) {
				images[i] = new Image();
				images[i].src = this.scenedlist[id].s_uri_preview[i];
			}
			var _this = this;
			var _pos = 0;
			if (id !== false && this.sequenceplay !== false) var uset = setInterval(function() {
				if (id !== false) {
					_this.scenedlist[id].s_uri_poster = images[_pos++].src;
					if (_pos > images.length - 1) _pos = 0;
				}
				if (id !== _this.sequenceplay) clearInterval(uset);
			}, 40);
		},
		// Остановка проигрывания превью
		stopsequence: function(id) {
			this.sequenceplay = false;
		},
		// Открытие сцены
		openscene: function(id) {
			this.$router.push('/edit/' + id)
		}
	},

	beforeDestroy() {
		this.sequenceplay = false;
	}
}