/**
 * Создает экземпляр космического корабля.
 * @name Vessel
 * @param {String} name Название корабля.
 * @param {Number[]} position Местоположение корабля.
 * @param {Number} capacity Грузоподъемность корабля.
 * @constructor
 */
function Vessel(name, position, capacity) {
    if(!isString(name) || name === '')
        throw new Error("Название корабля должно быть непустой строкой");
    if (!isArray(position) || position.length !== 2 || !isNumber(position[0]) || !isNumber(position[1]))
        throw new Error("Местоположение корабля должно быть массивом из двух чисел");
    if(!isNumber(capacity) || capacity <= 0)
        throw new Error("Грузоподъемность корабля должна быть положительным числом");

	var _name = name;
	var _position = position;
	var _occupiedSpace = 0;
	var _capacity = capacity;
	var _planet = null;

    /**
     * Получает имя корабля.
     * @name Vessel.getName
     * @return {String}
     */
	this.getName = function () {
		return _name;
	};

    /**
     * Получает планету, на которой находится корабль.
     * @name Vessel.getCurrentPlanet
     * @return {?Planet} вернет планету на которой находится
     * корабль, либо null, если корабль находится где-то в
     * космосе
     */
	this.getCurrentPlanet = function () {
		return _planet;
	};

    /**
     * Получает количество груза на корабле.
     * @name Vessel.getOccupiedSpace
     * @return {Number}
     */
	this.getOccupiedSpace= function () {
		return _occupiedSpace;
	};

    /**
     * Изменяет количество груза на корабле.
     *
     * Может быть изменено, только если корабль находится на какой-либо планете.
     * @param {Number} newOccupiedSpace Новое количество груза.
     * @name Vessel.setOccupiedSpace
     */
	this.setOccupiedSpace = function (newOccupiedSpace) {
        if (!isNumber(newOccupiedSpace)) {
            throw new Error("Новое количество груза должно быть числом");
        } else {
            if (!_planet)
                throw new Error("Корабль не приземлен");
            if (newOccupiedSpace <= 0)
                throw new Error("Новое количество груза должно быть положительным числом");
            if (newOccupiedSpace > _capacity)
                throw new Error("Новое количество груза должно не превышать грузоподъемность корабля");

            _occupiedSpace = newOccupiedSpace;
        }
    };

    /**
     * Выводит количество свободного места на корабле.
     * @name Vessel.getFreeSpace
     * @return {Number}
     */
    this.getFreeSpace = function () {
        return _capacity - _occupiedSpace;
    };

    /**
     * Переносит корабль в указанную точку.
     * @param {Number[]|Planet} newPosition Новое местоположение корабля.
     * @example
     * vessel.flyTo([1,1]);
     * @example
     * var earth = new Planet('Земля', [1,1]);
     * vessel.flyTo(earth);
     * @name Vessel.flyTo
     */
    this.flyTo = function (newPosition) {
        if(newPosition instanceof Planet){
            _position = newPosition.getPosition();
            _planet = newPosition;
        }
        else
            if (isArray(newPosition) && newPosition.length === 2)
                if(isNumber(newPosition[0]) && isNumber(newPosition[1])){
                    _position = newPosition;
                    _planet = null;
                }
                else
                    throw new Error("Новое местоположение корабля должно иметь две числовые координаты");
            else
                throw new Error("Новое местоположение корабля должно либо ссылаться на планету, либо быть массивом из двух чисел");
    };

    /**
     * Выводит текущее состояние корабля: имя, местоположение, доступную грузоподъемность.
     * @example
     * vessel.report(); // Корабль "Имя корабля". Местоположение: 50,20. Занято: 200 из 1000т.
     * @name Vessel.report
     * @return {String}
     */
	this.report = function () {
		return 'Корабль "' + _name + '". Местоположение: ' + _position[0] + ','+ _position[1] + '. Занято: ' + this.getOccupiedSpace() +' из ' + _capacity + 'т.';
	};
}

/**
 * Создает экземпляр планеты.
 * @name Planet
 * @param {String} name Название планеты.
 * @param {Number[]} position Местоположение планеты.
 * @param {Number} [availableAmountOfCargo=0] Доступное количество груза.
 * @constructor
 */
