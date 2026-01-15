const graphContainer = document.getElementById("graphContainer");
const USER_ID = graphContainer.dataset.userId || null;

let graph1Initialized = false;
let graph2Initialized = false;

// -------------------------------
// Graf 1: Vrijeme učenja po predmetu
// -------------------------------
async function drawGraphBySubject(timeframe = "day") {
  try {
    const res = await fetch("/graph/first", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: USER_ID }),
    });

    const data = await res.json();

    const layout = {
      title: {
        text: "Učenje kroz vrijeme",
        font: { size: 18 },
      },
      autosize: true,
      margin: { t: 50, l: 50, r: 20, b: 80 },
      xaxis: {
        title: "Predmet",
        automargin: true,
        tickfont: { size: 11 },
      },
      yaxis: {
        title: "Minute",
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    };

    if (!graph1Initialized) {
      Plotly.newPlot("graph1", data[timeframe], layout, { responsive: true });
      graph1Initialized = true;
    } else {
      Plotly.react("graph1", data[timeframe], layout);
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------
// Graf 2: Učenje kroz vrijeme
// -------------------------------
async function drawStudyOverTime(timeframe = "week") {
  try {
    const res = await fetch("/graph/second", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: USER_ID }),
    });

    const data = await res.json();

    const layout = {
      title: {
        text: "Učenje kroz vrijeme",
        font: { size: 18 },
      },
      autosize: true,
      margin: { t: 50, l: 50, r: 20, b: 80 },
      xaxis: {
        title: "Datum",
        tickangle: -45,
        automargin: true,
        tickfont: { size: 11 },
      },
      yaxis: {
        title: "Minute",
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    };

    if (!graph2Initialized) {
      Plotly.newPlot("graph2", data[timeframe], layout, { responsive: true });
      graph2Initialized = true;
    } else {
      Plotly.react("graph2", data[timeframe], layout);
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------
// Timeframe select (day / week / month)
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("timeframe");
  if (!select) return console.warn("Nema #timeframe selecta u HTML-u");

  function updateGraphs() {
    const timeframe = select.value;

    drawGraphBySubject(timeframe);

    if (timeframe === "day") {
      document.getElementById("graph2").style.display = "none";
    } else {
      document.getElementById("graph2").style.display = "block";
      drawStudyOverTime(timeframe);
    }
  }

  // inicijalni prikaz
  updateGraphs();

  select.addEventListener("change", updateGraphs);
});
