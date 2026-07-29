function TextInput({
    label,
    name,
    type = "text",
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

            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>
    );
}

export default TextInput;