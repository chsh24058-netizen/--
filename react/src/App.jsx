const App = () => {
    const width = 400;
    const height = 400;
    const lineX = 100;
    const label = 10;
    const data = [
      {name:"A",width:250 ,height:30 ,verti:100,color:"orange"},
      {name:"B",width:200 ,height:30 ,verti:200,color:"purple"},
      {name:"C",width:100 ,height:30 ,verti:300,color:"pink"},
      {name:"D",width:180 ,height:30 ,verti:400,color:"blue"}
    ];

    return (
        <svg width={width} height={height}>
           <line x1={lineX} y1="0" x2={lineX} y2={height} stroke="black"/>
            {data.map((item, i) => (
                <g key={i}>
                    <line x1={lineX-label} y1={item.verti} x2={lineX} y2={item.verti} stroke="black" />
                    <rect x={lineX} y={item.verti-item.height/2} width={item.width} height={item.height} fill={item.color}/>
                    <text x={lineX-label-5} y={item.verti} textAnchor="end" dominantBaseline="middle">{item.name}</text>
                </g>
            ))}
        </svg>
    );
};

export default App;