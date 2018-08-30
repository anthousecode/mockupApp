var radslider = {
		template: `
    <div 
        class="rad-slider"
        :name="name"
        :class="{moving: moving, dirty: dirty}" 
        @mousedown="start" 
        @mousemove="move" 
        @mouseup="stop"
        @touchstart="start" 
        @touchmove="move" 
        @touchend="stop"
        >
      <div class="label">{{procdegree}}&deg;</div>
    </div>
  `,
		props: {
			name: {
				type: String,
				required: true
			},
			degree: {
				type: Number,
				default: 0
			}
		},
		data: function() {
			return {
				procdegree: -1,
				minDegree: 0,
				maxDegree: 360,
				moving: false,
				dirty: false
			}
		},
		mounted: function() {
			if (this.procdegree == -1) this.processDegree(this.degree)
		},
		beforeUpdate: function() {
			if (this.procdegree == -1) this.processDegree(this.degree)
		},
		methods: {
			keepValueInRange: function(value, min, max) {
				let newValue = (value >= max ? value - max : (value < min ? value + max : value))
				return newValue
			},
			processDegree: function(value) {
				this.procdegree = this.keepValueInRange(value, this.minDegree, this.maxDegree)
				this.$el.style.setProperty('--degree', this.procdegree + 'deg')
				this.$emit('rotate', this.name, this.procdegree)
			},
			getPointerDeg: function(e) {
				let x = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX
				let y = e.touches && e.touches.length ? e.touches[0].clientY : e.clientY
				return Math.floor(Math.atan2(x - (this.metrics.left + this.metrics.width / 2), y - (this.metrics.top + this.metrics.height / 2)) * (-180 / Math.PI)) + 180
			},
			start: function(e) {
				this.moving = true
				this.dirty = true
				this.metrics = e.target.getBoundingClientRect()
				this.pointer = this.getPointerDeg(e) - this.procdegree
			},
			move: function(e) {
				if (this.moving) {
					let step = 1
					let input = this.getPointerDeg(e)
					if (e.shiftKey && e.metaKey) {
						step = 45
					} else if (e.shiftKey) {
						step = 15
					} else if (e.metaKey) {
						step = 30
					}
					this.procdegree = Math.ceil((this.getPointerDeg(e) - this.pointer) / step) * step
					this.processDegree(this.procdegree)
				}
			},
			stop: function(e) {
				this.moving = false
			}
		}
	}