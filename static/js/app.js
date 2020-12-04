function init(){
    d3.json("samples.json").then(function(data) {

        //create labels for json file data
        var names = data.names;
        var metadata = data.metadata;
        var samples = data.samples;


        //fill the dropdown menu
        names.forEach((name) =>{
            d3.select("#selDataset").append("option").text(name)
        });


        //set table to the 1st sample - id 940
        var sample_940 = samples[0];
        table_info = d3.select("#sample-metadata");
        Object.entries(metadata[0]).forEach(([key,value]) => table_info.append("h5").text(`${key}:${value}`));

        // barchart
        var barX = sample_940.sample_values.slice(0, 10).reverse();
        var barY = sample_940.otu_ids.slice(0,10).reverse().map(x => `OTU ${x}`);
        var barText = sample_940.otu_labels.slice(0, 10).reverse();
        var barTrace = {
            x: barX,
            y: barY,
            text: barText,
            type: "bar",
            orientation: "h"
        };
        var barData = [barTrace]
        Plotly.newPlot("bar", barData)


        //bubble chart 
        var bubX = sample_940.otu_ids;
        var bubY = sample_940.sample_values;
        var bubText = sample_940.otu_labels;
        var trace2 = {
            x: bubX,
            y: bubY,
            text: bubText,
            mode: 'markers',
            marker: {
                size: sample_940.sample_values,
                color: sample_940.otu_ids,
                colorscale: "Earth"
            }
        };
        var bubbleData = [trace2];
        Plotly.newPlot("bubble", bubbleData);

    })
}

function updateTable(subject){
    table_info = d3.select("#sample-metadata");

    table_info.html("");

    Object.entries(subject).forEach(([key,value]) => table_info.append("h5").text(`${key}:${value}`));
}

function updateBar(subject){
    
    var x = subject.sample_values.slice(0,10).reverse();
    var y = subject.otu_ids.slice(0,10).reverse().map(x => `OTU ${x}`);
    var labels = subject.otu_labels.slice(0,10).reverse();

    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
    Plotly.restyle("bar", "text", [labels]);
}

function updateBubble(subject){

    Plotly.restyle("bubble","x",[subject.otu_ids]);
    Plotly.restyle("bubble","y",[subject.sample_values]);
    Plotly.restyle("bubble","text",[subject.otu_labels]);
    Plotly.restyle("bubble","marker",[{color: subject.otu_ids, size: subject.sample_values, colorscale: "Earth"}]);
}

function optionChanged(value){
    d3.json("samples.json").then(function(data) {
        var metaData = data.metadata.filter(sampleData => sampleData.id == value)[0];
        var sample = data.samples.filter(sampleData => sampleData.id == value)[0];

        updateTable(metaData);
        updateBar(sample);
        updateBubble(sample);
    })
}


init();