import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ProjectImageUpload from "./ProjectImageUpload";
import TechnologyInput from "./TechnologyInput";

/*
|--------------------------------------------------------------------------
| URL validation
|--------------------------------------------------------------------------
|
| Matches the backend:
| - Maximum 2048 characters
| - Valid URL required
| - HTTP / HTTPS only
|
*/

const urlSchema = z
  .string()
  .trim()
  .max(2048, "URL cannot exceed 2048 characters")
  .url("Please provide a valid URL")
  .refine(
    (value) => {
      try {
        const url = new URL(value);

        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    },
    {
      message: "URL must use HTTP or HTTPS",
    },
  );

/*
|--------------------------------------------------------------------------
| Optional URL
|--------------------------------------------------------------------------
|
| The backend accepts optional URLs and normalizes empty values.
| The frontend keeps "" for the input so the field remains controlled.
|
*/

const optionalUrlSchema = z.union([urlSchema, z.literal("")]).optional();

/*
|--------------------------------------------------------------------------
| Project validation schema
|--------------------------------------------------------------------------
|
| These rules intentionally mirror the backend createProjectSchema.
|
*/

const projectSchema = z.object({
  /*
   * Title
   */
  title: z
    .string()
    .trim()
    .min(2, "Project title must be at least 2 characters")
    .max(100, "Project title cannot exceed 100 characters"),

  /*
   * Backend minimum is 10 characters.
   */
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(250, "Short description cannot exceed 250 characters"),

  /*
   * Backend minimum is 20 characters.
   */
  description: z
    .string()
    .trim()
    .min(20, "Project description must be at least 20 characters")
    .max(5000, "Project description cannot exceed 5000 characters"),

  /*
   * Backend:
   * - minimum 1
   * - maximum 30 technologies
   * - each technology 1-50 characters
   */
  technologies: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Technology cannot be empty")
        .max(50, "Technology cannot exceed 50 characters"),
    )
    .min(1, "At least one technology is required")
    .max(30, "A project cannot contain more than 30 technologies"),

  /*
   * Backend minimum is 2 characters.
   */
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category cannot exceed 50 characters"),

  /*
   * Primary image.
   *
   * New project:
   * File | null
   *
   * Edit project:
   * Existing Cloudinary URL | File | null
   */
  image: z.union([z.instanceof(File), z.string(), z.null()]).optional(),

  /*
   * Optional external URLs.
   */
  githubUrl: optionalUrlSchema,

  liveUrl: optionalUrlSchema,

  /*
   * Featured status.
   */
  featured: z.boolean(),

  /*
   * Backend enum.
   */
  status: z.enum(["completed", "in-progress", "planned"], {
    message: "Please select a valid project status",
  }),

  /*
   * Backend requires a non-negative integer.
   */
  order: z
    .number({
      message: "Order must be a number",
    })
    .int("Order must be an integer")
    .min(0, "Order cannot be negative"),
});

/*
|--------------------------------------------------------------------------
| Default values
|--------------------------------------------------------------------------
*/

const defaultValues = {
  title: "",
  shortDescription: "",
  description: "",
  technologies: [],
  category: "",
  image: null,
  githubUrl: "",
  liveUrl: "",
  featured: false,
  status: "completed",
  order: 0,
};

/*
|--------------------------------------------------------------------------
| Project Form
|--------------------------------------------------------------------------
*/

