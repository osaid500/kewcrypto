let coinId = "bitcoin";
let myChart;

const chartButtons = document.querySelectorAll("#chart-button");

async function fetchCoins() {
  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${coinId}/history?interval=m1`
    );
    const { data } = await response.json();

    // if the data returned is empty, throw an error
    if (data.length === 0) {
      alert(
        `Sorry, we couldn't retrieve data for '${coinId}' analytics at the moment. Please try again later.`
      );
      throw new Error(`Data retrieval for '${coinId}' analytics failed.`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return [];
  }
}

async function handleListClick(e) {
  const coinElement = e.target.closest(".coin-info");

  // return if user didn't click on any coin element
  if (!coinElement) return;

  const coinText = coinElement.querySelector(".coin-name").textContent;
  const selectedCoin = coins.find((coin) => coin.name === coinText);

  updateChartTop(selectedCoin.name, selectedCoin.priceUsd);

  coinId = selectedCoin.id;
  const newData = await prepareChartData();

  // set the data to an empty array
  myChart.config.data.datasets[0].data = [];
  myChart.update();

  // update the data
  myChart.config.data.datasets[0].data = newData;
  myChart.update();
}

function handleChartButton(e) {
  console.log(e.target.value);
}

coinsList.addEventListener("click", handleListClick);
chartButtons.forEach((button) =>
  button.addEventListener("click", handleChartButton)
);

async function prepareChartData() {
  let data = [];
  coinData = await fetchCoins(coinId);
  for (let i = 0; i < coinData.length; i++) {
    const date = new Date(coinData[i].time);
    price = coinData[i].priceUsd;
    data.push({ x: date, y: price });
  }

  return data;
}

function chart(data) {
  // animation
  const totalDuration = 4000;
  const delayBetweenPoints = totalDuration / data.length;
  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;

  // canvas
  const ctx = document.getElementById("myChart").getContext("2d");

  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#24243e");
  gradient.addColorStop(1, "#0f0c29");

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          backgroundColor: gradient,
          fill: true,
          borderColor: "#606470",
          borderWidth: 1,
          radius: 0,
          tension: 0.5,
          data: data,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,

      animation: {
        x: {
          type: "number",
          easing: "linear",
          duration: delayBetweenPoints,
          from: NaN, // the point is initially skipped
          delay(ctx) {
            if (ctx.type !== "data" || ctx.xStarted) {
              return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
        y: {
          type: "number",
          easing: "linear",
          duration: delayBetweenPoints,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== "data" || ctx.yStarted) {
              return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
      },
      interaction: {
        intersect: false,
      },
      plugins: {
        legend: false,
        tooltip: {
          callbacks: {
            label: (context) => {
              return `$${context.formattedValue}`;
            },
          },
          displayColors: false,
        },
      },
      scales: {
        x: {
          type: "time",
          ticks: {
            display: false,
          },
        },
        y: {
          ticks: {
            display: false,
          },
        },
      },
    },
  });
}

prepareChartData().then((data) => chart(data));
