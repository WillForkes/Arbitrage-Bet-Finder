import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "date-fns";
import { Line } from "react-chartjs-2";

import { TrackedBet, Tracker } from "@/types";

ChartJS.register(
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const labels = ["2022-11-01", "2022-11-02"];

export function ChartLoader({ d }: { d: TrackedBet[] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: d ? d.map((bet) => bet.profitPercentage * bet.totalStake) : null,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} />;
}
