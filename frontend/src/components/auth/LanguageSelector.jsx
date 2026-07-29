import { Globe } from "lucide-react";

function LanguageSelector() {
    return (
        <div className="language">
            <button type="button">
                <Globe size={18} />
                EN
            </button>
        </div>
    );
}

export default LanguageSelector;