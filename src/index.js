"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var API_URL = "https://api.coincap.io/v2/assets";
var coinsList = document.querySelector(".coins-list");
function fetchCoinData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(API_URL)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching coin data:", error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderCoins(coins) {
    coins.forEach(function (coin) {
        var coinElement = createCoinElement(coin);
        coinsList === null || coinsList === void 0 ? void 0 : coinsList.appendChild(coinElement);
    });
}
function createCoinElement(coin) {
    var coinElement = document.createElement("article");
    var arrowDirection = coin.changePercent24Hr.includes("-") ? "down" : "up";
    var logoUrl = "https://coinicons-api.vercel.app/api/icon/".concat(coin.symbol.toLocaleLowerCase());
    coinElement.classList.add("coin-info");
    coinElement.classList.add(arrowDirection);
    coinElement.innerHTML = "<img class=\"coin-logo\" src=".concat(logoUrl, "></img>\n  <div class=\"coin-title\">\n  <span class=\"coin-name\">").concat(coin.name, "</span>\n      <span class=\"coin-symbol\">").concat(coin.symbol, "</span>\n    </div>\n    <div class=\"percentage-arrow\">\n    <span></span>\n    <span></span>\n    </div>\n    <div class=\"change-percent\">\n      <span>").concat(Number(coin.changePercent24Hr).toFixed(2), "%</span>\n    </div>\n    <div class=\"current-price\">$").concat(Number(coin.priceUsd).toFixed(2), "</div>");
    return coinElement;
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var coinData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchCoinData()];
                case 1:
                    coinData = _a.sent();
                    renderCoins(coinData);
                    return [2 /*return*/];
            }
        });
    });
}
init();
var direction = 1;
var speed = 1;
var velocity = 1;
var scrollDelay = 2000;
function scrollCoins() {
    if (coinsList) {
        setInterval(function () {
            coinsList.scrollBy(0, direction * speed * velocity);
            if (coinsList.scrollTop >=
                coinsList.scrollHeight - coinsList.clientHeight) {
                setTimeout(function () {
                    direction = -1;
                }, scrollDelay);
            }
            else if (coinsList.scrollTop === 0) {
                setTimeout(function () {
                    direction = 1;
                }, scrollDelay);
            }
        }, 15);
    }
}
var scrollTimeoutId;
function stopScrollingCoinsList() {
    clearTimeout(scrollTimeoutId);
    velocity = 0;
}
function scrollCoinsList() {
    scrollTimeoutId = setTimeout(function () {
        velocity = 1;
    }, scrollDelay);
}
coinsList === null || coinsList === void 0 ? void 0 : coinsList.addEventListener("mouseover", stopScrollingCoinsList);
coinsList === null || coinsList === void 0 ? void 0 : coinsList.addEventListener("touchmove", stopScrollingCoinsList);
coinsList === null || coinsList === void 0 ? void 0 : coinsList.addEventListener("mouseleave", scrollCoinsList);
coinsList === null || coinsList === void 0 ? void 0 : coinsList.addEventListener("touchend", scrollCoinsList);
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        scrollCoins();
    }, scrollDelay);
});
