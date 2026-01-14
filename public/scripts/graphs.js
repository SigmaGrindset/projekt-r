
const graphContainer = document.getElementById("graphContainer");
const USER_ID = graphContainer.dataset.userId || null;

// -------------------------------
// Graf 1: Vrijeme učenja po predmetu
// -------------------------------
async function drawGraphBySubject(timeframe = "day") {
  try {
    const res = await fetch("/graph/first", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: USER_ID })
    });
    if (!res.ok) throw new Error("Ne mogu dohvatiti podatke za graf 1");

    const data = await res.json();
    Plotly.newPlot("graph1", data[timeframe], {
      title: "Vrijeme učenja po predmetu",
      xaxis: { title: "Predmet" },
      yaxis: { title: "Minute" },
      margin: { t: 50 }
    });
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
      body: JSON.stringify({ id: USER_ID })
    });
    if (!res.ok) throw new Error("Ne mogu dohvatiti podatke za graf 2");

    const data = await res.json();
    Plotly.newPlot("graph2", data[timeframe], {
      title: "Učenje kroz vrijeme",
      xaxis: { title: "Datum" },
      yaxis: { title: "Minute" },
      margin: { t: 50 }
    });
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
      Plotly.purge("graph2"); // nema graf 2 za "day"
    } else {
      drawStudyOverTime(timeframe);
    }
  }

  // inicijalni prikaz
  updateGraphs();

  select.addEventListener("change", updateGraphs);
});
