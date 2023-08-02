/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import {
  __,
  allPass,
  prop,
  compose,
  length,
  not,
  trim,
  split,
  join,
  test,
  ifElse,
  gt,
  lt,
  tap,
  andThen,
  otherwise,
  assoc,
  mathMod,
  partial,
} from "ramda";

const api = new Api();
const API_BASE_URL = "https://api.tech/numbers/base";
const API_ANIMAL_URL = "https://animals.tech";

const removeWhitespace = compose(join(""), split(/\s+/), trim);

const getLength = compose(length);
const getRoundNumber = compose(Math.round, Number);
const getApiResult = compose(String, prop("result"));
const getSquareNumber = (n) => n ** 2;
const getMod3 = (n) => mathMod(n, 3);

const isGreaterThan2 = gt(__, 2);
const isLessThan10 = lt(__, 10);
const isValidRange = compose(
  allPass([isGreaterThan2, isLessThan10]),
  getLength
);
const isFloatingNumber = test(/^[+-]?([0-9]*[.])?[0-9]+$/);
const isPositive = compose(not, test(/^-/));
const isValid = allPass([isValidRange, isFloatingNumber, isPositive]);

const createApiBaseQuery = assoc("number", __, { from: 10, to: 2 });
const createApiAnimalUrl = (id) => new URL(id, API_ANIMAL_URL);

const apiGetBinaryNumber = compose(api.get(API_BASE_URL), createApiBaseQuery);
const apiGetAnimal = compose(api.get(__, {}), createApiAnimalUrl);

const thenGetApiResult = andThen(getApiResult);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapLog = tap(writeLog);
  const thenTapLog = andThen(tapLog);
  const handleValidationError = partial(handleError, ["ValidationError"]);

  const continueProcessing = compose(
    otherwise(handleError),
    andThen(handleSuccess),
    thenGetApiResult,
    andThen(apiGetAnimal),
    thenTapLog,
    andThen(getMod3),
    thenTapLog,
    andThen(getSquareNumber),
    thenTapLog,
    andThen(getLength),
    thenTapLog,
    thenGetApiResult,
    apiGetBinaryNumber,
    tapLog,
    getRoundNumber
  );

  compose(
    ifElse(isValid, continueProcessing, handleValidationError),
    removeWhitespace,
    tapLog
  )(value);
};

export default processSequence;
