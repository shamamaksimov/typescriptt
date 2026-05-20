"use strict";
/**
  * Плоттер поддерживает пять команд:

  * 1. Переместить каретку на некоторое расстояние в текущем направлении.
  * 2. Повернуть на определенное количество градусов по часовой стрелке или против часовой стрелки.
  * 3. Опустить или поднять каретку. Когда каретка опущена, плоттер при перемещении рисует линию.
  * 4. Установить цвет линии (один из черного, красного или зелёного).
  * 5. Установить начальную позицию каретки.
 */
var CarriageState;
(function (CarriageState) {
    CarriageState[CarriageState["UP"] = 0] = "UP";
    CarriageState[CarriageState["DOWN"] = 1] = "DOWN";
})(CarriageState || (CarriageState = {}));
var LineColor;
(function (LineColor) {
    LineColor["BLACK"] = "\u0447\u043E\u0440\u043D\u044B\u0439";
    LineColor["RED"] = "\u043A\u0440\u0430\u0441\u043D\u044B\u0439";
    LineColor["GREEN"] = "\u0437\u0435\u043B\u0451\u043D\u044B\u0439";
})(LineColor || (LineColor = {}));
/**
 * Функции плотера
 */
/**
 * Чертит линию от координат from к координатам to
 */
function drawLine(prt, from, to, color) {
    prt(`...Чертим линию из (${from.x}, ${from.y}) в (${to.x}, ${to.y}) используя ${color} цвет.`);
}
/**
 * Вычисляет и возвращает новую позицию
 */
function calcNewPosition(distance, angle, current) {
    // Преобразуем градусы в радианы при 180.0 градусов = 1 pi радиан
    const angle_in_rads = angle * (Math.PI / 180.0) * 1.0;
    // новая позиция
    const x = current.x + distance * Math.cos(angle_in_rads);
    const y = current.y + distance * Math.sin(angle_in_rads);
    // возвращаем новую позицию
    return { x: Math.round(x), y: Math.round(y) };
}
/**
 * Перемещает каретку на расстояние distance.
 * Возвращает новый PlotterState
 */
function move(prt, distance, state) {
    // вычисляем новую позицию
    let newPosition = calcNewPosition(distance, state.angle, state.position);
    // draw line if needed
    if (state.carriageState === CarriageState.DOWN) {
        // отрисовка линии
        drawLine(prt, state.position, newPosition, state.color);
    }
    else {
        prt(`Передвигаем на ${distance} от точки (${state.position.x}, ${state.position.y})`);
    }
    // изменяем состояние
    const retState = { ...state };
    retState.position = newPosition;
    return retState;
}
/**
 * поворачивает каретку на угол angle
 * возвращает новый PlotterState
 */
function turn(prt, angle, state) {
    prt(`Поворачиваем на ${angle} градусов`);
    // вычисляем новый угол
    const newAngle = (state.angle + angle) % 360.0;
    // изменяем состояние
    const retState = { ...state };
    retState.angle = newAngle;
    return retState;
}
/**
 * Поднимает каретку
 * Возвращает новый PlotterState
 */
function carriageUp(prt, state) {
    prt("Поднимаем каретку");
    // изменяем состояние
    const retState = { ...state };
    retState.carriageState = CarriageState.UP;
    return retState;
}
/**
 * Опускает каретку
 * Возвращает новый PlotterState
 */
function carriageDown(prt, state) {
    prt("Опускаем каретку");
    // изменяем состояние
    const retState = { ...state };
    retState.carriageState = CarriageState.DOWN;
    return retState;
}
/**
 * Устанавливает цвет печати в color
 * Возвращает новый PlotterState
 */
function setColor(prt, color, state) {
    prt(`Устанавливаем ${color} цвет линии.`);
    // изменяем состояние
    const retState = { ...state };
    retState.color = color;
    return retState;
}
/**
 * Устанавливает позицию каретки в position
 * Возвращает новый PlotterState
 */
function setPosition(prt, position, state) {
    prt(`Устанавливаем позицию каретки в (${position.x}, ${position.y}).`);
    // изменяем состояние
    const retState = { ...state };
    retState.position = position;
    return retState;
}
/**
 * Функции для черчения фигур
 */
/**
 * Чертит треугольник со сторонами size
 */
function drawTriangle(prt, size, state) {
    state = carriageDown(prt, state);
    for (let i = 0; i < 3; ++i) {
        state = move(prt, size, state);
        state = turn(prt, 120.0, state);
    }
    return carriageUp(prt, state);
}
/**
 * Чертит квадрат со сторонами size
 */
function drawSquare(prt, size, state) {
    state = carriageDown(prt, state);
    for (let i = 0; i < 4; ++i) {
        state = move(prt, size, state);
        state = turn(prt, 90.0, state);
    }
    return carriageUp(prt, state);
}
/**
 * Инициализация приложения
 */
const printer = console.log;
function initializePlotterState(position, angle, color, carriageState) {
    return {
        position: position,
        angle: angle,
        color: color,
        carriageState: carriageState
    };
}
let initPosition = { x: 0.0, y: 0.0 };
let initColor = LineColor.BLACK;
let initAngle = 0.0;
let initCarriageState = CarriageState.UP;
// Начальное состояние плоттера
let plotterState = initializePlotterState(initPosition, initAngle, initColor, initCarriageState);
/**
 * Процесс черчения
 */
plotterState = drawTriangle(printer, 100.0, plotterState);
plotterState = setPosition(printer, { x: 10.0, y: 10.0 }, plotterState);
plotterState = setColor(printer, LineColor.RED, plotterState);
plotterState = drawSquare(printer, 80.0, plotterState);
