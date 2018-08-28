// Панель инструментов , методы для запуска  тех или иных инструментов 

var toolsActivators = {
	methods: {
// Кривая бизье
		curvedraw() {
			document.getElementById("canvas").style.cursor = "crosshair";
			vm.edgeHelper(vm.lastEdgeHelper,false)
			vm.usetool = 'drawcurve';
		},
// Элипс (круг)		
		ellipsedraw() {
			document.getElementById("canvas").style.cursor = "crosshair";
			vm.usetool = 'drawcircle';
		},
// Прямоугольник (квадрат)
		rectdraw() {
			document.getElementById("canvas").style.cursor = "crosshair";
			vm.usetool = 'drawrect';
		},
// Звезда 
		stardraw() {
			document.getElementById("canvas").style.cursor = "crosshair";
			vm.usetool = 'drawstar';
		},
// Текст
		textdraw() {
			document.getElementById("canvas").style.cursor = "text";
			vm.usetool = 'drawtext';
		},
// Назад		
		undo() {
			document.getElementById("canvas").style.cursor = "default";
		},
// Вперед		
		redo() {
			document.getElementById("canvas").style.cursor = "default";
		},
// Выбор элемента		
		select() {
			console.log(vm.isDrawCurve )
			vm.isDraw = false;
			vm.isDrawCurve = false;
			vm.usetool = '';
			vm.isHoldSpace = false;
			vm.edgeHelper(vm.lastEdgeHelper, false, false)
			vm.lastEdgeHelper = -1
			document.getElementById("canvas").style.cursor = "default";
		},
// Выбор рабочей области		
		selectsheet() {
			vm.isHoldSpace = true;
			document.getElementById("canvas").style.cursor = "pointer";
		}
	}
}



