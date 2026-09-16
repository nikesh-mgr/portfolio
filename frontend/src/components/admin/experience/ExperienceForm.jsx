import { useEffect, useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import CompanyLogoUploader from "./CompanyLogoUploader";

const employmentTypes = [
  {
    value: "full-time",
    label: "Full-time",
  },
  {
    value: "part-time",
    label: "Part-time",
  },
  {
    value: "internship",
    label: "Internship",
  },
  {
    value: "freelance",
    label: "Freelance",
  },
  {
    value: "contract",
    label: "Contract",
  },
  {
    value: "self-employed",
    label: "Self-employed",
  },
];

const emptyForm = {
  company: "",
  position: "",
  location: "",
  employmentType: "full-time",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  responsibilities: [""],
  technologies: [""],
  companyUrl: "",
  featured: false,
  order: 0,
  companyLogo: null,
};

const normalizeDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

const normalizeExperience = (experience) => ({
  company: experience?.company || "",
  position: experience?.position || "",
  location: experience?.location || "",
  employmentType: experience?.employmentType || "full-time",
  startDate: normalizeDate(experience?.startDate),
  endDate: normalizeDate(experience?.endDate),
  current: Boolean(experience?.current),
  description: experience?.description || "",
  responsibilities:
    experience?.responsibilities?.length > 0
      ? experience.responsibilities
      : [""],
  technologies:
    experience?.technologies?.length > 0 ? experience.technologies : [""],
  companyUrl: experience?.companyUrl || "",
  featured: Boolean(experience?.featured),
  order: experience?.order ?? 0,
  companyLogo: null,
});

const inputClassName =
  "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClassName = "mb-1.5 block text-sm font-medium";

const ExperienceForm = ({
  experience = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [form, setForm] = useState(
    experience ? normalizeExperience(experience) : emptyForm,
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(experience ? normalizeExperience(experience) : emptyForm);
  }, [experience]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const addArrayItem = (field) => {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((current) => {
      const values = current[field].filter(
        (_, itemIndex) => itemIndex !== index,
      );

      return {
        ...current,
        [field]: values.length ? values : [""],
      };
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.company.trim()) {
      nextErrors.company = "Company name is required.";
    }

    if (!form.position.trim()) {
      nextErrors.position = "Position is required.";
    }

    if (!form.startDate) {
      nextErrors.startDate = "Start date is required.";
    }

    if (!form.current && form.endDate && form.startDate) {
      if (new Date(form.endDate) < new Date(form.startDate)) {
        nextErrors.endDate = "End date cannot be before start date.";
      }
    }

    if (form.companyUrl) {
      try {
        const url = new URL(form.companyUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          nextErrors.companyUrl = "URL must use HTTP or HTTPS.";
        }
      } catch {
        nextErrors.companyUrl = "Please provide a valid URL.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      ...form,
      company: form.company.trim(),
      position: form.position.trim(),
      location: form.location.trim() || null,
      description: form.description.trim() || null,
      companyUrl: form.companyUrl.trim() || null,
      endDate: form.current ? null : form.endDate || null,
      responsibilities: form.responsibilities
        .map((item) => item.trim())
        .filter(Boolean),
      technologies: form.technologies
        .map((item) => item.trim())
        .filter(Boolean),
      order: Number(form.order) || 0,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold">Position details</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Basic information about this experience.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="company" className={labelClassName}>
              Company <span className="text-destructive">*</span>
            </label>

            <input
              id="company"
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="e.g. ABC Technologies"
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.company && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.company}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="position" className={labelClassName}>
              Position <span className="text-destructive">*</span>
            </label>

            <input
              id="position"
              value={form.position}
              onChange={(event) => updateField("position", event.target.value)}
              placeholder="e.g. Full Stack Developer"
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.position && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.position}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="employmentType" className={labelClassName}>
              Employment type
            </label>

            <select
              id="employmentType"
              value={form.employmentType}
              onChange={(event) =>
                updateField("employmentType", event.target.value)
              }
              className={inputClassName}
              disabled={isSubmitting}
            >
              {employmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className={labelClassName}>
              Location
            </label>

            <input
              id="location"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="e.g. Kathmandu, Nepal"
              className={inputClassName}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold">Employment period</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Define when you started and whether this position is current.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="startDate" className={labelClassName}>
              Start date <span className="text-destructive">*</span>
            </label>

            <input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(event) => updateField("startDate", event.target.value)}
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.startDate && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className={labelClassName}>
              End date
            </label>

            <input
              id="endDate"
              type="date"
              value={form.endDate}
              onChange={(event) => updateField("endDate", event.target.value)}
              className={inputClassName}
              disabled={isSubmitting || form.current}
            />

            {errors.endDate && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
          <input
            type="checkbox"
            checked={form.current}
            onChange={(event) => {
              const current = event.target.checked;

              setForm((previous) => ({
                ...previous,
                current,
                endDate: current ? "" : previous.endDate,
              }));
            }}
            disabled={isSubmitting}
            className="mt-0.5 size-4"
          />

          <span>
            <span className="block text-sm font-medium">
              I currently work here
            </span>

            <span className="mt-1 block text-xs text-muted-foreground">
              The end date will be cleared when enabled.
            </span>
          </span>
        </label>
      </section>

      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold">Experience content</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Describe your work and the technologies you used.
          </p>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>

          <textarea
            id="description"
            rows={6}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Briefly describe your role and impact..."
            className={`${inputClassName} resize-y`}
            disabled={isSubmitting}
          />

          <p className="mt-1.5 text-xs text-muted-foreground">
            Maximum 3000 characters.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Responsibilities</label>

              <p className="mt-1 text-xs text-muted-foreground">
                Add your main responsibilities.
              </p>
            </div>

            <button
              type="button"
              onClick={() => addArrayItem("responsibilities")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {form.responsibilities.map((item, index) => (
              <div key={`responsibility-${index}`} className="flex gap-2">
                <input
                  value={item}
                  onChange={(event) =>
                    updateArrayItem(
                      "responsibilities",
                      index,
                      event.target.value,
                    )
                  }
                  placeholder={`Responsibility ${index + 1}`}
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  onClick={() => removeArrayItem("responsibilities", index)}
                  disabled={isSubmitting}
                  aria-label={`Remove responsibility ${index + 1}`}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Technologies</label>

              <p className="mt-1 text-xs text-muted-foreground">
                Technologies, frameworks, or tools used.
              </p>
            </div>

            <button
              type="button"
              onClick={() => addArrayItem("technologies")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {form.technologies.map((item, index) => (
              <div key={`technology-${index}`} className="flex gap-2">
                <input
                  value={item}
                  onChange={(event) =>
                    updateArrayItem("technologies", index, event.target.value)
                  }
                  placeholder={`Technology ${index + 1}`}
                  className={inputClassName}
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  onClick={() => removeArrayItem("technologies", index)}
                  disabled={isSubmitting}
                  aria-label={`Remove technology ${index + 1}`}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold">Company information</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Optional company website and branding.
          </p>
        </div>

        <div>
          <label htmlFor="companyUrl" className={labelClassName}>
            Company URL
          </label>

          <input
            id="companyUrl"
            type="url"
            value={form.companyUrl}
            onChange={(event) => updateField("companyUrl", event.target.value)}
            placeholder="https://example.com"
            className={inputClassName}
            disabled={isSubmitting}
          />

          {errors.companyUrl && (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.companyUrl}
            </p>
          )}
        </div>

        <CompanyLogoUploader
          value={form.companyLogo}
          existingUrl={experience?.companyLogo?.url || null}
          onChange={(file) => updateField("companyLogo", file)}
          onRemove={() => updateField("companyLogo", null)}
          disabled={isSubmitting}
        />
      </section>

      <section className="space-y-5">
        <div>
          <h3 className="text-base font-semibold">Display settings</h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
              disabled={isSubmitting}
              className="mt-0.5 size-4"
            />

            <span>
              <span className="block text-sm font-medium">
                Featured experience
              </span>

              <span className="mt-1 block text-xs text-muted-foreground">
                Highlight this experience on the public portfolio.
              </span>
            </span>
          </label>

          <div>
            <label htmlFor="order" className={labelClassName}>
              Display order
            </label>

            <input
              id="order"
              type="number"
              min="0"
              step="1"
              value={form.order}
              onChange={(event) => updateField("order", event.target.value)}
              className={inputClassName}
              disabled={isSubmitting}
            />

            <p className="mt-1.5 text-xs text-muted-foreground">
              Lower values appear first.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : experience
              ? "Update Experience"
              : "Create Experience"}
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;
