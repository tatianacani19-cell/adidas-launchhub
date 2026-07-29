import { useState, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import MainLayout from "../components/layout/MainLayout";
import CalendarHeader from "../components/calendar/CalendarHeader";
import UpcomingEvents from "../components/calendar/UpcomingEvents";
import CalendarLegend from "../components/calendar/CalendarLegend";

import calendarEvents from "../data/calendarEvents";

import "../styles/calendar.css";

const STATUS_COLORS = {
    Launch: { bg: "#DCFCE7", color: "#166534" },
    Review: { bg: "#FEF9C3", color: "#92400E" },
    Approve: { bg: "#DBEAFE", color: "#1E40AF" },
    Due: { bg: "#FEE2E2", color: "#991B1B" },
    Meeting: { bg: "#F3F4F6", color: "#374151" },
};

function Calendar() {

    const [currentView, setCurrentView] = useState("dayGridMonth");
    const calendarRef = useRef(null);

    const events = useMemo(() => {
        return calendarEvents.map((event) => {
            const style = STATUS_COLORS[event.status] || STATUS_COLORS.Meeting;
            return {
                id: event.id,
                title: event.title,
                date: event.date,
                backgroundColor: style.bg,
                textColor: style.color,
                borderColor: "transparent",
                extendedProps: {
                    market: event.market,
                    status: event.status,
                },
            };
        });
    }, []);

    function handleToday() {
        calendarRef.current?.getApi().today();
    }

    function handlePrev() {
        calendarRef.current?.getApi().prev();
    }

    function handleNext() {
        calendarRef.current?.getApi().next();
    }

    function handleViewChange(view) {
        calendarRef.current?.getApi().changeView(view);
        setCurrentView(view);
    }

    function handleEventClick(info) {
        info.jsEvent.preventDefault();
        const { title, extendedProps } = info.event;
        alert(`${title}\nMarket: ${extendedProps.market}\nStatus: ${extendedProps.status}`);
    }

    return (
        <MainLayout title="Calendar">

            <CalendarHeader
                onToday={handleToday}
                onPrev={handlePrev}
                onNext={handleNext}
                currentView={currentView}
                onViewChange={handleViewChange}
            />

            <div className="calendar-layout">

                <div className="calendar-main">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={false}
                        events={events}
                        eventClick={handleEventClick}
                        height="auto"
                        dayMaxEvents={3}
                        nowIndicator={true}
                        buttonText={{
                            today: "Today",
                            month: "Month",
                            week: "Week",
                            list: "List",
                        }}
                    />
                </div>

                <div className="calendar-sidebar">
                    <UpcomingEvents events={calendarEvents} />
                    <CalendarLegend />
                </div>

            </div>

        </MainLayout>
    );
}

export default Calendar;
