data = [280,45,133];
    
    // An example of the data used by stacked and grouped charts
    //data = [[1,5,6], [4,5,3], [7,8,9]]

    new RGraph.Bar({
        id: 'cvs',
        data: data,
        options: {
            xaxisLabels: ['Richard', 'Alex', 'Nick'],
            marginLeft: 45,
            backgroundGrid: true,
            colors: ['red']
        }
    }).draw();