import { FormField, TextAreaField } from "./SettingsFormFields";

const SeoSettings = ({
  seo,
  validationErrors,
  updateNestedField,
  onKeywordsChange,
}) => {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-semibold">Search engine optimization</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure metadata used by search engines and social previews.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <FormField
          label="Meta title"
          value={seo.metaTitle}
          onChange={(value) => updateNestedField("seo", "metaTitle", value)}
          placeholder="John Doe — Full Stack Developer"
          maxLength={70}
          error={validationErrors.metaTitle}
        />

        <TextAreaField
          label="Meta description"
          value={seo.metaDescription}
          onChange={(value) =>
            updateNestedField("seo", "metaDescription", value)
          }
          placeholder="Full Stack Developer building modern web applications..."
          maxLength={160}
          rows={4}
          error={validationErrors.metaDescription}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">Keywords</label>

          <input
            type="text"
            value={seo.keywords.join(", ")}
            onChange={(event) => onKeywordsChange(event.target.value)}
            placeholder="react, node.js, mongodb, full stack developer"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Separate keywords using commas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeoSettings;
