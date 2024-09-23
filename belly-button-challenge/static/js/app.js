// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
      let sampleNumber = metadata.filter( metaSample=> metaSample.id == sample);


    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let labels = Object.entries(sampleNumber[0]).forEach(([key, value])=>
    panel.append('h6').text(`${key.toUpperCase()}: ${value}`));
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleNumber = samples.filter(metaSample => metaSample.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleNumber[0].otu_ids;
    let otu_labels = sampleNumber[0].otu_labels;
    let sample_values = sampleNumber[0].sample_values

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Jet',
      } 
    }];

    let bubbleLayout = {
      title: {
        text: 'Bacteria Cultures Per Sample'
    },
    xaxis: {
      title: 'OTU ID'
    },
    yaxis: {
      title: 'Number of Bacteria'
    }};

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otuArray=[];
    otu_ids.map(item =>{
      otuArray.push("OTU "+ item)
    });

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: otuArray.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h',
      type: 'bar',
    }];

    let barLayout = {
      title: {
        text: 'Top 10 Bacteria Cultures Found'
      },
      xaxis: {
        title: 'Number of Bacteria'
      }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the names field
    // Get the first sample from the list
    let firstSample = data.names[0];
    // console.log(firstSample);
    
    // Use d3 to select the dropdown with id of `#selDataset`
    let selectTag = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    let options = data.samples.filter(selectOptions => selectOptions.id == firstSample);
    data.names.forEach((id)=> selectTag.append('option').text(id));

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();
