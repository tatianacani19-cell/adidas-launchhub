import "../../styles/dashboard.css";

function MarketChart({ byMarket }) {

    const markets = Object.entries(byMarket);
    const max = Math.max(...markets.map(([, count]) => count), 1);

    return (
        <div className="dashboard-card">

            <div className="card-header">
                <h3>Launches by Market</h3>
            </div>

            <div className="market-bars">

                {markets.map(([market, count]) => (
                    <div key={market} className="market-row">
                        <span className="market-label">{market}</span>
                        <div className="market-bar-track">
                            <div
                                className="market-bar-fill"
                                style={{ width: `${(count / max) * 100}%` }}
                            />
                        </div>
                        <span className="market-count">{count}</span>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default MarketChart;
