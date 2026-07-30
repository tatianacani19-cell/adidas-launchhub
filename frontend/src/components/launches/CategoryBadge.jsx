function CategoryBadge({ category }) {
    return (
        <span
            style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                background: "#F3F4F6",
                color: "#4B5563",
                marginTop: 8,
            }}
        >
            {category}
        </span>
    );
}

export default CategoryBadge;
