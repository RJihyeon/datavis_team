class ProtectionChart {
  constructor() {
    this.ref = document.createElement("div");
    this.protection = [];
  }

  loadData() {
    d3.csv(
      "data/domestic_violence/경찰청_가정폭력 피해자 보호조치 현황_20221231_utf8.csv"
    )
      .then((loadedData) => {
        const parsedData = loadedData.map((d) => ({
          year: +d.연도,
          emergencyMeasure2: +d["응급조치 2호(보호기관)"],
          emergencyMeasure3: +d["응급조치 3호(의료기관)"],
          urgentTemporaryMeasure: +d.긴급임시조치,
          temporaryMeasureApplication: +d["임시조치 신청"],
        }));
        console.log(parsedData);
        this.protection = parsedData;
        this.drawChart();
      })
      .catch((e) => {
        console.error(e, "error");
      });
  }

  drawChart() {
    if (!this.protection.length) return;

    const width = 500;
    const height = 500;
    const marginTop = 20;
    const marginRight = 50;
    const marginBottom = 30;
    const marginLeft = 50;

    const svg = d3
      .select(this.ref)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const x = d3
      .scaleBand()
      .domain(this.protection.map((d) => d.year))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this.protection, (d) =>
          Math.max(
            d.emergencyMeasure2,
            d.emergencyMeasure3,
            d.urgentTemporaryMeasure,
            d.temporaryMeasureApplication
          )
        ),
      ])
      .nice()
      .range([height - marginBottom, marginTop]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .attr("class", "protection-x-axis")
      .selectAll(".tick text")
      .attr("class", "protection-x-text"); // Draw the x-axis

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .attr("class", "protection-y-axis")
      .selectAll(".tick text")
      .attr("class", "protection-y-text");

    //pointer 추가하기

    //자이제 포인터를 만들러 갈거예요
    //일단은 x,y,z를 만들어 줍니다.
    const points = [];
    this.protection.forEach((d) => {
      points.push([
        x(new Date(d.year)),
        y(d.emergencyMeasure2),
        "응급조치 2호(보호기관)",
      ]);
      points.push([
        x(new Date(d.year)),
        y(d.emergencyMeasure3),
        "응급조치 3호(의료기관)",
      ]);
      points.push([
        x(new Date(d.year)),
        y(d.urgentTemporaryMeasure),
        "긴급임시조치",
      ]);
      points.push([
        x(new Date(d.year)),
        y(d.temporaryMeasureApplication),
        "임시조치 신청",
      ]);
    });

    //그룹 생성하기
    const groups = d3.rollup(
      points,
      (v) => Object.assign(v, { z: v[0][2] }),
      (d) => d[2] //각 포인트의 카테고리 이름
    );

    // Draw the lines.
    const line = d3.line();
    const path = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#313e79")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(groups.values())
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", line);

    // Add an invisible layer for the interactive tip.
    const dot = svg.append("g").attr("display", "none");
    dot.append("circle").attr("r", 2.5);

    dot.append("text").attr("text-anchor", "middle").attr("y", -8);

    svg
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", (event) => event.preventDefault());
    return () => {
      svg
        .selectAll("*")
        .on("pointerenter", null)
        .on("pointermove", null)
        .on("pointerleave", null);
    };

    return svg.node();

    // When the pointer moves, find the closest point, update the interactive tip, and highlight
    // the corresponding line. Note: we don't actually use Voronoi here, since an exhaustive search
    // is fast enough.

    function pointermoved(event) {
      const [xm, ym] = d3.pointer(event);
      const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
      const [x, y, k] = points[i];
      path
        .style("stroke", ({ z }) => (z === k ? "#313e79" : "#ddd"))
        .filter(({ z }) => z === k)
        .raise();
      dot.attr("transform", `translate(${x},${y})`);
      dot.select("text").text(k);
      svg
        .property("value", this.protection[i])
        .dispatch("input", { bubbles: true });
    }

    function pointerentered() {
      path.style("mix-blend-mode", null).style("stroke", "#ddd");
      dot.attr("display", null);
    }

    function pointerleft() {
      path.style("mix-blend-mode", "multiply").style("stroke", "#313e79");
      dot.attr("display", "none");
      svg.node().value = null;
      svg.dispatch("input", { bubbles: true });
    }
  }

  render() {
    this.loadData();
    return this.ref;
  }
}
