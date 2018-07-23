var shapesDrawers = {
	data: {
		cx: false,
		cy: false,
		shapeIsClosed: false
	},
	methods: {
		drawCurve(mouseX, mouseY, fillcolor = 0xFFFFFF, strokecolor = vm.layers[0].globject.lineColor, strokesize = vm.layers[0].globject.lineWidth, isDynamic = true) {
			if (isDynamic === true) vm.isDrawCurve = true;
			var closearea = 100
			if (vm.isDrawCurve === true &&
				vm.layers[0].curvePath[0].x > (mouseX - closearea) && vm.layers[0].curvePath[0].x < (mouseX + closearea) &&
				vm.layers[0].curvePath[0].y > (mouseY - closearea) && vm.layers[0].curvePath[0].y < (mouseY + closearea)
			) {
				vm.layers[0].curvePath.push({
					x: vm.layers[0].curvePath[0].x,
					y: vm.layers[0].curvePath[0].y,
					cx: (vm.cx === false) ? vm.layers[0].curvePath[0].cx : vm.cx,
					cy: (vm.cy === false) ? vm.layers[0].curvePath[0].cy : vm.cy,
					cpx: vm.layers[0].curvePath[0].cpx,
					cpy: vm.layers[0].curvePath[0].cpy
				})
				if (isDynamic === false) {
					vm.isDrawCurve = false;
				}
			} else {
				vm.layers[0].curvePath.push({
					x: mouseX,
					y: mouseY,
					cx: (vm.cx === false) ? mouseX : vm.cx,
					cy: (vm.cy === false) ? mouseY : vm.cy,
					cpx: mouseX,
					cpy: mouseY
				})
				if (isDynamic === false) vm.isDrawCurve = true;
			}
			if (isDynamic === true && vm.isMouseDown === true) {
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 2].cpx = 2 * vm.layers[0].curvePath[vm.layers[0].curvePath.length - 2].x - mouseX;
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 2].cpy = 2 * vm.layers[0].curvePath[vm.layers[0].curvePath.length - 2].y - mouseY;
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 1].cx = mouseX;
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 1].cy = mouseY;
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 1].cpx = mouseX;
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 1].cpy = mouseY;
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 1].x = mouseX;
				vm.layers[0].curvePath[vm.layers[0].curvePath.length - 1].y = mouseY;
				vm.cx = mouseX;
				vm.cy = mouseY;
			}
			if (isDynamic === false) {
				vm.cx = false;
				vm.cy = false;
			}
			vm.curveRedraw(0);
			vm.renderer_client.stage.addChild(vm.layers[0].globject);
			vm.edgeHelper(0, true, false)
			if (isDynamic === true) vm.layers[0].curvePath.pop()
		},
		//*********************** DRAW STAR ************************************//
		drawStar(mouseX, mouseY, fillcolor = 0xFFFFFF, strokecolor = vm.layers[0].globject.lineColor, strokesize = vm.layers[0].globject.lineWidth) {
			var startX = parseInt(vm.layers[0].globject.x)
			var startY = parseInt(vm.layers[0].globject.y)
			if (mouseX === true) {
				var innerRadius = vm.layers[0].globject.innerRadius
				var outerRadius = vm.layers[0].globject.outerRadius
				var fillcolor = vm.layers[0].globject.fillcolor
				var rotate = vm.layers[0].globject.rotation
			} else {
				//calculate parameters
				var a = Math.abs(mouseX - startX);
				var b = Math.abs(mouseY - startY);
				var innerRadius = Math.sqrt((a * a) + (b * b));
				var rotate = Math.atan(b / a);
				var outerRadius = innerRadius / 2;
				if (vm.isAltPress) {
					outerRadius = vm.layers[0].globject.outerRadius
				}
				//presave parameters
				vm.layers[0].globject.innerRadius = innerRadius
				vm.layers[0].globject.outerRadius = outerRadius
				vm.layers[0].globject.fillcolor = fillcolor
			}
			if (vm.isShiftPress) {
				rotate = 0;
			}
			vm.layers[0].globject.clear();
			vm.layers[0].globject.beginFill(fillcolor);
			vm.layers[0].globject.lineStyle(strokesize, strokecolor);
			
			vm.layers[0].globject.drawStar(0, 0, vm.starCorners, innerRadius, outerRadius, rotate)
			vm.layers[0].globject.closePath();
			vm.layers[0].globject.position.set(startX,startY)

			vm.layers[0].globject.endFill();

			//vm.layers[0].globject.drawRect (-startX, -startY, 1980, 1080)




			vm.renderer_client.stage.addChild(vm.layers[0].globject);
		},
		//*********************** DRAW CIRCLE **********************************//
		drawEllipse(mouseX, mouseY, fillcolor = 0xFFFFFF, strokecolor = vm.layers[0].globject.lineColor, strokesize = vm.layers[0].globject.lineWidth) {
			if (mouseX === true) {
				var radiusX = vm.layers[0].globject.radiusX;
				var radiusY = vm.layers[0].globject.radiusY;
				var startX = vm.layers[0].globject.startX;
				var startY = vm.layers[0].globject.startY;
				var fillcolor = vm.layers[0].globject.fillcolor;
			} else {
				//calculate parameters
				var startX = (parseInt(vm.layers[0].globject.staticX) + mouseX) / 2;
				var startY = (parseInt(vm.layers[0].globject.staticY) + mouseY) / 2;
				var radiusX = Math.abs(mouseX - startX);
				var radiusY = Math.abs(mouseY - startY);
				//presave parameters
				vm.layers[0].globject.fillcolor = fillcolor;
				vm.layers[0].globject.startX = startX;
				vm.layers[0].globject.startY = startY;
				vm.layers[0].globject.radiusX = radiusX;
				vm.layers[0].globject.radiusY = radiusY;
			}
			if (vm.isShiftPress) {
				if (radiusX > radiusY) {
					radiusX = radiusY;
					if (startX > vm.layers[0].globject.staticX) startX = (parseInt(vm.layers[0].globject.staticX) + radiusX);
					else startX = (parseInt(vm.layers[0].globject.staticX) - radiusX);
				} else {
					radiusY = radiusX;
					if (startY > vm.layers[0].globject.staticY) startY = (parseInt(vm.layers[0].globject.staticY) + radiusY);
					else startY = (parseInt(vm.layers[0].globject.staticY) - radiusY);
				}
			}
			vm.layers[0].globject.clear()
			vm.layers[0].globject.beginFill(fillcolor)
			vm.layers[0].globject.lineStyle(strokesize, strokecolor)
			vm.layers[0].globject.drawEllipse(0, 0, radiusX, radiusY)
			vm.layers[0].globject.position.set(startX, startY)
			vm.layers[0].globject.endFill()
			vm.renderer_client.stage.addChild(vm.layers[0].globject)
		},
		//*********************** DRAW ROUNDED RECTANGLE oe SQUARE *************//
		drawRoundedRectable(mouseX, mouseY, fillcolor = 0xFFFFFF, strokecolor = vm.layers[0].globject.lineColor, strokesize = vm.layers[0].globject.lineWidth) {
			var startX = parseInt(vm.layers[0].globject.x)
			var startY = parseInt(vm.layers[0].globject.y)
			if (mouseX === true) {
				var width = vm.layers[0].globject.width - 1
				var height = vm.layers[0].globject.height - 1
				var fillcolor = vm.layers[0].globject.fillcolor
			} else {
				//calculate parameters
				var width = mouseX - startX;
				var height = mouseY - startY;
				//presave parameters
				vm.layers[0].globject.fillcolor = fillcolor
			}
			if (vm.isShiftPress) {
				if ((width < 0 && height < 0) || (width > 0 && height > 0)) var height = width;
				else var height = -width;
			}
			vm.layers[0].globject.clear();
			vm.layers[0].globject.beginFill(fillcolor);
			vm.layers[0].globject.lineStyle(strokesize, strokecolor);
			vm.layers[0].globject.drawRoundedRect(0, 0, width, height, vm.borderround);
			vm.layers[0].globject.position.set(startX, startY)
			vm.layers[0].globject.endFill();
			vm.renderer_client.stage.addChild(vm.layers[0].globject);
		}
	}
}