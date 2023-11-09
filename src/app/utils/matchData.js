import { indexBy, prop } from "ramda";


export function matchData(mainArray, mainKey, extraArray, extraKey, fieldName) {
  const extraData = indexBy(prop(extraKey), extraArray);
  if (fieldName) {
    return mainArray.map((mainData) => ({ ...mainData, [fieldName]: extraData[mainData[mainKey]] }));
  } else {
    return mainArray.map((mainData) => ({ ...mainData, ...extraData[mainData[mainKey]] }));
  }
}