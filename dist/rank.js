// target the single container and include one div for data-viz
const container = d3.select(".container");
// ! all visualization share the same SVG structure (although margin and height values are modified for the second viz, requiring less space)
// ! all viz benegit also from the same tooltip (although including different text values)

const margin = {
    top: 30,
    right: 20,
    bottom: 20,
    left: 240
};

const width = 500 - margin.left - margin.right,
    height = 4520 - margin.top - margin.bottom;

const tooltipR = container
    .append("div")
    .attr("id", "tooltipR")
    .style("opacity", 0);

// include in the div tooltip, two paragraphs to detail the information in two lines
tooltipR
    .append("p")
    .attr("class", "title");

tooltipR
    .append("p")
    .attr("class", "description");


// HORIZONTAL BAR CHART
// include a chart visualizing data regarding the number of licenses for different sport categories, and for hunting purposes
// structure the data in an array of objects detailing 1. category and 1. value

let dataLicenses = [];


d3.json("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.json", function(error, result) {
    if (error) throw error;
    

    result.forEach((ele)=>{ 
    
        let vac = ele.data.slice(-1)[0].total_vaccinations_per_hundred
        // let vac = ele.data.slice(-1)[0].people_fully_vaccinated_per_hundred

        if(vac !== undefined && vac <= 100 && ele.country !== "Saint Vincent and the Grenadines"){
            dataLicenses.push({category: ele.country, value: vac})
        }

    } )
    dataLicenses.sort(function(a, b) { return b.value - a.value ; });
    
    
    // include a section for the specific visualization
    const licenses = container
        .append("section");
    
    // include introductory heading and paragraph
    // licenses
    //     .append("h3")
    //     .text("Fully vaccinated ranking");
    
    // SVG
    // include the SVG and nested g element in which to plot the visualization
    const licensesSVG = licenses
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`, overflow="auto")
        // .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // SCALES
    // define scales based on the data
    
    // linear scale for the x axis, detailing the data values
    const licensesXScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataLicenses, (d) => d.value)])
        .range([0, width]);
    
    // band scale for the y-axis, with one band for data point
    const licensesYScale = d3
        .scaleBand()
        .domain(dataLicenses.map(dataLicense => dataLicense.category))
        .range([0, height]);
    
    
    // AXES
    // reducing the number of horizontal ticks



    const licensesXAxisTop = d3
        .axisTop(licensesXScale)
        .ticks(10);

    const licensesXAxis = d3
        .axisBottom(licensesXScale)
        .ticks(10);
    
    // removing the ticks for the vertical axis
    const licensesYAxis = d3
        .axisLeft(licensesYScale)
        .tickSize(0)
        .tickPadding(10);



    licensesSVG
        .append("g")
        .attr("class", `axis`)
        .attr("id", `x-axis`)
        .call(licensesXAxisTop);
        
    licensesSVG
        .append("g")
        .attr("class", `axis`)
        .attr("id", `x-axis`)
        .attr("transform", `translate(0, ${height})`)
        .call(licensesXAxis);
    
    licensesSVG
        .append("g")
        .attr("class", `axis`)
        .attr("id", `y-axis`)
        .call(licensesYAxis);
    
    // GRID LINES
    // include vertical grid lines with a line element for each horizontal tick
    licensesSVG
        .select("g#x-axis")
        .selectAll("g.tick")
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        // -height as the SVG syntax reasons top to bottom
        .attr("y2", -height)
        .style("opacity", 0.3);
    
    // FORMAT
    // include a formatting function for the number of licences (to show a comma every third digit)
    const formatThou = d3.format(",");
    
    // HORIZONTAL BARS
    // append a rect element for each data point
    licensesSVG
        .selectAll("rect")
        .data(dataLicenses)
        .enter()
        .append("rect")
        // on hover show the tooltip with information regarding the category and the actual number of licenses
        .on("mouseenter", (d, i) => {
            
            tooltipR
                .style("opacity", 1)
                // pageX and pageY allow to target where the cursor lies in a page taller than 100vh
                // slightly offset the position of the tooltip with respect to the cursor
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 10}px`);
            tooltipR
                .select("p.title")
                .text(() => `${d.category}`);
            tooltipR
                .select("p.description")
                .text(() => `Total Vaccinations: ${formatThou(d.value)}%`);
        })
        .on("mouseout", () => tooltipR.style("opacity", 0))
        // include two classes of the hunting category, to style it accordingly
        .attr("class", (d) => (d.category === "hunting") ? "bar accent" : "bar")
        // each rectangle starts from the left and its respective band
        .attr("x", 0)
        // vertically offset by a fourth of the band width as to center the bars (which have half the band width)
        .attr("y", (d) => licensesYScale(d.category) + licensesYScale.bandwidth()/4)
        // while the height is dicated by half the band width, the width is transitioned to the appropriate value represented by the data value
        .attr("height", licensesYScale.bandwidth()/2)
        .transition()
        .duration((d, i) => 2000 - 100 * i)
        .delay((d, i) => 900 + 100 * i)
        .attr("width", (d, i) => licensesXScale(d.value));

})    


