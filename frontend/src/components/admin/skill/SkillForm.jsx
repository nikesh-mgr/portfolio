import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Code2, Loader2, Save } from "lucide-react";

const defaultValues = {
  name: "",
  category: "frontend",
  proficiency: 80,
  icon: "",
  description: "",
  featured: false,
  order: 0,
  isActive: true,
};

const categories = [
  {
    value: "frontend",
    label: "Frontend",
  },
  {
    value: "backend",
    label: "Backend",
  },
  {
    value: "database",
    label: "Database",
  },
  {
    value: "devops",
    label: "DevOps",
  },
  {
    value: "tools",
    label: "Tools",
  },
  {
    value: "other",
    label: "Other",
  },
];

const SkillForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (!initialData) {
      reset(defaultValues);
      return;
    }

    reset({
      name: initialData.name || "",
      category: initialData.category || "frontend",
      proficiency: initialData.proficiency ?? 80,
      icon: initialData.icon || "",
      description: initialData.description || "",
      featured: initialData.featured ?? false,
      order: initialData.order ?? 0,
      isActive: initialData.isActive ?? true,
    });
  }, [initialData, reset]);

  const submitForm = async (data) => {
    await onSubmit({
      ...data,
      proficiency: Number(data.proficiency),
      order: Number(data.order),
      icon: data.icon || null,
      description: data.description || null,
    });
  };

  const inputClassName =
    "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10";

  const labelClassName = "mb-2 block text-sm font-medium";

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <section className="rounded-xl border bg-card p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/30">
            <Code2 className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Skill Information</h2>

            <p className="text-xs text-muted-foreground">
              Add the technology and your level of proficiency.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClassName}>
              Skill name
            </label>

            <input
              id="name"
              {...register("name", {
                required: "Skill name is required",
                minLength: {
                  value: 2,
                  message: "Skill name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Skill name cannot exceed 50 characters",
                },
              })}
              placeholder="React"
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className={labelClassName}>
              Category
            </label>

            <select
              id="category"
              {...register("category", {
                required: "Category is required",
              })}
              className={inputClassName}
              disabled={isSubmitting}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="mt-1 text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="proficiency" className={labelClassName}>
              Proficiency
            </label>

            <div className="flex gap-3">
              <input
                id="proficiency"
                type="number"
                min="0"
                max="100"
                {...register("proficiency", {
                  required: "Proficiency is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Minimum proficiency is 0",
                  },
                  max: {
                    value: 100,
                    message: "Maximum proficiency is 100",
                  },
                })}
                className={inputClassName}
                disabled={isSubmitting}
              />

              <span className="flex h-10 items-center text-sm text-muted-foreground">
                %
              </span>
            </div>

            {errors.proficiency && (
              <p className="mt-1 text-xs text-destructive">
                {errors.proficiency.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="icon" className={labelClassName}>
              Icon name
            </label>

            <input
              id="icon"
              {...register("icon")}
              placeholder="FaReact"
              className={inputClassName}
              disabled={isSubmitting}
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Optional React Icons component name.
            </p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClassName}>
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "Description cannot exceed 500 characters",
                },
              })}
              placeholder="Describe how you use this technology..."
              className="w-full resize-y rounded-lg border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              disabled={isSubmitting}
            />

            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Display Settings</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="order" className={labelClassName}>
              Display order
            </label>

            <input
              id="order"
              type="number"
              min="0"
              {...register("order", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Order cannot be negative",
                },
              })}
              className={inputClassName}
              disabled={isSubmitting}
            />

            {errors.order && (
              <p className="mt-1 text-xs text-destructive">
                {errors.order.message}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
            <input
              type="checkbox"
              {...register("featured")}
              disabled={isSubmitting}
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-medium">Featured</p>

              <p className="text-xs text-muted-foreground">
                Highlight this skill.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
            <input
              type="checkbox"
              {...register("isActive")}
              disabled={isSubmitting}
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-medium">Active</p>

              <p className="text-xs text-muted-foreground">
                Show this skill publicly.
              </p>
            </div>
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {initialData ? "Save changes" : "Create skill"}
        </button>
      </div>
    </form>
  );
};

export default SkillForm;
