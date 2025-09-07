import './Overview.css'

const KPIS = [
    {label: "Items Total", value: "1,250"},
    {label: "Listed", value: "320"},
    {label: "Sold (30d)", value: "94"},
    {label: "Errors", value:"7"}
]
function LineChart() {
    return (
        <svg className="chart chart--line" viewBox="0 0 100 48" aria-hidden="true">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity="0.25" />
                    <stop offset="100%" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path className="chart__line" d="M0,30 C10,22 20,26 30,20 C40,24 50,16 60,22 C70,28 80,24 100,14" />
            <path className="chart__area" d="M0,30 C10,22 20,26 30,20 C40,24 50,16 60,22 C70,28 80,24 100,14 L100,48 L0,48 Z" fill="url(#g)" />
            <line x1="0" y1="47" x2="100" y2="47" className="chart__axis" />
        </svg>
    );
}
function Donut({ active = 78 }) {
    const r = 15.915, c = 2 * Math.PI * r;
    const arc = (active / 100) * c;
    return (
        <svg className="chart chart--donut" viewBox="0 0 36 36" aria-hidden="true">
            <circle className="donut__track" cx="18" cy="18" r={r} />
            <circle className="donut__value" cx="18" cy="18" r={r} strokeDasharray={`${arc} ${c-arc}`} />

        </svg>
    );
}

const Overview = () =>{

    return (
        <div className="middle-container">

            <div className="middle-container__toolbar">
                <div className="input input--search">
                    <span aria-hidden="true">🔍</span>
                    <input placeholder="Search" aria-label="Search"/>
                </div>
            </div>

            <header className="middle-container__header">
                <h1>Welcome back, Mike!</h1>
                <p className="muted">Tuesday, April 23</p>
            </header>

            <section className='kpis'>
                {KPIS.map(k=>(
                    <article key={k.label} className="card kpi">
                        <div className="kpi__label">{k.label}</div>
                        <div className="kpi__value">{k.value}</div>
                    </article>
                ))}
            </section>

            <section className="charts">
                <article className="card">
                    <div className="card__title">Sold Last 30 Days</div>
                    <LineChart />
                </article>
                <article className="card">
                    <div className="card__title">Listing Status</div>
                    <Donut active={78} />
                    <div className="legend">
                        <div className="legend-dot-part">
                            <span className="dot dot--primary" />
                            <span>Active</span>
                        </div>
                        <div className="legend-dot-part">
                            <span className="dot dot--muted" />
                            <span>Sold</span>
                        </div>
                    </div>
                </article>
            </section>

            <section className="grid-two">
                <article className="card">
                    <div className="card__title">To-Do</div>
                    <ul className="list list--checks">
                        <li>Drafts missing photos</li>
                        <li>Sync errors</li>
                        <li>Low stock</li>
                    </ul>
                </article>
                <article className="card">
                    <div className="card__title">Shortcuts</div>
                    <ul className="list list--shortcuts">
                        <li>➕ Add item</li>
                        <li>📦 Bulk List</li>
                        <li>📥 Import CSV</li>
                    </ul>
                    <div className="actions">
                        <button className="btn">Add item</button>
                        <button className="btn btn--ghost">Bulk List</button>
                    </div>
                </article>
            </section>


        </div>
    )


}

export default Overview