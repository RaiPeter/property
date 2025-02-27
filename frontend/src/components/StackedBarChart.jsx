import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./StackedBarChart.css"

const data = [
  { month: "Jan", income: 4000, expenses: -2000 },
  { month: "Feb", income: 3000, expenses: -1500 },
  { month: "Mar", income: 5000, expenses: -2500 },
  { month: "Apr", income: 4500, expenses: -3000 },
  { month: "May", income: 5700, expenses: -2720 },
  { month: "Jun", income: 6000, expenses: -3200 },
  { month: "Jul", income: 4200, expenses: -2800 },
  { month: "Aug", income: 4800, expenses: -2100 },
  { month: "Sep", income: 5300, expenses: -2900 },
  { month: "Oct", income: 4600, expenses: -2300 },
  { month: "Nov", income: 4000, expenses: -1900 },
  { month: "Dec", income: 5200, expenses: -2600 }
];

const StackedBarChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 750 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand().domain(data.map(d => d.month)).range([0, width]).padding(0.3);
    const y = d3
      .scaleLinear()
      .domain([d3.min(data, d => d.expenses), d3.max(data, d => d.income)])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal().domain(["income", "expenses"]).range(["#66c2a5", "#fc8d62"]);

    // Axes
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      // .style("background", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.3)")
      .style("display", "none");

    // Bars with animation and tooltips
    svg.selectAll(".bar.income")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar income")
      .attr("x", d => x(d.month))
      .attr("y", height)
      .attr("height", 0)
      .attr("width", x.bandwidth())
      .attr("fill", color("income"))
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(`<strong>${d.month}</strong><br>Income: $${d.income}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition()
      .duration(800)
      .attr("y", d => y(d.income))
      .attr("height", d => y(0) - y(d.income));

    svg.selectAll(".bar.expenses")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar expenses")
      .attr("x", d => x(d.month))
      .attr("y", height)
      .attr("height", 0)
      .attr("width", x.bandwidth())
      .attr("fill", color("expenses"))
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(`<strong>${d.month}</strong><br>Expenses: $${Math.abs(d.expenses)}`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition()
      .duration(800)
      .attr("y", y(0))
      .attr("height", d => y(d.expenses) - y(0));
  }, []);

  return (
    <div className="stackedbar" style={{ position: "relative" }}>
      <h4>Income analytics</h4>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StackedBarChart;
