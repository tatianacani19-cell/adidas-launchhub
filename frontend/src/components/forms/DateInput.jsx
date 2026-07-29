function DateInput({
    label,
    name,
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
                type="date"
                value={value}
                onChange={onChange}
            />

        </div>
    );
}

export default DateInput;