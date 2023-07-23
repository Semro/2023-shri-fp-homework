/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  equals,
  allPass,
  prop,
  compose,
  values,
  filter,
  count,
  all,
  converge,
  not,
  gte,
  countBy,
  any,
  identity,
  __,
} from "ramda";
import { SHAPES, COLORS } from "../constants";

// Геттеры
const getStar = prop(SHAPES.STAR);
const getSquare = prop(SHAPES.SQUARE);
const getTriangle = prop(SHAPES.TRIANGLE);
const getCircle = prop(SHAPES.CIRCLE);

// Предикаты
const isWhite = equals(COLORS.WHITE);
const isRed = equals(COLORS.RED);
const isOrange = equals(COLORS.ORANGE);
const isGreen = equals(COLORS.GREEN);
const isBlue = equals(COLORS.BLUE);

// Предикаты посложней
const isRedStar = compose(isRed, getStar);
const isGreenSquare = compose(isGreen, getSquare);
const isWhiteTriangle = compose(isWhite, getTriangle);
const isWhiteCircle = compose(isWhite, getCircle);
const isBlueCircle = compose(isBlue, getCircle);
const isOrangeSquare = compose(isOrange, getSquare);
const isGreenTriangle = compose(isGreen, getTriangle);
const isNotWhite = compose(not, isWhite);
const isNotRed = compose(not, isRed);

const isNotWhiteSquare = compose(isNotWhite, getSquare);
const isNotWhiteTriangle = compose(isNotWhite, getTriangle);
const isNotWhiteStar = compose(isNotWhite, getStar);
const isNotRedStar = compose(isNotRed, getStar);
const isMoreOrEquals2 = gte(__, 2);
const isMoreOrEquals3 = gte(__, 3);

const threeFiguresIsNotWhite = compose(
  isMoreOrEquals3,
  count(isNotWhite),
  values
);
const threeFiguresWithSameColor = compose(
  any(isMoreOrEquals3),
  values,
  countBy(identity),
  filter(isNotWhite),
  values
);

const countRed = compose(count(isRed), values);
const countBlue = compose(count(isBlue), values);
const countGreen = compose(count(isGreen), values);

export const validateFieldN1 = allPass([
  isRedStar,
  isGreenSquare,
  isWhiteTriangle,
  isWhiteCircle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(isMoreOrEquals2, countGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [countRed, countBlue]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isBlueCircle,
  isRedStar,
  isOrangeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).

export const validateFieldN5 = allPass([
  threeFiguresIsNotWhite,
  threeFiguresWithSameColor,
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  compose(equals(2), countGreen),
  isGreenTriangle,
  compose(equals(1), countRed),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(isOrange), values);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isGreen), values);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  converge(equals, [getTriangle, getSquare]),
  isNotWhiteTriangle,
  isNotWhiteSquare,
]);
