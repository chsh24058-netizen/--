import { useState } from "react";
import iris from "../iris.json";

const convertData = (input) => {
    const species = Array.from(new Set(input.map(({ species }) => species)));

    return species.map((species) => {
        return {
            id: species,
            data: input
                .filter((item) => item.species === species)
                .map(({ sepalLength: sL, sepalWidth: sW, petalLength: pL, petalWidth: pW }) => ({sL, sW, pL, pW})),
        };
    });
};

const findMax = (data, target) => {
    let max = data[0].data[0][target];

    data.map((item) =>
        item.data.map((d) => {
            if (max < d[target]) {
                max = d[target];
            }
        })
    );

    return max;
};

const findMin = (data, target) => {
    let min = data[0].data[0][target];

    data.map((item) =>
        item.data.map((d) => {
            if (min > d[target]) {
                min = d[target];
            }
        })
    );

    return min;
};



export default function App() {

    const [xTarget, setXTarget] = useState("sL");
    const [yTarget, setYTarget] = useState("sW");

    const width = 800;
    const height = 800;
    const r = 5;
    const mark = 10;

    let color;

    const data = convertData(iris);

    const stepMap = {
        sL: 0.5,
        sW: 0.2,
        pL: 0.5,
        pW: 0.2
    };

    const stepX = stepMap[xTarget];
    const stepY = stepMap[yTarget];

    const minX = Math.floor(findMin(data, xTarget) / stepMap[xTarget]) * stepMap[xTarget];
    const minY = Math.floor(findMin(data, yTarget) / stepMap[yTarget]) * stepMap[yTarget];
    const maxX = Math.ceil(findMax(data, xTarget) / stepMap[xTarget]) * stepMap[xTarget];
    const maxY = Math.ceil(findMax(data, yTarget) / stepMap[yTarget]) * stepMap[yTarget];

    const magX = 400 / (maxX - minX);
    const magY = 400 / (maxY - minY);


    const labels = {
        sL: "sepal length",
        sW: "sepal width",
        pL: "petal length",
        pW: "petal width"
    };

    const [visible, setVisible] = useState({
        setosa: true,
        versicolor: true,
        virginica: true
    });

    const toggleSpecies = (name) => {
        setVisible({
            ...visible,
            [name]: !visible[name]
        });
    };

    return (
        <div>
            <div style={{backgroundColor: "#3f88c5", color: "white", padding: "20px", margin: 0}}>
                <h1 style={{ margin: 0 }}>
                    scatter plot of iris data
                </h1>
            </div>

            <div style={{backgroundColor: "#eae8e8", padding: "15px", display: "flex", justifyContent: "space-between"}}>
                <div>
                    <h2 style={{ fontSize:"15px" }}>
                        x property
                    </h2>

                    <select value={xTarget} onChange={(e) => setXTarget(e.target.value)} style={{ fontSize: "15px", padding: "10px" }}>
                        <option value="sL">sepal length</option>
                        <option value="sW">sepal width</option>
                        <option value="pL">petal length</option>
                        <option value="pW">petal width</option>
                    </select>
                </div>

                <div>
                    <h2 style={{ fontSize:"15px" }}>
                        y property
                    </h2>

                    <select value={yTarget} onChange={(e) => setYTarget(e.target.value)} style={{ fontSize: "15px", padding: "10px" }}>
                        <option value="sL">sepal length</option>
                        <option value="sW">sepal width</option>
                        <option value="pL">petal length</option>
                        <option value="pW">petal width</option>
                    </select>
                </div>
            </div>

            <svg width={width} height={height}>
                <g transform="translate(50,50)">
                    <line x1={0} y1={0} x2={0} y2={400} stroke="black" />
                    <line x1={0} y1={400} x2={400} y2={400} stroke="black" />
                    <g transform="translate(0,400)">
                        {Array.from({length: Math.floor((maxX - minX) / stepX) + 1},(_, i) => {
                            const value = minX + i * stepX;
                            return (
                                <g key={i} transform={`translate(${(value - minX) * magX},0)`}>
                                    <line x1={0} y1={0} x2={0} y2={mark} stroke="black"/>
                                    <text y={30} textAnchor="middle">
                                        {value.toFixed(1)}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                    {Array.from({length: Math.floor((maxY - minY) / stepY) + 1},(_, i) => {
                        const value = minY + i * stepY;
                        return (
                            <g key={i} transform={`translate(0,${400 - (value - minY) * magY})`}>
                                <line x1={0} y1={0} x2={-mark} y2={0} stroke="black"/>
                                <text x={-15} y={5} textAnchor="end">
                                    {value.toFixed(1)}
                                </text>
                            </g>
                        );
                    })}
                    {data.map((item) => {
                        if (item.id === "setosa") {
                            color = "mediumseagreen";
                        } else if (item.id === "versicolor") {
                            color = "plum";
                        } else if (item.id === "virginica") {
                            color = "sandybrown";
                        }
                       
                        return item.data.map((d, i) => (
                            <circle key={i} cx={(d[xTarget] - minX) * magX} cy={400 - (d[yTarget] - minY) * magY} r={r} fill={color} opacity={visible[item.id] ? 1 : 0} style={{transition: "all 0.8s"}}/>
                        ));
                    })}

                    <g transform="translate(420,0)">
                        <g onClick={() => toggleSpecies("setosa")} style={{ cursor: "pointer" }}>
                            <rect width={15} height={15} fill="mediumseagreen" opacity={visible["setosa"] ? 1 : 0.5}/>
                            <text x={20} y={10} fontSize={15} opacity={visible["setosa"] ? 1 : 0.5}>setosa</text>
                        </g>
                        <g onClick={() => toggleSpecies("versicolor")} style={{ cursor: "pointer" }}>
                            <rect y={30} width={15} height={15} fill="plum" opacity={visible["versicolor"] ? 1 : 0.5}/>
                            <text x={20} y={40} fontSize={15} opacity={visible["versicolor"] ? 1 : 0.5}>versicolor</text>
                        </g>
                        <g onClick={() => toggleSpecies("virginica")} style={{ cursor: "pointer" }}>
                            <rect y={60} width={15} height={15} fill="sandybrown" opacity={visible["virginica"] ? 1 : 0.5}/>
                            <text x={20} y={70} fontSize={15} opacity={visible["virginica"] ? 1 : 0.5}>virginica</text>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}