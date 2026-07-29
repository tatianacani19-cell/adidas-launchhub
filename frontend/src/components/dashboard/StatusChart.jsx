import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";

import "../../styles/dashboard.css";

const data = [
    { name: "Draft", value: 4 },
    { name: "In Review", value: 3 },
    { name: "Approved", value: 7 },
    { name: "Published", value: 12 },
];

const COLORS = [
    "#D6D6D6",
    "#BFBFBF",
    "#9E9E9E",
    "#6F6F6F",
];

function StatusChart() {

    const total = data.reduce(
        (sum, item) => sum + item.value,
        0
    );

    return (
        <div className="dashboard-card">

            <div className="card-header">
                <h3>Launches by Status</h3>
            </div>

            <div className="chart-wrapper">

                <ResponsiveContainer
                    width={230}
                    height={230}
                >
                    <PieChart>

                        <Pie
                            data={data}
                            innerRadius={65}
                            outerRadius={95}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index]}
                                />
                            ))}
                        </Pie>

                    </PieChart>
                </ResponsiveContainer>

                <div className="chart-center">
                    <h2>{total}</h2>
                    <span>Total</span>
                </div>

                <div className="chart-legend">

                    {data.map((item, index) => (

                        <div key={item.name}>

                            <span
                                className="legend-dot"
                                style={{
                                    background: COLORS[index]
                                }}
                            />

                            {item.name} ({item.value})

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default StatusChart;