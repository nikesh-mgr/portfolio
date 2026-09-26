
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { projectSchema } from "@/utils/projectForm";

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

const ProjectForm = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save project",
}) => {
  const form = useForm({
    resolver: zodResolver(projectSchema),

    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      technologies: [],
      category: "",
      image: null,
      githubUrl: "",
      liveUrl: "",
      featured: false,
      published: false,
      status: "completed",
      order: 0,
    },
  });

  useEffect(() => {
    if (!initialValues) {
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
      published: Boolean(initialValues.published),

      status: initialValues.status || "completed",

      order:
        typeof initialValues.order === "number"
          ? initialValues.order
          : Number(initialValues.order) || 0,
    });
  }, [initialValues, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        {/* Basic Information */}
        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Basic information
            </h2>

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
                      className="min-h-24 resize-y"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Keep this short. It is used in project cards
                    and previews.
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
                      placeholder="Describe the project, its purpose, architecture, and important features..."
                      className="min-h-48 resize-y"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Detailed project information shown on the
                    project details page.
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
                        disabled={isSubmitting}
                        value={field.value}
                        onChange={(event) => {
                          const value = event.target.value;

                          field.onChange(
                            value === "" ? 0 : Number(value),
                          );
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

        {/* Project Image */}
        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Project image
            </h2>

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

        {/* Technologies */}
        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Technologies
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add the technologies, frameworks, and tools used
              in this project.
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

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Project Links */}
        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Project links
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add external links visitors can use to explore
              the project.
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

        {/* Publishing */}
        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Publishing
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Control whether this project is highlighted on
              your portfolio.
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
                  <FormLabel>
                    Featured project
                  </FormLabel>

                  <FormDescription>
                    Highlight this project in featured sections.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 rounded-lg border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel>Published project</FormLabel>
                  <FormDescription>Show this project on your portfolio.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </section>

        {/* Project State */}
        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Project state
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Describe the current development state of the
              project.
            </p>
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Development status
                </FormLabel>

                <FormControl>
                  <select
                    {...field}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="completed">
                      Completed
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="planned">
                      Planned
                    </option>
                  </select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
