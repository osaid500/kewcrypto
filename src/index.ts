const API_URL = "https://api.coincap.io/v2/assets";

const coinsList = document.querySelector(".coins-list");
let coins: Coin[] = [];

async function fetchCoinData(): Promise<Coin[]> {
  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    coins = data;
    return coins;
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
  <span class="coin-name">${coin.name}</span>
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

function updateChartTop(title: string, price: string) {
  const chartTitleElement = document.querySelector("#chart-title");
  const chartPriceElement = document.querySelector("#chart-price");
  if (chartTitleElement && chartPriceElement) {
    // scroll to chart section
    window.scrollTo({ top: 0, behavior: "smooth" });

    chartTitleElement.textContent = title;

    chartPriceElement.textContent = parseFloat(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

async function init(): Promise<void> {
  const coinData = await fetchCoinData();
  updateChartTop(coins[0]?.name, coins[0]?.priceUsd);
  renderCoins(coinData);
}

init();

let direction: number = 1;
let speed: number = 1;
let velocity: number = 1;
let scrollDelay: number = 2000;

function scrollCoins() {
  if (coinsList) {
    setInterval(() => {
      coinsList.scrollBy(0, direction * speed * velocity);

      if (
        coinsList.scrollTop >=
        coinsList.scrollHeight - coinsList.clientHeight
      ) {
        setTimeout(() => {
          direction = -1;
        }, scrollDelay);
      } else if (coinsList.scrollTop === 0) {
        setTimeout(() => {
          direction = 1;
        }, scrollDelay);
      }
    }, 15);
  }
}

let scrollTimeoutId: number | undefined;

function stopScrollingCoinsList() {
  clearTimeout(scrollTimeoutId);
  velocity = 0;
}

function scrollCoinsList() {
  scrollTimeoutId = setTimeout(() => {
    velocity = 1;
  }, scrollDelay);
}

coinsList?.addEventListener("mouseover", stopScrollingCoinsList);
coinsList?.addEventListener("touchmove", stopScrollingCoinsList);
coinsList?.addEventListener("mouseleave", scrollCoinsList);
coinsList?.addEventListener("touchend", scrollCoinsList);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    scrollCoins();
  }, scrollDelay);
});
