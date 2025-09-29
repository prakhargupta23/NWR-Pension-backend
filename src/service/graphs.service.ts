import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { writeFile } from "fs/promises";
import { join } from "path";

// Division color mapping
const DIVISION_COLORS: Record<string, string> = {
  "Jaipur": "#FF6F61",
  "Bikaner": "#6B5B95",
  "Ajmer": "#88B04B",
  "Jodhpur": "#FFA500",
  "Unknown": "#AAAAAA" // Fallback color
};



const FALLBACK_COLORS = [
  "#CCCCCC", "#999999", "#666666", "#333333", "#DDDDDD"
];

function getDivisionColors(labels: string[], opacity: number = 1): string[] {
  return labels.map((label, index) => {
    const baseColor = DIVISION_COLORS[label];
    const hex = baseColor || FALLBACK_COLORS[index % FALLBACK_COLORS.length];

    if (opacity === 1) return hex;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  });
}

// Setup chart canvas
const pieWidth = 800;
const pieHeight = 600;
const pieChartJSNodeCanvas = new ChartJSNodeCanvas({
  width: pieWidth,
  height: pieHeight,
  plugins: {
    modern: [ChartDataLabels],
  },
});




export async function generatePieChart(
  chartData: any[],
  title: string,
  valueField: string = "actualThisMonth",
  groupByField: string = "division"
) {
  const chartMap: { [key: string]: number } = {};

  for (const row of chartData) {
    const group = row[groupByField] || "Unknown";
    const amount = parseFloat(row[valueField]) || 0;
    chartMap[group] = (chartMap[group] || 0) + amount;
  }

  const labels = Object.keys(chartMap);
  const data = Object.values(chartMap);
  const total = data.reduce((sum, val) => sum + val, 0);

  const config = {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Contribution",
          data,
          backgroundColor: getDivisionColors(labels),
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 20 },
        },
        legend: {
          position: "right",
        },
        datalabels: {
          color: "#fff",
          formatter: (value: number, context: any) => {
            const label = context.chart.data.labels[context.dataIndex];
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}\n${percentage}%`;
          },
          font: {
            weight: "bold" as const,
            size: 14,
          },
        },
      },
    },
  };

  return await pieChartJSNodeCanvas.renderToBuffer(config as any);
}

const stackWidth = 1000;
const stackHeight = 600;
const stackChartJSNodeCanvas = new ChartJSNodeCanvas({
  width: stackWidth,
  height: stackHeight,
  plugins: {
    modern: [ChartDataLabels],
  },
});





export async function generateRecoverableStackedChart(
  rawData: any[],
  groupBy: "division" | "category",
  label: string
): Promise<Buffer> {
  const groups = [...new Set(rawData.map((d) => d[groupBy] || "Unknown"))];
  const types = ["DR", "BR"];

  const accretionDataset = types.map((type) => ({
    label: `Accretion - ${type}`,
    data: groups.map((group) =>
      rawData
        .filter((d) => d[groupBy] === group && d.type === type)
        .reduce((sum, d) => sum + (d.accretionUptoTheMonth || 0), 0)
    ),
    backgroundColor: groupBy === "division" 
      ? getDivisionColors(groups, type === "DR" ? 0.7 : 0.5)
      : type === "DR" 
        ? "rgba(54, 162, 235, 0.7)" 
        : "rgba(255, 159, 64, 0.7)",
    stack: type,
  }));

  const clearanceDataset = types.map((type) => ({
    label: `Clearance - ${type}`,
    data: groups.map((group) =>
      rawData
        .filter((d) => d[groupBy] === group && d.type === type)
        .reduce((sum, d) => sum + (d.clearanceUptoMonth || 0), 0)
    ),
    backgroundColor: groupBy === "division"
      ? getDivisionColors(groups, type === "DR" ? 0.4 : 0.3)
      : type === "DR" 
        ? "rgba(54, 162, 235, 0.4)" 
        : "rgba(255, 159, 64, 0.4)",
    stack: type,
  }));

  const config = {
    type: "bar",
    data: {
      labels: groups,
      datasets: [...accretionDataset, ...clearanceDataset],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: label,
          font: { size: 20 },
        },
        legend: {
          position: "top",
        },
        datalabels: {
          display: false,
        },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: groupBy === "division" ? "Division" : "Category",
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Amount",
          },
        },
      },
    },
  };

  return await stackChartJSNodeCanvas.renderToBuffer(config as any);
}





const barWidth = 1000;
const barHeight = 600;

const barChartJSNodeCanvas = new ChartJSNodeCanvas({
  width: barWidth,
  height: barHeight,
});
const smallbarChartJSNodeCanvas = new ChartJSNodeCanvas({
  width: 650,
  height: barHeight,
});



const fallbackCanvas = new ChartJSNodeCanvas({ width: 1, height: 1 });




export async function generateCombinedEarningsBarChart(
  earnings: any[],
  title: string,
  division: any
): Promise<Buffer> {
  const filtered = earnings.filter((e) => e.division === division);

  // Return empty 1x1 PNG if no data
  if (filtered.length === 0) {
    return fallbackCanvas.renderToBuffer({
      type: "bar",
      data: { labels: [], datasets: [] },
      options: { responsive: false },
    } as any);
  }
  const divisions = [...new Set(earnings.map((e) => e.division || "Unknown"))];

  const getTotal = (division: string, field: keyof (typeof earnings)[0]) =>
    filtered
      .filter((e) => e.division === division)
      .reduce((sum, e) => sum + (parseFloat(e[field] as any) || 0), 0);

  const targetCurrent = divisions.map((d) => getTotal(d, "targetThisMonth"));
  const actualCurrent = divisions.map((d) => getTotal(d, "actualThisMonth"));
  const targetYTD = divisions.map((d) => getTotal(d, "targetYTDThisMonth"));
  const actualYTD = divisions.map((d) => getTotal(d, "actualYTDThisMonth"));

  const config = {
    type: "bar",
    data: {
      labels: divisions,
      datasets: [
        {
          label: "Target - Current Month",
          data: targetCurrent,
          backgroundColor: getDivisionColors(divisions, 0.7),
        },
        {
          label: "Actual - Current Month",
          data: actualCurrent,
          backgroundColor: getDivisionColors(divisions, 0.5),
        },
        {
          label: "Target - YTD",
          data: targetYTD,
          backgroundColor: getDivisionColors(divisions, 0.3),
        },
        {
          label: "Actual - YTD",
          data: actualYTD,
          backgroundColor: getDivisionColors(divisions, 0.2),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 20 },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Division",
          },
        },
        y: {
          title: {
            display: true,
            text: "Earnings (₹)",
          },
        },
      },
    },
  };

  return await smallbarChartJSNodeCanvas.renderToBuffer(config as any);
}




export async function generateTargetVsActualBarChart(
  earnings: any[],
  title: string
): Promise<Buffer> {
  const divisions = [...new Set(earnings.map((e) => e.division || "Unknown"))];

  const targetData = divisions.map((division) =>
    earnings
      .filter((e) => (e.division || "Unknown") === division)
      .reduce((sum, e) => sum + (e.targetThisMonth || 0), 0)
  );

  const actualData = divisions.map((division) =>
    earnings
      .filter((e) => (e.division || "Unknown") === division)
      .reduce((sum, e) => sum + (e.actualThisMonth || 0), 0)
  );

  const config = {
    type: "bar",
    data: {
      labels: divisions,
      datasets: [
        {
          label: "Target",
          data: targetData,
          backgroundColor: getDivisionColors(divisions, 0.7),
        },
        {
          label: "Actual",
          data: actualData,
          backgroundColor: getDivisionColors(divisions, 0.4),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 20 },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Division",
          },
        },
        y: {
          title: {
            display: true,
            text: "Earnings",
          },
        },
      },
    },
  };

  return await barChartJSNodeCanvas.renderToBuffer(config as any);
}