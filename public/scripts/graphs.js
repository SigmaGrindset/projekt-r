const graphContainer = document.getElementById("graphContainer");
const USER_ID = graphContainer.dataset.userId || null;

let graph1Initialized = false;
let graph2Initialized = false;
let graph3Initialized = false;
let graph4Initialized = false;
let graph5Initialized = false;

// -------------------------------
// Graf 1: Vrijeme učenja po predmetu
// -------------------------------
async function drawGraphBySubject(timeframe) {
  try {
    const res = await fetch("/graph/first", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: USER_ID }),
    });

    const data = await res.json();
    let time = "";
    switch (timeframe) {
      case "day":
        time = "(zadnjih 24h)"
        break;
      case "week":
        time = "(zadnjih tjedan dana)"
        break
      case "month":
        time = "(zadnjih mjesec dana)"
      default:
        break;
    }

    const layout = {
      title: {
        text: "Učenje po predmetu " + time,
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
async function drawStudyOverTime(timeframe) {
  try {
    const res = await fetch("/graph/second", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: USER_ID }),
    });

    const data = await res.json();

    // ---------- PRELOM IMENA PREDMETA ZA LEGENDU ----------
    data[timeframe].forEach(trace => {
      trace.name = trace.name.replace(/ /g, "<br>");
    });

    let time = "";
    switch (timeframe) {
      case "day":
        time = "(zadnjih 24h)"
        break;
      case "week":
        time = "(zadnjih tjedan dana)"
        break
      case "month":
        time = "(zadnjih mjesec dana)"
      default:
        break;
    }

    const layout = {
      title: {
        text: "Učenje kroz vrijeme " + time,
        font: { size: 18 },
      },
      autosize: true,
      margin: { t: 50, l: 50, r: 240, b: 140 },
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
      legend: {
        x: 1,
        y: 1,
        xanchor: "left",
        yanchor: "top",
        font: { size: 12 },
        itemwidth: 70  
      }
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
// Graf 3: Učenje po danima u tjednu
// -------------------------------
async function drawStudyByDaysOfWeek() {
  try {
    const res = await fetch("/graph/third", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: USER_ID }),
    });

    const data = await res.json();

    const layout = {
      title: {
        text: "Učenje po danima u tjednu",
        font: { size: 18 },
      },
      autosize: true,
      margin: { t: 50, l: 50, r: 20, b: 80 },
      xaxis: {
        title: "Dan u tjednu",
        automargin: true,
      },
      yaxis: {
        title: "Minute",
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    };

    if (!graph3Initialized) {
      Plotly.newPlot("graph3", data, layout, { responsive: true });
      graph3Initialized = true;
    } else {
      Plotly.react("graph3", data, layout);
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------
// Graf 4: Učenje po satima u danu
// -------------------------------
async function drawStudyByHours() {
  try {
    const res = await fetch("/graph/fourth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: USER_ID }),
    });

    const data = await res.json();

    const layout = {
      title: {
        text: "Učenje po satima u danu",
        font: { size: 18 },
      },
      autosize: true,
      margin: { t: 50, l: 50, r: 20, b: 80 },
      xaxis: {
        title: "Sat",
        automargin: true,
      },
      yaxis: {
        title: "Minute",
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
    };

    if (!graph4Initialized) {
      Plotly.newPlot("graph4", data, layout, { responsive: true });
      graph4Initialized = true;
    } else {
      Plotly.react("graph4", data, layout);
    }
  } catch (err) {
    console.error(err);
  }
}

function getHeatmapClass(minutes) {
  if (minutes === 0) return "heat-day";
  if (minutes <= 30) return "heat-day lvl1";
  if (minutes <= 60) return "heat-day lvl2";
  if (minutes <= 120) return "heat-day lvl3";
  if (minutes <= 240) return "heat-day lvl4";
  if (minutes <= 360) return "heat-day lvl5";
  return "heat-day lvl6";
}

async function drawGithubActivity() {
  try {
    const res = await fetch("/graph/fifth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    const container = document.getElementById("graph5");
    if (!container) return;

    container.innerHTML = "";

    data.reverse();

    for (const day of data) {
      const div = document.createElement("div");
      div.className = getHeatmapClass(day.minutes);
      div.title = `${day.date}: ${day.minutes} min`;

      container.appendChild(div);
    }

    graph5Initialized = true;
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

    drawStudyByDaysOfWeek();
    drawStudyByHours();
    drawGithubActivity();
  }

  // inicijalni prikaz
  updateGraphs();

  select.addEventListener("change", updateGraphs);
});
