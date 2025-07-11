import React from "react";
import {ToastAndroid, Platform, Alert} from 'react-native';

export const camelCase = (userString) => {
    return userString
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
};

export const pascalCase = (userString) => {
    return userString.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
        return g1.toUpperCase() + g2.toLowerCase();
    });
};

export const capEachWord = (userString) => {
    return userString
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .replace(new RegExp("-", "g"), " ");
};

export const titleCase = (str) => {
    let res = str
        .toLowerCase()
        .replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
    res = res.replace(new RegExp("-", "g"), " ");
    return res.replace(new RegExp("_", "g"), " ");
};



export const ToastMessage = (msg:any) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('Alert', msg);
  }
};
