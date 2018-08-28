const SceneEditor = {
	template: `<el-container class="workspace" id="workspace">
	<canvas id="canvas" class="el-workspace-background"></canvas>
	<el-row class="tooltip-zoner" v-if="showtooltips">
	<el-col :span="12" style="height:20%"></el-col>
	<el-col :span="12" style="height:200px">
	<el-dialog width="620px" top="5vh" title="" :visible.sync="tooltips[1]" :show-close = "false">
		 <el-row>
      <el-col :span="16" class="got-it-content"><h4 class="yellow-text">Export</h4><p class="white-text">Download current frame or MP4 animation</p></el-col>
			<el-col :span="8" class="got-it-button"><el-button @click="nextTooltip" class="yellow-bg black-text">Got it</el-button></el-col>
			</el-row>
  </el-dialog>
	</el-col>
	<el-col :span="24" style="height:40%">
	<el-dialog width="620px"  title="" :visible.sync="tooltips[0]" :show-close = "false">
		 <el-row>
      <el-col :span="16" class="got-it-content"><h4 class="yellow-text">Mockup layer</h4><p class="white-text">Upload you design here</p></el-col>
			<el-col :span="8" class="got-it-button"><el-button @click="nextTooltip" class="yellow-bg black-text">Got it</el-button></el-col>
			</el-row>
  </el-dialog>
	</el-col>
	<el-col :span="12" style="height:20%"></el-col>
	<el-col :span="12" style="height:200px">
	<el-dialog width="620px" top="5vh" title="" :visible.sync="tooltips[2]" :show-close = "false">
		 <el-row>
      <el-col :span="16" class="got-it-content"><h4 class="yellow-text">Ajustment layer</h4><p class="white-text">Enjoy filters</p></el-col>
			<el-col :span="8" class="got-it-button"><el-button @click="nextTooltip" class="yellow-bg black-text">Got it</el-button></el-col>
			</el-row>
  </el-dialog>
	</el-col>
	<el-col :span="12" style="height:200px"></el-col>
	<el-col :span="12" style="height:200px">
	<el-dialog width="620px" top="5vh" title="" :visible.sync="tooltips[3]" :show-close = "false">
		 <el-row>
      <el-col :span="16" class="got-it-content"><h4 class="yellow-text">Fill layer</h4><p class="white-text">Change fill color or make it transparent</p></el-col>
			<el-col :span="8" class="got-it-button"><el-button @click="nextTooltip" class="yellow-bg black-text">Got it</el-button></el-col>
			</el-row>
  </el-dialog>
	</el-col>
	</el-row>
	</el-container>`,
	data: function() {
		return {
			app: '',
			showtooltips: false, // вкл\выкл показа подсказок
			tooltips: [true, false, false, false],
		}
	},
	mounted: function() {
		var _this = this;
		axios.post('/api/scenes/' + this.$route.params.id).then(function(response) {
			store.commit('loaddata', response.data);
			console.log(response.data);
			// Генерация события - загрузка данных
			_this.$emit('eventname', true)
		}).catch(function(error) {
			console.log(error);
		});
		this.$nextTick(function() {
			window.addEventListener('resize', this.getWindowWidth);
			window.addEventListener('resize', this.getWindowHeight);
			this.getWindowWidth()
			this.getWindowHeight();
		})
		console.log(vm.coversequence);
	},
	methods: {
		// Переключалка между подсказками
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
	},
	beforeDestroy() {
	  store.commit('loaddata', []);
		//window.removeEventListener('resize', this.getWindowWidth);
		//window.removeEventListener('resize', this.getWindowHeight);
		_this.$emit('endsession', true)
	}
}