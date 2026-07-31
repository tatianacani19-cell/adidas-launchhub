import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "../../styles/dashboard.css";

const COLORS = [
    "#D6D6D6",
    "#BFBFBF",
    "#9E9E9E",
    "#6F6F6F",
];

const STATUS_COLORS = [
    "#FECACA",
    "#FEF08A",
    "#BBF7D0",
    "#BFDBFE",
];

function StatusChart({ stats }) {

    const [hovered, setHovered] = useState(false);

    const data = [
        { name: "Draft", value: stats.draft },
        { name: "In Review", value: stats.inReview },
        { name: "Approved", value: stats.approved },
        { name: "Published", value: stats.published },
    ];

    return (
        <div
            className="dashboard-card status-chart-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >

            <div className="card-header">
                <h3>Launches by Status</h3>
            </div>

            <div className="chart-wrapper">

                <div className="chart-area">

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
                                        fill={hovered ? STATUS_COLORS[index] : COLORS[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                trigger="click"
                                cursor={false}
                                position={{ x: 165, y: 80 }}
                                content={({ active, payload }) => {
                                    if (!active || !payload || !payload.length) {
                                        return null;
                                    }
                                    return (
                                        <div className="chart-tooltip">
                                            {payload[0].name}
                                        </div>
                                    );
                                }}
                            />

                        </PieChart>
                    </ResponsiveContainer>

                    <div className="chart-center">
                        <h2>{stats.total}</h2>
                        <span>Total</span>
                    </div>

                </div>

                <div className="chart-legend">

                    {data.map((item, index) => (

                        <div key={item.name}>

                            <span
                                className="legend-dot"
                                style={{
                                    background: hovered ? STATUS_COLORS[index] : COLORS[index]
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