var mouseEvent = {
// В глобальных событиях мыши ловяться только событие отвечающие за движение рабочей области с зажатым пробелом и масштаб рабочей области
	methods: {
		// Отлавливаем колесико мышки, которым мы регулируем масштаб
		handleGlobalMouseWheel(e) {
			if (e.deltaY / 120 > 0) {
				if (vm.scale - vm.stepscale < vm.minscale) vm.scale = vm.minscale
				else vm.scale -= vm.stepscale;
				vm.resize(0);
			} else {
				if (vm.scale + vm.stepscale > vm.maxscale) vm.scale = vm.maxscale
				else vm.scale += vm.stepscale;
				vm.resize(0);
			}
		},
			// Отлавливаем движение мышт	
		handleGlobalMouseMove(e) {
			// В случаях если уже нажат пробел
			if (vm.isHoldSpace && vm.isDragCanvas.status) {
				document.getElementById("canvas").style.left = parseInt(vm.isDragCanvas.target.left + e.x - vm.isDragCanvas.position.x) + 'px';
				document.getElementById("canvas").style.top = parseInt(vm.isDragCanvas.target.top + e.y - vm.isDragCanvas.position.y) + 'px';
			}
		},
	  	// Отлавливаем нажатие на кнопку мышт	
		handleGlobalMouseDown(e) {
			// В случаях если уже нажат пробел
			if (vm.isHoldSpace && (e.target.id == 'canvas' || e.target.id == 'workspace')) { 
				vm.isDragCanvas.status = true;
				vm.isDragCanvas.position.x = e.x;
				vm.isDragCanvas.position.y = e.y;
			}
		},
		  	// Отлавливаем отпускание кнопки мышт		
		handleGlobalMouseUp(e) {
			if (vm.isDragCanvas.status) {
				vm.isDragCanvas.status = false;
				vm.isDragCanvas.target.left = parseInt(document.getElementById("canvas").style.left);
				vm.isDragCanvas.target.top = parseInt(document.getElementById("canvas").style.top);
			}
		}
	}

}