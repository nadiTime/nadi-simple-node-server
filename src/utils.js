"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectRandomItemFromArray = void 0;
const selectRandomItemFromArray = (items) => {
    return items[Math.floor(Math.random() * items.length)];
};
exports.selectRandomItemFromArray = selectRandomItemFromArray;
