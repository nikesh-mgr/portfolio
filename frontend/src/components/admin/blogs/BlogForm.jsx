import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import BlogCoverImageUploader from "./BlogCoverImageUploader";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const blogFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Blog title must be at least 3 characters")
    .max(200, "Blog title cannot exceed 200 characters"),

  excerpt: z
    .string()
    .trim()
    .min(10, "Blog excerpt must be at least 10 characters")
    .max(300, "Blog excerpt cannot exceed 300 characters"),

  content: z
    .string()
    .trim()
    .min(20, "Blog content must be at least 20 characters")
    .max(100000, "Blog content cannot exceed 100000 characters"),

  category: z.string().trim().max(50, "Category cannot exceed 50 characters"),

  tags: z.string(),

  published: z.boolean(),

  readingTime: z.coerce
    .number()
    .int("Reading time must be a whole number")
    .min(1, "Reading time must be at least 1 minute")
    .max(120, "Reading time cannot exceed 120 minutes"),

  metaTitle: z
    .string()
    .trim()
    .max(70, "Meta title cannot exceed 70 characters"),

  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description cannot exceed 160 characters"),

  keywords: z.string(),

  canonicalUrl: z
    .string()
    .trim()
    .max(2048, "Canonical URL cannot exceed 2048 characters"),
});

const defaultValues = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  published: false,
  readingTime: 1,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
};

const BlogForm = ({
  initialValues = defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Blog",
}) => {
  const [coverImage, setCoverImage] = useState({
    file: null,
    preview: null,
    existingUrl: null,
    remove: false,
  });

  const form = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const existingCoverUrl = initialValues?.coverImage?.url || null;

    setCoverImage({
      file: null,
      preview: existingCoverUrl,
      existingUrl: existingCoverUrl,
      remove: false,
    });

    form.reset({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues, form]);

  const handleCoverImageChange = (imageData) => {
    setCoverImage(imageData);
  };

  const handleSubmit = (values) => {
    if (typeof onSubmit !== "function") {
      return;
    }

    onSubmit(values, coverImage);
  };

  const handleInvalid = (errors) => {
    const firstError = Object.keys(errors)[0];

    if (firstError) {
      form.setFocus(firstError);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
        className="space-y-8"
        noValidate
        aria-busy={isSubmitting}
      >
        {/* Cover image */}
        <section aria-labelledby="blog-cover-heading" className="space-y-3">
          <div>
            <h3 id="blog-cover-heading" className="text-lg font-semibold">
              Cover Image
            </h3>

            <p className="text-sm text-muted-foreground">
              Upload an image for the blog cover.
            </p>
          </div>

          <BlogCoverImageUploader
            value={coverImage?.preview || null}
            disabled={isSubmitting}
            onChange={handleCoverImageChange}
          />
        </section>

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter blog title"
                  autoComplete="off"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Excerpt */}
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Short description of the blog..."
                  rows={4}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormDescription>
                A short summary shown in blog cards and previews.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Write your blog content..."
                  rows={12}
                  disabled={isSubmitting}
                  className="min-h-72 font-mono text-sm"
                  {...field}
                />
              </FormControl>

              <FormDescription>Markdown content is supported.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>

              <FormControl>
                <Input
                  placeholder="Technology"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>

              <FormControl>
                <Input
                  placeholder="react, javascript, frontend"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormDescription>
                Separate tags using commas. Maximum 20 tags.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reading time */}
        <FormField
          control={form.control}
          name="readingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading Time (minutes)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  inputMode="numeric"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 rounded-lg border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  disabled={isSubmitting}
                  onCheckedChange={field.onChange}
                  aria-describedby="published-description"
                />
              </FormControl>

              <div className="space-y-1">
                <FormLabel className="cursor-pointer">
                  Publish this blog
                </FormLabel>

                <p
                  id="published-description"
                  className="text-xs text-muted-foreground"
                >
                  Published posts can appear on the public blog.
                </p>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* SEO */}
        <section
          aria-labelledby="blog-seo-heading"
          className="space-y-6 rounded-xl border p-6"
        >
          <div>
            <h3 id="blog-seo-heading" className="text-lg font-semibold">
              SEO Settings
            </h3>

            <p className="text-sm text-muted-foreground">
              Optional search engine optimization settings.
            </p>
          </div>

          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>

                <FormControl>
                  <Input
                    placeholder="SEO meta title"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Recommended maximum length: 70 characters.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="SEO meta description"
                    rows={4}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Recommended maximum length: 160 characters.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>

                <FormControl>
                  <Input
                    placeholder="javascript, react, web development"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Separate keywords using commas. Maximum 30 keywords.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canonicalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canonical URL</FormLabel>

                <FormControl>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder="https://example.com/blog/..."
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
