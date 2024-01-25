async function fetchCoins() {
  try {
    const response = await fetch(
      "https://api.coincap.io/v2/assets/bitcoin/history?interval=m1"
    );
    const { data } = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const coinData = await fetchCoins();
  console.log(coinData[0].priceUsd);

  const data = [];
  let prev = 100;
  for (let i = 0; i < coinData.length; i++) {
    const date = new Date(coinData[i].time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes}`;
    prev = coinData[i].priceUsd;
    data.push({ x: date, y: prev });
  }

  console.log(data);

  const totalDuration = 10000;
  const delayBetweenPoints = totalDuration / data.length;
  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1].getProps(["y"], true).y;

  const ctx = document.getElementById("myChart");
  new Chart(ctx, {
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
});
