import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";

import "../../styles/dashboard.css";

const COLORS = [
    "#D6D6D6",
    "#BFBFBF",
    "#9E9E9E",
    "#6F6F6F",
];

function StatusChart({ stats }) {

    const data = [
        { name: "Draft", value: stats.draft },
        { name: "In Review", value: stats.inReview },
        { name: "Approved", value: stats.approved },
        { name: "Published", value: stats.published },
    ];

    return (
        <div className="dashboard-card">

            <div className="card-header">
                <h3>Launches by Status</h3>
            </div>

            <div className="chart-wrapper">

                <ResponsiveContainer
                    width={180}
                    height={180}
                >
                    <PieChart>

                        <Pie
                            data={data}
                            innerRadius={50}
                            outerRadius={75}
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
                    <h2>{stats.total}</h2>
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