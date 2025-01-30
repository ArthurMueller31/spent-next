"use client";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";

export default function Charts() {
  const varA = "Giassi";
  return (
    <div className="flex h-screen font-raleway tracking-wide">
      <main className="flex-1 ml-64 md:ml-0 flex items-center justify-center bg-gray-50 p-4">
        <div className="w-fit max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
                area: true,
                color: "#1d1e22"
              }
            ]}
            width={500}
            height={300}
          />
        </div>
        <div className="w-fit max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: `${varA}` },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" }
                ]
              }
            ]}
            width={400}
            height={200}
          />
        </div>
        <div className="w-fit max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] }
            ]}
            height={290}
            width={400}
            xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>
      </main>
    </div>
  );
}
