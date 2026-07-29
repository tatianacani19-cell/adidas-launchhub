function SelectInput({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false
}) {
    return (
        <div className="form-group">

            <label>
                {label} {required && "*"}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>

        </div>
    );
}

export default SelectInput;