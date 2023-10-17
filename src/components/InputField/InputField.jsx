import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

function InputField({
  label,
  onChange,
  value,
  helperText,
  multiline,
  disabled,
  styles,
  startIcon,
  endIcon,
  placeholder,
  minLength,
  type = "text",
  variant = "outlined",
  autoComplete = "off",
  name = "TextField",
  size = "small",
  id = "TextField",
  margin = "normal",
}) {
  return (
    <TextField
      id={id}
      name={name}
      size={size}
      label={label}
      variant={variant}
      type={type}
      fullWidth
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e, type)}
      margin={margin}
      autoComplete={autoComplete}
      helperText={helperText}
      error={helperText ? true : false}
      disabled={disabled}
      multiline={multiline || false}
      rows={4}
      InputProps={{
        inputProps: minLength ? { min: 0 } : {},
        startAdornment: startIcon && (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ),
      }}
      sx={{
        ...styles,
      }}
    />
  );
}

export default InputField;
