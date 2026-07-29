import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

function CalendarHeader({ onToday, onPrev, onNext, currentView, onViewChange }) {

    const views = ["dayGridMonth", "timeGridWeek", "listWeek"];

    return (
        <div className="calendar-header">

            <div className="calendar-header-left">
                <h1>Calendar</h1>
            </div>

            <div className="calendar-header-center">

                <button className="cal-nav-btn" onClick={onToday}>
                    Today
                </button>

                <button className="cal-nav-btn" onClick={onPrev} aria-label="Previous">
                    <ChevronLeft size={18} />
                </button>

                <button className="cal-nav-btn" onClick={onNext} aria-label="Next">
                    <ChevronRight size={18} />
                </button>

                <div className="cal-view-toggle">
                    {views.map((view) => {
                        const labels = {
                            dayGridMonth: "Month",
                            timeGridWeek: "Week",
                            listWeek: "List",
                        };
                        return (
                            <button
                                key={view}
                                className={`cal-view-btn${currentView === view ? " active" : ""}`}
                                onClick={() => onViewChange(view)}
                            >
                                {labels[view]}
                            </button>
                        );
                    })}
                </div>

            </div>

            <div className="calendar-header-right">
                <CalendarDays size={20} />
            </div>

        </div>
    );
}

export default CalendarHeader;