const ProjectForm = ({
  initialValues = null,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create project",
}) => {
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: "onSubmit",
  });

  /*
  |--------------------------------------------------------------------------
  | Populate form when editing
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!initialValues) {
      form.reset(defaultValues);
      return;
    }

    const existingImage =
      typeof initialValues.image === "string"
        ? initialValues.image
        : initialValues.image?.url || null;

    form.reset({
      title: initialValues.title || "",

      shortDescription: initialValues.shortDescription || "",

      description: initialValues.description || "",

      technologies: Array.isArray(initialValues.technologies)
        ? initialValues.technologies
        : [],

      category: initialValues.category || "",

      image: existingImage,

      githubUrl: initialValues.githubUrl || "",

      liveUrl: initialValues.liveUrl || "",

      featured: Boolean(initialValues.featured),

      status: initialValues.status || "completed",

      order:
        typeof initialValues.order === "number"
          ? initialValues.order
          : Number(initialValues.order) || 0,
    });
  }, [initialValues, form]);

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (values) => {
    /*
     * Normalize values before sending them to the page/controller.
     */
    const normalizedValues = {
      ...values,

      title: values.title.trim(),

      shortDescription: values.shortDescription.trim(),

      description: values.description.trim(),

      technologies: values.technologies.map((technology) => technology.trim()),

      category: values.category.trim(),

      /*
       * Convert empty optional URLs to null.
       * This matches backend optional URL normalization.
       */
      githubUrl: values.githubUrl?.trim() || null,

      liveUrl: values.liveUrl?.trim() || null,

      featured: Boolean(values.featured),

      order: Number(values.order),
    };

    onSubmit?.(normalizedValues);
  };

  /*
  |--------------------------------------------------------------------------
  | Invalid form handler
  |--------------------------------------------------------------------------
  */

  const handleInvalid = (errors) => {
    console.error("PROJECT VALIDATION FAILED:", errors);

    const firstError = Object.values(errors)[0];

    const message =
      firstError?.message || "Please fix the validation errors and try again.";

    toast.error(message);

    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
      form.setFocus(firstErrorField);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
        className="space-y-8"
      >
        {/* -----------------------------------------------------------------
            Basic Information
        ------------------------------------------------------------------ */}

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Basic information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Core information visitors will see about this project.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Title */}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project title</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Portfolio Management System"
                      maxLength={100}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    A clear and professional project name.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Description */}

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short description</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="A modern full-stack portfolio platform..."
                      maxLength={250}
                      className="min-h-24 resize-y"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    10–250 characters. Used in project cards and previews.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Description */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full description</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Describe the project, its purpose, architecture, important features, and implementation..."
                      maxLength={5000}
                      className="min-h-48 resize-y"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    20–5000 characters. Shown on the project details page.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category + Order */}

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Web Development"
                        maxLength={50}
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display order</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        disabled={isSubmitting}
                        value={field.value}
                        onChange={(event) => {
                          const value = event.target.value;

                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                      />
                    </FormControl>

                    <FormDescription>
                      Lower numbers appear first.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            Project Image
        ------------------------------------------------------------------ */}

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Project image</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload the main image used for this project.
            </p>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProjectImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* -----------------------------------------------------------------
            Technologies
        ------------------------------------------------------------------ */}

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Technologies</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add the technologies, frameworks, and tools used in this project.
            </p>
          </div>

          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technology stack</FormLabel>

                <FormControl>
                  <TechnologyInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>

                <FormDescription>
                  Add 1–30 technologies. Each technology can contain up to 50
                  characters.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* -----------------------------------------------------------------
            Project Links
        ------------------------------------------------------------------ */}

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Project links</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Optional external links visitors can use to explore the project.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* GitHub */}

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>

                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://github.com/username/project"
                      maxLength={2048}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Live URL */}

            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>

                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      maxLength={2048}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* -----------------------------------------------------------------
            Featured
        ------------------------------------------------------------------ */}

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Project visibility</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Projects are always public. Featured status controls whether this
              project appears in featured sections.
            </p>
          </div>

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true);
                    }}
                    disabled={isSubmitting}
                  />
                </FormControl>

                <div className="space-y-1">
                  <FormLabel>Featured project</FormLabel>

                  <FormDescription>
                    Highlight this project in featured sections.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </section>

        {/* -----------------------------------------------------------------
            Project State
        ------------------------------------------------------------------ */}

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">Project state</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Describe the current development state of the project.
            </p>
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Development status</FormLabel>

                <FormControl>
                  <select
                    {...field}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="completed">Completed</option>

                    <option value="in-progress">In Progress</option>

                    <option value="planned">Planned</option>
                  </select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* -----------------------------------------------------------------
            Actions
        ------------------------------------------------------------------ */}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
