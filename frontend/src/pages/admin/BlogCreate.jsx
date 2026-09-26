import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createBlog, uploadBlogCoverImage } from "@/api/blogApi";

import BlogForm from "@/components/admin/blogs/BlogForm";

const BlogCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Submit Blog
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (values, imageData) => {
    try {
      setIsSubmitting(true);

      /*
      |--------------------------------------------------------------------------
      | Convert Tags
      |--------------------------------------------------------------------------
      */

      const tags = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      /*
      |--------------------------------------------------------------------------
      | Convert SEO Keywords
      |--------------------------------------------------------------------------
      */

      const keywords = values.keywords
        ? values.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        : [];

      /*
      |--------------------------------------------------------------------------
      | Prepare Blog Payload
      |--------------------------------------------------------------------------
      */

      const blogPayload = {
        title: values.title.trim(),

        slug: values.slug?.trim() || undefined,

        excerpt: values.excerpt.trim(),

        content: values.content.trim(),

        category: values.category?.trim() || null,

        tags,

        published: Boolean(values.published),

        readingTime: Number(values.readingTime) || 1,

        seo: {
          metaTitle: values.metaTitle?.trim() || null,

          metaDescription: values.metaDescription?.trim() || null,

          keywords,

          canonicalUrl: values.canonicalUrl?.trim() || null,
        },
      };

      /*
      |--------------------------------------------------------------------------
      | STEP 1: Create Blog
      |--------------------------------------------------------------------------
      */

      const createResponse = await createBlog(blogPayload);

      /*
      |--------------------------------------------------------------------------
      | Get Created Blog
      |--------------------------------------------------------------------------
      */

      const blog = createResponse?.blog;

      if (!blog?._id) {
        throw new Error("Blog was created but no blog ID was returned.");
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 2: Upload Cover Image
      |--------------------------------------------------------------------------
      */

      await queryClient.invalidateQueries({ queryKey: ["blogs"] });

      if (imageData?.file instanceof File) {
        try {
          await uploadBlogCoverImage(blog._id, imageData.file);
          await queryClient.invalidateQueries({ queryKey: ["blogs"] });
        } catch {
          toast.error(
            "Blog saved, but the cover upload failed. You can retry from the edit page.",
          );
          navigate(`/admin/blogs/${blog._id}/edit`);
          return;
        }
      }

      toast.success("Blog created successfully.");

      navigate("/admin/blogs");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create blog.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="container mx-auto max-w-5xl py-8">
      {/* ---------------------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------------------- */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Blog</h1>

        <p className="mt-2 text-muted-foreground">
          Create a new blog post for your portfolio.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* FORM */}
      {/* ---------------------------------------------------------------- */}

      <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default BlogCreate;
