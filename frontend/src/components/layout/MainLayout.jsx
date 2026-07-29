import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../styles/layout.css";

function MainLayout({ children, title }) {
    return (
        <div className="layout">

            <Sidebar />

            <div className="layout-content">

                <Navbar title={title} />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default MainLayout;