function Planet(name, position, availableAmountOfCargo) {
    if (!isString(name) || name === '')
        throw new Error("Название планеты должно быть непустой строкой");
    if (!isArray(position) || position.length !== 2 || !isNumber(position[0]) || !isNumber(position[1]))
        throw new Error("Местоположение планеты должно быть массивом из двух чисел");
    if (arguments.length === 3 && (!isNumber(availableAmountOfCargo) || availableAmountOfCargo < 0))
        throw new Error("Доступное на планете количество груза должно быть неотрицательным числом");

    var _name = name;
    var _position = position;
    var _availableAmountOfCargo = availableAmountOfCargo || 0;

    /**
     * Получает координаты планеты.
     * @name Planet.getPosition
     * @return {Number[]}
     */
    this.getPosition = function () {
        return _position;
    };

    /**
     * Возвращает доступное количество груза планеты.
     * @name Planet.getAvailableAmountOfCargo
     * @return {Number}
     */
    this.getAvailableAmountOfCargo = function () {
        return _availableAmountOfCargo;
    };

    /**
     * Выводит текущее состояние планеты: имя, местоположение, количество доступного груза.
     * @name Planet.report
     * @return {String}
     */
    this.report = function () {
        return 'Планета "' + _name + '". Местоположене: ' + _position[0] + ',' + _position[1] + '. ' + (_availableAmountOfCargo == 0 ? 'Грузов нет.' : 'Доступно груза: ' + _availableAmountOfCargo + 'т.');
    };

    /**
     * Загружает на корабль заданное количество груза.
     *
     * Перед загрузкой корабль должен приземлиться на планету.
     * @param {Vessel} vessel Загружаемый корабль.
     * @param {Number} cargoWeight Вес загружаемого груза.
     * @name Planet.loadCargoTo
     */
    this.loadCargoTo = function (vessel, cargoWeight) {
        if (cargoWeight <= 0)
            throw new Error("Вес загружаемого груза должен быть положительным числом");
        if (vessel.getCurrentPlanet() !== this)
            throw new Error("Корабль не находится над данной планетой");
        if (_availableAmountOfCargo < cargoWeight)
            throw new Error('На планете "' + _name + '" ' + ( _availableAmountOfCargo == 0 ? 'грузов нет' : _availableAmountOfCargo + 'т груза') + '. Ожидается загрузка ' + cargoWeight + 'т.');
        if (vessel.getFreeSpace() < cargoWeight)
            throw new Error('На корабле "' + vessel.getName() + '" недостаточно свободного места. ' + ( vessel.getFreeSpace() == 0 ? 'Свободного места нет!' : 'Есть место для ' + vessel.getFreeSpace() + 'т груза') + '. Ожидается загрузка ' + cargoWeight + 'т.');

        _availableAmountOfCargo -= cargoWeight;
        vessel.setOccupiedSpace(vessel.getOccupiedSpace() + cargoWeight);
    };

    /**
     * Выгружает с корабля заданное количество груза.
     *
     * Перед выгрузкой корабль должен приземлиться на планету.
     * @param {Vessel} vessel Разгружаемый корабль.
     * @param {Number} cargoWeight Вес выгружаемого груза.
     * @name Planet.unloadCargoFrom
     */
    this.unloadCargoFrom = function (vessel, cargoWeight) {
        if (cargoWeight <= 0)
            throw new Error("Вес выгружаемого груза должен быть положительным числом");
        if (vessel.getCurrentPlanet() !== this)
            throw new Error("Корабль не находится над данной планетой");
        if (vessel.getOccupiedSpace() < cargoWeight)
            throw new Error('На корабле "' + vessel.getName() + '" недостаточно груза. ' + ( vessel.getOccupiedSpace() == 0 ? 'Груза нет!' : 'Имеется ' + vessel.getOccupiedSpace() + 'т груза') + '. Ожидается выгрузка ' + cargoWeight + 'т.');

        _availableAmountOfCargo += cargoWeight;
        vessel.setOccupiedSpace(vessel.getOccupiedSpace() - cargoWeight);
    };
}

/**
 * Проверка на число
 * @param n
 * @return {Boolean}
 */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Проверка на строку
 * @param s
 * @return {Boolean}
 */
function isString(s){
    return typeof s == 'string' || s instanceof String;
}

/**
 * Проверка на массив
 * @param a
 * @return {Boolean}
 */
function isArray(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
}
