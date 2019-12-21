let lamb = (dataset, anyname, widthInput, heightInput) => {
  return {

    init: () => {
      var svgWidth = widthInput;
      var svgHeight = heightInput;

      var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
      };

      var width = svgWidth - margin.left - margin.right;
      var height = svgHeight - margin.top - margin.bottom;

      // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
      var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", anyname);

      var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      // 2019-01-01
      var parseTime = d3.timeParse("%Y-%m-%d")

      // Import Data
      d3.json(dataset).then(function (StockDataRaw) {
        // console.log(StockDataRaw)

        let stockData = []

        Object.entries(StockDataRaw["Time Series (Daily)"]).forEach( entry => {
          // better = {
          //   date: new Date(),
          //   open: 0,
          //   low: 0,
          //   high: 0,
          //   close: 0,
          //   volume: 0,
          // }
          // console.log(entry[0]);
          // console.log(entry[1]["1. open"]);
          // console.log(entry[1]["3. low"]);
          // console.log(entry[1]["2. high"]);
          // console.log(entry[1]["4. close"]);
          // console.log(entry[1]["5. volume"]);

          let clean = {
            date: parseTime(entry[0]),
            open: parseFloat(entry[1]["1. open"]),
            low: parseFloat(entry[1]["3. low"]),
            high: parseFloat(entry[1]["2. high"]),
            close: parseFloat(entry[1]["4. close"]),
            volume: parseFloat(entry[1]["5. volume"])
          }
          // console.log (clean)
          stockData.push(clean)

          // var formatTime = d3.timeFormat("%Y,%B");
          // formatTime(new Date); // "June 30, 2015"
          // console.log(entry)
        });
        // // Step 1: Parse Data/Cast as numbers
        // // ==============================
        // hairData.forEach(function (data) {
        //   data.hair_length = +data.hair_length;
        //   data.num_hits = +data.num_hits;
        // });

        // // Step 2: Create scale functions
        // // ==============================
        // var xLinearScale = d3.scaleLinear()
        //   .domain([20, d3.max(hairData, d => d.hair_length)])
        //   .range([0, width]);

        // var yLinearScale = d3.scaleLinear()
        //   .domain([0, d3.max(hairData, d => d.num_hits)])
          // .range([height, 0]);

        // stockData
        var xTimeScale = d3.scaleTime()
        .domain(d3.extent(stockData, data => data.date))
        .range([0, width]);

        var yLinearScale = d3.scaleLinear()
        .domain([  d3.min(stockData, data => data.low - 1), d3.max(stockData, data => data.high)])
        .range([height, 0])

        var bottomAxis = d3.axisBottom(xTimeScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // var drawLine = d3.line()
        // .x(Stockdata => xTimeScale(data.date))
        // .y(Stockdata => yLinearScale(data.))

        chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

        chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
      
      let candleGroups = chartGroup.selectAll("g.candle")
        .data(stockData)
        .enter()
        .append("g")
        .classed("candle", true);
        
        // candleGroups.append("text").text( (d, i) => {
        //   console.log(d)
        //   return "Hi"
        // })

        // <circle cx=50 cy=20 r=3 fill="green" />
        // candleGroups.append("circle")
        // .attr("cx", d => xTimeScale(d.date))
        // .attr("cy", d => yLinearScale(d.high))
        // .attr("r", 3)
        // .attr("fill", "green");
        // candleGroups.append("circle")
        // .attr("cx", d => xTimeScale(d.date))
        // .attr("cy", d => yLinearScale(d.low))
        // .attr("r", 3)
        // .attr("fill", "red");

        // <line x1=50 y1=20 x2=50 y2=88 stroke="gray" stroke-width=3 />
        candleGroups.append("line")
        .attr("x1", d => xTimeScale(d.date))
        .attr("y1", d => yLinearScale(d.high))
        .attr("x2", d => xTimeScale(d.date))
        .attr("y2", d => yLinearScale(d.low))
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
      
        
        // <line x1=40 y1=67 x2=50 y2=67 stroke="gray" stroke-width=3 />
        // <line x1=60 y1=45 x2=50 y2=45 stroke="gray" stroke-width=3 />
      
        let c = 7;
        candleGroups.append("line")
        .attr("x1", d => xTimeScale(d.date) - c)
        .attr("y1", d => yLinearScale(d.open))
        .attr("x2", d => xTimeScale(d.date))
        .attr("y2", d => yLinearScale(d.open))
        .attr("stroke", "gray")
        .attr("stroke-width", 1)

        candleGroups.append("line")
        .attr("x1", d => xTimeScale(d.date) + c)
        .attr("y1", d => yLinearScale(d.close))
        .attr("x2", d => xTimeScale(d.date))
        .attr("y2", d => yLinearScale(d.close))
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        // // Step 3: Create axis functions
        // // ==============================
        // var bottomAxis = d3.axisBottom(xLinearScale);
        // var leftAxis = d3.axisLeft(yLinearScale);

        // // Step 4: Append Axes to the chart
        // // ==============================
        // chartGroup.append("g")
        //   .attr("transform", `translate(0, ${height})`)
        //   .call(bottomAxis);

       // chartGroup.append("g")
        //   .call(leftAxis);

        // // Step 5: Create Circles
        // // ==============================
        // var circlesGroup = chartGroup.selectAll("circle")
        //   .data(hairData)
        //   .enter()
        //   .append("circle")
        //   .attr("cx", d => xLinearScale(d.hair_length))
        //   .attr("cy", d => yLinearScale(d.num_hits))
        //   .attr("r", "15")
        //   .attr("fill", "pink")
        //   .attr("opacity", ".5");

        // // Step 6: Initialize tool tip
        // // ==============================
        // var toolTip = d3.tip()
        //   .attr("class", "tooltip")
        //   .offset([80, -60])
        //   .html(function (d) {
        //     return (`${d.rockband}<br>Hair length: ${d.hair_length}<br>Hits: ${d.num_hits}`);
        //   });

        // // Step 7: Create tooltip in the chart
        // // ==============================
        // chartGroup.call(toolTip);

        // // Step 8: Create event listeners to display and hide the tooltip
        // // ==============================
        // circlesGroup.on("click", function (data) {
        //   toolTip.show(data, this);
        //   d3.select(this).transition()
        //     .duration(500)
        //     .attr("fill", "black")
        //     .style("opacity", "1");
        // })
        //   // onmouseout event
        //   .on("mouseout", function (data, index) {
        //     toolTip.hide(data);
        //     d3.select(this)
        //       .attr("fill", "pink").style("opacity", "0.5");
        //   });

        // // Create axes labels
        // chartGroup.append("text")
        //   .attr("transform", "rotate(-90)")
        //   .attr("y", 0 - margin.left + 40)
        //   .attr("x", 0 - (height / 2))
        //   .attr("dy", "1em")
        //   .attr("class", "axisText")
        //   .text("Number of Billboard 100 Hits");

        // chartGroup.append("text")
        //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        //   .attr("class", "axisText")
        //   .text("Hair Metal Band Hair Length (inches)");
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}
let render = () => {
//   d3.select("#bob-ross").remove();
//   let hair1 = lamb("hairData2.csv", "bob-ross", window.innerWidth, window.innerHeight);
//   hair1.init();
//   d3.select("#bob-ross-child").remove();
//   let hair2 = lamb("hairData.csv", "bob-ross-child", window.innerWidth, window.innerHeight);
//   hair2.init();
    d3.select('#luna').remove(); 
    let luna= lamb("luna-small.json", "luna", window.innerWidth, window.innerHeight);
    // let luna= lamb("luna.json", "luna", div.innerWidth, div.innerWidth / 2);
    luna.init()
}
window.addEventListener("resize", render);
render();




