import React, { useState } from "react";
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
import { Card } from "flowbite-react";
import { TrackedBet, Tracker } from "@/types";
import { dateFormat, transformChartData } from "@/utils";
import { Dropdown } from "flowbite-react";

ChartJS.register(
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
      text: "Profit",
    },
  },
  scales: {
    x: {
      display: true,
      type: "time",
      time: {
        parser: "MM/dd/yyyy hh:mm",
        tooltipFormat: "MM/dd/yyyy hh:mm",
        unit: "day",
        unitStepSize: 1,
        displayFormats: {
          day: "MM/dd/yyyy",
        },
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};

export function ChartLoader({ d }: { d: TrackedBet[] }) {
  const [chartLength, setChartLength] = useState<
    "monthly" | "allTime" | "yearly"
  >("monthly");
  var p = transformChartData(d);
  var labels = p[chartLength + "Dates"];
  console.log(p);
  const data = {
    labels,
    datasets: [
      {
        label: "Profit",
        data: p[chartLength + "Profits"],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className="max-w-screen-sm">
        <Card>
            <Dropdown label={chartLength}>
                <Dropdown.Header>
                <Dropdown.Item onClick={() => setChartLength("allTime")}>
                    All Time
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setChartLength("monthly")}>
                    Monthly
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setChartLength("yearly")}>
                    Yearly
                </Dropdown.Item>
                </Dropdown.Header>
            </Dropdown>

            <Line options={options} data={data} />
        </Card>
    </div>
   
  );
}
