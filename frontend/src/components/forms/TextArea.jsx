function TextArea({
    label,
    name,
    placeholder,
    value,
    onChange,
    required = false
}) {
    return (
        <div className="form-group">

            <label>
                {label} {required && "*"}
            </label>

            <textarea
                name={name}
                rows="5"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>
    );
}

export default TextArea;