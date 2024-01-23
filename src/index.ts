const API_URL = "https://api.coincap.io/v2/assets";

const coinsList = document.querySelector(".coins-list");

async function fetchCoinData(): Promise<Coin[]> {
  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return [];
  }
}

interface Coin {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

function renderCoins(coins: Coin[]): void {
  coins.forEach((coin) => {
    const coinElement = createCoinElement(coin);
    coinsList?.appendChild(coinElement);
  });
}

function createCoinElement(coin: Coin): HTMLElement {
  const coinElement = document.createElement("article");
  const arrowDirection = coin.changePercent24Hr.includes("-") ? "down" : "up";

  const logoUrl = `https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLocaleLowerCase()}`;

  coinElement.classList.add("coin-info");
  coinElement.classList.add(arrowDirection);
  coinElement.innerHTML = `<img class="coin-logo" src=${logoUrl}></img>
  <div class="coin-title">
  <span>${coin.name}</span>
      <span class="coin-symbol">${coin.symbol}</span>
    </div>
    <div class="percentage-arrow">
    <span></span>
    <span></span>
    </div>
    <div class="change-percent">
      <span>${Number(coin.changePercent24Hr).toFixed(2)}%</span>
    </div>
    <div class="current-price">$${Number(coin.priceUsd).toFixed(2)}</div>`;
  return coinElement;
}

async function init(): Promise<void> {
  const coinData = await fetchCoinData();
  renderCoins(coinData);
}

init();

let direction: number = 1;
let speed: number = 1;
let velocity: number = 1;
let delayTime: number = 2000;

function scrollCoins() {
  if (coinsList) {
    setInterval(() => {
      console.log(direction * speed * velocity);
      coinsList.scrollBy(0, direction * speed * velocity);

      if (
        coinsList.scrollTop >=
        coinsList.scrollHeight - coinsList.clientHeight
      ) {
        setTimeout(() => {
          direction = -1;
        }, delayTime);
      } else if (coinsList.scrollTop === 0) {
        setTimeout(() => {
          direction = 1;
        }, delayTime);
      }
    }, 15);
  }
}

function handleScroll(e, newVelocity: number = 0) {
  if (e.target.classList.contains("coins-list")) e.stopPropagation();
  if (newVelocity === 0) {
    velocity = newVelocity;
  } else {
    setTimeout(() => {
      velocity = newVelocity;
    }, delayTime);
  }
}

coinsList?.addEventListener("mouseover", (e) => handleScroll(e, 0));
coinsList?.addEventListener("touchmove", (e) => handleScroll(e, 0));
coinsList?.addEventListener("mouseleave", (e) => handleScroll(e, 1));
coinsList?.addEventListener("touchend", (e) => handleScroll(e, 1));

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    scrollCoins();
  }, 1000);
});
