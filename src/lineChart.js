let coinId = "bitcoin";
let myChart;

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
  const coinText = coinElement.querySelector(".coin-name").textContent;

  coinId = coins.find((coin) => coin.name === coinText).id;

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
  coinData = await fetchCoins(coinId);
  for (let i = 0; i < coinData.length; i++) {
    const date = new Date(coinData[i].time);
    price = coinData[i].priceUsd;
    data.push({ x: date, y: price });
  }

  return data;
}

function chart(data) {
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
