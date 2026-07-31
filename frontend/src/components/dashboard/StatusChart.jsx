import { useState } from "react";
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

const STATUS_COLORS = [
    "#FECACA",
    "#FEF08A",
    "#BBF7D0",
    "#BFDBFE",
];

function StatusChart({ stats, selectedStatus }) {

    const [hovered, setHovered] = useState(false);
    const [clickedIndex, setClickedIndex] = useState(null);

    const data = [
        { name: "Draft", value: stats.draft },
        { name: "In Review", value: stats.inReview },
        { name: "Approved", value: stats.approved },
        { name: "Published", value: stats.published },
    ];

    const selectedIndex = selectedStatus
        ? data.findIndex((d) => d.name === selectedStatus)
        : null;

    function getFill(index) {
        if (selectedIndex !== null) {
            return index === selectedIndex ? STATUS_COLORS[index] : COLORS[index];
        }
        return hovered ? STATUS_COLORS[index] : COLORS[index];
    }

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

                <div
                    className="chart-area"
                    onClick={(e) => {
                        if (!e.target.closest(".recharts-sector")) {
                            setClickedIndex(null);
                        }
                    }}
                >

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
                                onClick={(_, index) => setClickedIndex(index)}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={getFill(index)}
                                    />
                                ))}
                            </Pie>

                        </PieChart>
                    </ResponsiveContainer>

                    <div className="chart-center">
                        <h2>{stats.total}</h2>
                        <span>Total</span>
                    </div>

                    {clickedIndex !== null && (
                        <div className="chart-tooltip">
                            {data[clickedIndex].name}
                        </div>
                    )}

                </div>

                <div className="chart-legend">

                    {data.map((item, index) => (

                        <div key={item.name}>

                            <span
                                className="legend-dot"
                                style={{
                                    background: getFill(index)
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