let coinName = "bitcoin";
let myChart;

async function fetchCoins() {
  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${coinName}/history?interval=m1`
    );
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return [];
  }
}

async function handleListClick(e) {
  const coinElement = e.target.closest(".coin-info");
  coinName = coinElement.querySelector(".coin-name").textContent.toLowerCase();

  currentCoinName = coinName;

  const newData = await prepareChartData();
  // set the data to an empty array
  myChart.config.data.datasets[0].data = [];
  myChart.update();

  // update the data
  myChart.config.data.datasets[0].data = newData;
  myChart.update();
}

coinsList.addEventListener("click", handleListClick);

async function prepareChartData() {
  let data = [];
  coinData = await fetchCoins(coinName);
  for (let i = 0; i < coinData.length; i++) {
    const date = new Date(coinData[i].time);
    price = coinData[i].priceUsd;
    data.push({ x: date, y: price });
  }

  return data;
}

async function chart(data) {
  const totalDuration = 4000;
  const delayBetweenPoints = totalDuration / data.length;
  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;

  const ctx = document.getElementById("myChart");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          borderColor: "#73b9d7",
          borderWidth: 1,
          radius: 0,
          data: data,
        },
      ],
    },
    options: {
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
      },
      scales: {
        x: {
          type: "time",
        },
      },
    },
  });
}

prepareChartData().then((data) => chart(data));
