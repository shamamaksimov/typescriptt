"use strict";
// клс
class LogToConsole {
    log(message) {
        console.log(message);
    }
}
var CarriageState;
(function (CarriageState) {
    CarriageState[CarriageState["UP"] = 0] = "UP";
    CarriageState[CarriageState["DOWN"] = 1] = "DOWN";
})(CarriageState || (CarriageState = {}));
var LineColor;
(function (LineColor) {
    LineColor["BLACK"] = "\u0447\u0451\u0440\u043D\u044B\u0439";
    LineColor["RED"] = "\u043A\u0440\u0430\u0441\u043D\u044B\u0439";
    LineColor["GREEN"] = "\u0437\u0435\u043B\u0451\u043D\u044B\u0439";
})(LineColor || (LineColor = {}));
class Plotter {
    position;
    angle;
    color;
    carriageState;
    logger;
    constructor(logger) {
        this.logger = logger;
        this.position = { x: 0, y: 0 };
        this.angle = 0;
        this.color = LineColor.BLACK;
        this.carriageState = CarriageState.UP;
    }
    calcNewPosition(distance, angle, current) {
        const angle_in_rads = angle * (Math.PI / 180.0);
        const x = current.x + distance * Math.cos(angle_in_rads);
        const y = current.y + distance * Math.sin(angle_in_rads);
        return { x: Math.round(x), y: Math.round(y) };
    }
    move(distance) {
        let newPosition = this.calcNewPosition(distance, this.angle, this.position);
        if (this.carriageState === CarriageState.DOWN) {
            this.logger.log(`Чертим линию из (${this.position.x}, ${this.position.y}) в (${newPosition.x}, ${newPosition.y}) используя ${this.color} цвет.`);
        }
        else {
            this.logger.log(`Передвигаем на ${distance} от точки (${this.position.x}, ${this.position.y})`);
        }
        this.position = newPosition;
    }
    turn(angle) {
        this.logger.log(`Поворачиваем на ${angle} градусов`);
        this.angle = (this.angle + angle) % 360.0;
    }
    carriageUp() {
        this.logger.log("Поднимаем каретку");
        this.carriageState = CarriageState.UP;
    }
    carriageDown() {
        this.logger.log("Опускаем каретку");
        this.carriageState = CarriageState.DOWN;
    }
    setColor(color) {
        this.logger.log(`Устанавливаем ${color} цвет линии.`);
        this.color = color;
    }
    setPosition(position) {
        this.logger.log(`Установка позиции каретки в (${position.x}, ${position.y}).`);
        this.position = position;
    }
    drawTriangle(size) {
        this.carriageDown();
        for (let i = 0; i < 3; i++) {
            this.move(size);
            this.turn(120.0);
        }
        this.carriageUp();
    }
    drawSquare(size) {
        this.carriageDown();
        for (let i = 0; i < 4; i++) {
            this.move(size);
            this.turn(90.0);
        }
        this.carriageUp();
    }
}
function drawingTriangle(pl, size) {
    pl.setColor(LineColor.BLACK);
    for (let i = 0; i < 3; i++) {
        pl.move(size);
        pl.turn(120.0);
    }
}
const plotter = new Plotter(new LogToConsole());
drawingTriangle(plotter, 100.0);
plotter.setPosition({ x: 10.0, y: 10.0 });
plotter.setColor(LineColor.RED);
plotter.drawSquare(80.0);
