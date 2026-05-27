// инт
interface Logger {
    log(message: string): void;
}

// клс
class LogToConsole implements Logger {
    log(message: string): void {
        console.log(message);
    }
}

// типы
type Point = number;
type Distance = number;
type Angle = number;
type Position = { x: Point; y: Point };

enum CarriageState {
    UP,
    DOWN
}

enum LineColor {
    BLACK = "чёрный",
    RED = "красный",
    GREEN = "зелёный"
}

class Plotter {
    private position: Position;
    private angle: Angle;
    private color: LineColor;
    private carriageState: CarriageState;
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        this.position = { x: 0, y: 0 };
        this.angle = 0;
        this.color = LineColor.BLACK;
        this.carriageState = CarriageState.UP;
    }

    private calcNewPosition(distance: Distance, angle: Angle, current: Position): Position {
        const angle_in_rads = angle * (Math.PI / 180.0);
        const x = current.x + distance * Math.cos(angle_in_rads);
        const y = current.y + distance * Math.sin(angle_in_rads);
        return { x: Math.round(x), y: Math.round(y) };
    }

    move(distance: Distance): void {
        let newPosition = this.calcNewPosition(distance, this.angle, this.position);
        
        if (this.carriageState === CarriageState.DOWN) {
            this.logger.log(`Чертим линию из (${this.position.x}, ${this.position.y}) в (${newPosition.x}, ${newPosition.y}) используя ${this.color} цвет.`);
        } else {
            this.logger.log(`Передвигаем на ${distance} от точки (${this.position.x}, ${this.position.y})`);
        }
        
        this.position = newPosition;
    }

    turn(angle: Angle): void {
        this.logger.log(`Поворачиваем на ${angle} градусов`);
        this.angle = (this.angle + angle) % 360.0;
    }

    carriageUp(): void {
        this.logger.log("Поднимаем каретку");
        this.carriageState = CarriageState.UP;
    }

    carriageDown(): void {
        this.logger.log("Опускаем каретку");
        this.carriageState = CarriageState.DOWN;
    }

    setColor(color: LineColor): void {
        this.logger.log(`Устанавливаем ${color} цвет линии.`);
        this.color = color;
    }

    setPosition(position: Position): void {
        this.logger.log(`Установка позиции каретки в (${position.x}, ${position.y}).`);
        this.position = position;
    }

    drawTriangle(size: number): void {
        this.carriageDown();
        for(let i = 0; i < 3; i++) {
            this.move(size);
            this.turn(120.0);
        }
        this.carriageUp();
    }

    drawSquare(size: number): void {
        this.carriageDown();
        for(let i = 0; i < 4; i++) {
            this.move(size);
            this.turn(90.0);
        }
        this.carriageUp();
    }
}

function drawingTriangle(pl: Plotter, size: number): void {
    pl.setColor(LineColor.BLACK);
    for(let i = 0; i < 3; i++) {
        pl.move(size);
        pl.turn(120.0);
    }
}

const plotter = new Plotter(new LogToConsole());
drawingTriangle(plotter, 100.0);

plotter.setPosition({ x: 10.0, y: 10.0 });
plotter.setColor(LineColor.RED);
plotter.drawSquare(80.0);