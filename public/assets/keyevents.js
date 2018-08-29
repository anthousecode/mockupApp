var keyEvents = {
	data: {
		isEscPress: false
	},
	methods: {
		// Обработчики для НАЖАТИЙ на кнопку
		handleGlobalKeyDown(e) {
			if (!vm.isTypeText) {
				// ESC - ипользуется при отмене действий или выделения
				if (e.key == 'Escape') {
					vm.isEscPress = true;
					vm.select()
					vm.setRubberBand(-1, -1, -1, -1);
					//vm.removelayer(0)
				}
				// Del \ Backspace
				if (e.key == 'Delete' || e.key == 'Backspace') {
					vm.deleteGradientPicker()
				}
				// Стрелка вверх
				if (e.key == 'ArrowUp') {
					if (vm.usetool != '') {
						// При рисовании звезды для увеличения количества вершин
						if (vm.usetool == 'drawstar') {
							vm.starCorners++;
							vm.drawStar(true);
						}
						// При рисовании прямоугольника для увеличения радиуса углов
						if (vm.usetool == 'drawrect') {
							vm.borderround++;
							vm.drawRoundedRectable(true);
						}
						e.preventDefault()
						return false;
					}
				}
				// Стрелка вниз
				if (e.key == 'ArrowDown') {
					if (vm.usetool != '') {
						// При рисовании звезды для уменьшения количества вершин
						if (vm.usetool == 'drawstar') {
							vm.starCorners--
								if (vm.starCorners < 3) vm.starCorners = 3;
							vm.drawStar(true);
						}
						// При рисовании прямоугольника для уменьшения радиуса углов
						if (vm.usetool == 'drawrect') {
							vm.borderround--
								if (vm.borderround < 1) vm.borderround = 1;
							vm.drawRoundedRectable(true);
						}
						e.preventDefault()
						return false;
					}
				}
				// Shift
				if (e.key == 'Shift') {
					if (vm.usetool != '') {
						// При рисовании круга вместо эллипса
						if (vm.usetool == 'drawcircle') {
							vm.isShiftPress = true;
							vm.drawEllipse(true);
						}
						// При рисовании квадрата вместо прямоугольника
						if (vm.usetool == 'drawrect') {
							vm.isShiftPress = true;
							vm.drawRoundedRectable(true);
						}
						// При рисовании звезды с углом поворота 0
						if (vm.usetool == 'drawstar') {
							vm.isShiftPress = true;
							vm.drawStar(true)
						}
					}
				}
				// Alt  
				if (e.key == 'Alt') {
					if (vm.usetool != '') {
						// При рисовании звезды для регулирования внутреннего радиуса
						if (vm.usetool == 'drawstar') {
							vm.isAltPress = true;
							vm.drawStar(true)
						}
					}
				}
				// Control \ Meta (macos)
				if (e.key == 'Control' || e.key == 'Meta') {
					vm.cntrkey = true;
					//e.preventDefault()
					//return false;
				}
				// Ctrl = \ Ctrl +   (при увеличения масштаба)
				if ((e.key == '=' || e.key == '+') && vm.cntrkey) {
					if (vm.scale + vm.stepscale > vm.maxscale) vm.scale = vm.maxscale
					else vm.scale += vm.stepscale;
					vm.resize(0);
					e.preventDefault()
					return false;
				}
				// Ctrl -  (при уменьшении масштаба)
				if (e.key == '-' && vm.cntrkey) {
					if (vm.scale - vm.stepscale < vm.minscale) vm.scale = vm.minscale
					else vm.scale -= vm.stepscale;
					vm.resize(0);
					e.preventDefault()
					return false;
				}
				// Удержание пробела при сдвиге рабочей области
				if (e.key == ' ') {
					vm.isHoldSpace = true;
					document.getElementById("canvas").style.cursor = "move";
					e.preventDefault()
					return false;
				}
			}
		},
	// Обработчики для ОТПУСКАНИЙ кнопки
		handleGlobalKeyUp(e) {
			// ESC
			if (!vm.isTypeText) {
				if (e.key == 'Escape') {
					vm.isEscPress = false;
				}
			//Shift	
				if (e.key == 'Shift') {
					if (vm.usetool != '') {
						vm.isShiftPress = false;
					}
				}
			//Alt	
				if (e.key == 'Alt') {
					if (vm.usetool != '') {
						vm.isAltPress = false;
					}
				}
			// Ctrl \ Meta (macos)	
				if (e.key == 'Control' || e.key == 'Meta') {
					vm.cntrkey = false;
					//	e.preventDefault()
					//	return false;
				}
			// пробел	
				if (e.key == ' ') {
					vm.isHoldSpace = false;
					document.getElementById("canvas").style.cursor = "move";
					e.preventDefault()
					return false;
				}
			}
		}
	}
}