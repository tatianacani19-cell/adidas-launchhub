import { useState, useMemo, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import MainLayout from "../components/layout/MainLayout";
import CalendarHeader from "../components/calendar/CalendarHeader";
import UpcomingEvents from "../components/calendar/UpcomingEvents";
import CalendarLegend from "../components/calendar/CalendarLegend";

import api from "../services/api";

import "../styles/calendar.css";

const STATUS_COLORS = {
    Draft: { bg: "#FEE2E2", color: "#991B1B" },
    Launch: { bg: "#DCFCE7", color: "#166534" },
    Review: { bg: "#FEF9C3", color: "#92400E" },
    Approve: { bg: "#DBEAFE", color: "#1E40AF" },
    Due: { bg: "#FEE2E2", color: "#991B1B" },
    Meeting: { bg: "#F3F4F6", color: "#374151" },
};

function Calendar() {

    const [currentView, setCurrentView] = useState("dayGridMonth");
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    async function loadEvents() {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/calendar");
            setEvents(response.data);
        } catch (err) {
            console.error("Error loading calendar events:", err);
            setError("Failed to load calendar data.");
        } finally {
            setLoading(false);
        }
    }

    const styledEvents = useMemo(() => {
        return events.map((event) => {
            const style = STATUS_COLORS[event.extendedProps.status] || STATUS_COLORS.Meeting;
            return {
                id: event.id,
                title: event.title,
                start: event.start,
                backgroundColor: style.bg,
                textColor: style.color,
                borderColor: "transparent",
                extendedProps: event.extendedProps,
            };
        });
    }, [events]);

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

    if (loading) {
        return (
            <MainLayout title="Calendar">
                <div className="calendar-status" aria-busy="true">Loading calendar...</div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout title="Calendar">
                <div className="calendar-status">
                    <p>{error}</p>
                    <button onClick={loadEvents}>Retry</button>
                </div>
            </MainLayout>
        );
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
                        events={styledEvents}
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
                    <UpcomingEvents events={events} />
                    <CalendarLegend />
                </div>

            </div>

        </MainLayout>
    );
}

export default Calendar;
