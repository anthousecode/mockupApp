var helpersTools = {
	data: {
		vertexcontrol: [],
		cpoint_left: [],
		cpoint_right: [],
		cpoint_center: [],
		lastEdgeHelper: -1,
		onPointDown: false,
		pointType: 0,
		pointIndex: 0,
		initX: 0,
		initY: 0,
		initCX: 0,
		initCY: 0,
		initCPX: 0,
		initCPY: 0
	},
	methods: {
		curveRedraw(pixiObjectIndex) {
			vm.layers[pixiObjectIndex].globject.clear();
			vm.layers[pixiObjectIndex].globject.beginFill(0xCCFFFF);
			vm.layers[pixiObjectIndex].globject.lineStyle(1, 0x000000);
			for (var i = 0; i < vm.layers[pixiObjectIndex].curvePath.length; i++) {
				if (i == 0) {
					vm.layers[pixiObjectIndex].globject.moveTo(vm.layers[pixiObjectIndex].curvePath[0].x, vm.layers[pixiObjectIndex].curvePath[0].y);
				} else {
					vm.layers[pixiObjectIndex].globject.bezierCurveTo(
						vm.layers[pixiObjectIndex].curvePath[i].cx, vm.layers[pixiObjectIndex].curvePath[i].cy,
						vm.layers[pixiObjectIndex].curvePath[i].cpx, vm.layers[pixiObjectIndex].curvePath[i].cpy,
						vm.layers[pixiObjectIndex].curvePath[i].x, vm.layers[pixiObjectIndex].curvePath[i].y
					);
				}
			}
			vm.layers[pixiObjectIndex].globject.closePath();
			vm.layers[pixiObjectIndex].globject.endFill();
		},
		edgeHelper(pixiObjectIndex, state = true, actions = false) {
			if (pixiObjectIndex > -1) {
				vm.lastEdgeHelper = pixiObjectIndex;
				var pixiObject = vm.layers[pixiObjectIndex];
				for (var i = 1; i < pixiObject.curvePath.length; i++) {
					if (typeof(vm.cpoint_left[i]) === 'undefined') {
						vm.cpoint_left[i] = new PIXI.Graphics();
					} else vm.cpoint_left[i].clear();
					if (typeof(vm.cpoint_right[i]) === 'undefined') {
						vm.cpoint_right[i] = new PIXI.Graphics();
					} else vm.cpoint_right[i].clear();
					if (typeof(vm.cpoint_center[i]) === 'undefined') {
						vm.cpoint_center[i] = new PIXI.Graphics();
					} else vm.cpoint_center[i].clear();
					if (typeof(vm.vertexcontrol[i]) === 'undefined') {
						vm.vertexcontrol[i] = new PIXI.Graphics();
					} else vm.vertexcontrol[i].clear();
					if (state === true) {
						vm.cpoint_right[i].beginFill(0x00FF00);
						vm.cpoint_right[i].lineStyle(1, 0x00FF00);
						vm.cpoint_right[i].drawCircle(0, 0, 3)
						vm.cpoint_right[i].position.set(pixiObject.curvePath[i].cx, pixiObject.curvePath[i].cy)
						vm.cpoint_right[i].endFill();
						vm.cpoint_left[i].beginFill(0x00FF00);
						vm.cpoint_left[i].lineStyle(1, 0x00FF00);
						vm.cpoint_left[i].drawCircle(0, 0, 3)
						vm.cpoint_left[i].position.set(pixiObject.curvePath[i].cpx, pixiObject.curvePath[i].cpy)
						vm.cpoint_left[i].endFill();
						vm.cpoint_center[i].beginFill(0x00FF00);
						vm.cpoint_center[i].lineStyle(1, 0x000000);
						vm.cpoint_center[i].drawCircle(0, 0, 4)
						vm.cpoint_center[i].position.set(pixiObject.curvePath[i].x, pixiObject.curvePath[i].y)
						vm.cpoint_center[i].endFill();
						vm.vertexcontrol[i].moveTo(pixiObject.curvePath[i - 1].x, pixiObject.curvePath[i - 1].y);
						vm.vertexcontrol[i].lineStyle(1, 0x00FF00);
						vm.vertexcontrol[i].lineTo(pixiObject.curvePath[i].cx, pixiObject.curvePath[i].cy);
						vm.vertexcontrol[i].moveTo(pixiObject.curvePath[i].x, pixiObject.curvePath[i].y);
						vm.vertexcontrol[i].lineStyle(1, 0x00FF00);
						vm.vertexcontrol[i].lineTo(pixiObject.curvePath[i].cpx, pixiObject.curvePath[i].cpy);
						if (actions === true) {
							vm.cpoint_left[i].interactive = true;
							vm.cpoint_left[i]
								.on('mousedown', onMouseDown)
								.on('mouseup', onMouseUp)
								.on('mousemove', onMouseMove)
							vm.cpoint_right[i].interactive = true;
							vm.cpoint_right[i]
								.on('mousedown', onMouseDown)
								.on('mouseup', onMouseUp)
								.on('mousemove', onMouseMove)
							vm.cpoint_center[i].interactive = true;
							vm.cpoint_center[i]
								.on('mousedown', onMouseDown)
								.on('mouseup', onMouseUp)
								.on('mousemove', onMouseMove)
						} else {
							if (state === false) {
								vm.cpoint_left[i].interactive = false;
								vm.cpoint_right[i].interactive = false;
								vm.cpoint_center[i].interactive = false;
							}
						}
					}
					vm.renderer_client.stage.addChild(vm.cpoint_left[i]);
					vm.renderer_client.stage.addChild(vm.cpoint_right[i]);
					vm.renderer_client.stage.addChild(vm.cpoint_center[i]);
					vm.renderer_client.stage.addChild(vm.vertexcontrol[i]);
				}

				function onMouseDown(event) {
					var mpos = event.data.getLocalPosition(this.parent)
					vm.onPointDown = true;
					for (var i = 0; i < vm.layers[pixiObjectIndex].curvePath.length; i++) {
						var nextPoint = (i + 1 >= vm.layers[pixiObjectIndex].curvePath.length) ? 1 : i + 1
						if (vm.layers[pixiObjectIndex].curvePath[i].x == this.x &&
							vm.layers[pixiObjectIndex].curvePath[i].y == this.y) {
							vm.pointType = 0;
							vm.pointIndex = i;
							vm.initX = vm.layers[pixiObjectIndex].curvePath[i].x
							vm.initY = vm.layers[pixiObjectIndex].curvePath[i].y
							vm.initCX = vm.layers[pixiObjectIndex].curvePath[nextPoint].cx
							vm.initCY = vm.layers[pixiObjectIndex].curvePath[nextPoint].cy
							vm.initCPX = vm.layers[pixiObjectIndex].curvePath[i].cpx
							vm.initCPY = vm.layers[pixiObjectIndex].curvePath[i].cpy
						}
						if (vm.layers[pixiObjectIndex].curvePath[i].cx == this.x &&
							vm.layers[pixiObjectIndex].curvePath[i].cy == this.y) {
							vm.pointType = 1;
							vm.pointIndex = i;
							vm.initX = vm.layers[pixiObjectIndex].curvePath[i].x
							vm.initY = vm.layers[pixiObjectIndex].curvePath[i].y
							vm.initCX = vm.layers[pixiObjectIndex].curvePath[nextPoint].cx
							vm.initCY = vm.layers[pixiObjectIndex].curvePath[nextPoint].cy
							vm.initCPX = vm.layers[pixiObjectIndex].curvePath[i].cpx
							vm.initCPY = vm.layers[pixiObjectIndex].curvePath[i].cpy
						}
						if (vm.layers[pixiObjectIndex].curvePath[i].cpx == this.x &&
							vm.layers[pixiObjectIndex].curvePath[i].cpy == this.y) {
							vm.pointType = 2;
							vm.pointIndex = i;
							vm.initX = vm.layers[pixiObjectIndex].curvePath[i].x
							vm.initY = vm.layers[pixiObjectIndex].curvePath[i].y
							vm.initCX = vm.layers[pixiObjectIndex].curvePath[nextPoint].cx
							vm.initCY = vm.layers[pixiObjectIndex].curvePath[nextPoint].cy
							vm.initCPX = vm.layers[pixiObjectIndex].curvePath[i].cpx
							vm.initCPY = vm.layers[pixiObjectIndex].curvePath[i].cpy
						}
					}
				}

				function onMouseUp(event) {
					var mpos = event.data.getLocalPosition(this.parent)
					vm.onPointDown = false;
				}

				function onMouseMove(event) {
					var mpos = event.data.getLocalPosition(this.parent)
					if (vm.onPointDown == true) {
						this.x = mpos.x
						this.y = mpos.y
							//if center point moving
						if (vm.pointType == 0) {
							var nextPoint = (vm.pointIndex + 1 >= vm.layers[pixiObjectIndex].curvePath.length) ? 1 : vm.pointIndex + 1
							var deltaX = mpos.x - vm.initX
							var deltaY = mpos.y - vm.initY
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].x = vm.initX + deltaX
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].y = vm.initY + deltaY
							vm.layers[pixiObjectIndex].curvePath[nextPoint].cx = vm.initCX + deltaX
							vm.layers[pixiObjectIndex].curvePath[nextPoint].cy = vm.initCY + deltaY
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].cpx = vm.initCPX + deltaX
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].cpy = vm.initCPY + deltaY
							if (vm.pointIndex == vm.layers[pixiObjectIndex].curvePath.length - 1) {
								vm.layers[pixiObjectIndex].curvePath[0].x = vm.initX + deltaX
								vm.layers[pixiObjectIndex].curvePath[0].y = vm.initY + deltaY
							}
						}
						//if CX\CY (right) point moving
						if (vm.pointType == 1) {
							var deltaCX = mpos.x - vm.initCX
							var deltaCY = mpos.y - vm.initCY
							var prevPoint = (vm.pointIndex - 1 < 1) ? vm.layers[pixiObjectIndex].curvePath.length - 1 : vm.pointIndex - 1
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].cx = vm.initCX + deltaCX
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].cy = vm.initCY + deltaCY
							var deltaCCX = mpos.x - vm.layers[pixiObjectIndex].curvePath[prevPoint].x
							var deltaCCY = mpos.y - vm.layers[pixiObjectIndex].curvePath[prevPoint].y
							vm.layers[pixiObjectIndex].curvePath[prevPoint].cpx = vm.layers[pixiObjectIndex].curvePath[prevPoint].x - deltaCCX
							vm.layers[pixiObjectIndex].curvePath[prevPoint].cpy = vm.layers[pixiObjectIndex].curvePath[prevPoint].y - deltaCCY
						}
						//if CPX\CPY (left) point moving
						if (vm.pointType == 2) {
							var deltaCPX = mpos.x - vm.initCPX
							var deltaCPY = mpos.y - vm.initCPY
							var nextPoint = (vm.pointIndex + 1 >= vm.layers[pixiObjectIndex].curvePath.length) ? 1 : vm.pointIndex + 1
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].cpx = vm.initCPX + deltaCPX
							vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].cpy = vm.initCPY + deltaCPY
							var deltaCCX = mpos.x - vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].x
							var deltaCCY = mpos.y - vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].y
							vm.layers[pixiObjectIndex].curvePath[nextPoint].cx = vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].x - deltaCCX
							vm.layers[pixiObjectIndex].curvePath[nextPoint].cy = vm.layers[pixiObjectIndex].curvePath[vm.pointIndex].y - deltaCCY
						}
						// Redraw shape
						vm.curveRedraw(pixiObjectIndex)
						vm.edgeHelper(0, true, false)
					}
				}
			}
		}
	}
}