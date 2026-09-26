import { MapPin } from "lucide-react";

export const FormField = ({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  error,
  icon: Icon,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            Icon ? "pl-9" : ""
          } ${error ? "border-destructive" : ""}`}
        />
      </div>

      <div className="mt-1 flex justify-between gap-3">
        {error ? <p className="text-xs text-destructive">{error}</p> : <span />}

        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 5,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={`w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "border-destructive" : ""
        }`}
      />

      <div className="mt-1 flex justify-between gap-3">
        {error ? <p className="text-xs text-destructive">{error}</p> : <span />}

        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export const UrlField = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
}) => {
  return (
    <FormField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      icon={Icon}
    />
  );
};

export const SocialUrlField = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            error ? "border-destructive" : ""
          }`}
        />
      </div>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};

export const LocationField = (props) => {
  return <FormField {...props} icon={MapPin} />;
};
