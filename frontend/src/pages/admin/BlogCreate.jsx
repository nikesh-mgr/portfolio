import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createBlog, uploadBlogCoverImage } from "@/api/blogApi";

import BlogForm from "@/components/admin/blogs/BlogForm";

const BlogCreate = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Submit Blog
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (values, imageData) => {
    console.log("========================================");
    console.log("CREATE BLOG");
    console.log("VALUES:", values);
    console.log("IMAGE DATA:", imageData);
    console.log("IMAGE FILE:", imageData?.file);
    console.log("========================================");

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

      console.log("========================================");
      console.log("BLOG PAYLOAD");
      console.log(blogPayload);
      console.log("========================================");

      /*
      |--------------------------------------------------------------------------
      | STEP 1: Create Blog
      |--------------------------------------------------------------------------
      */

      console.log("Creating blog...");

      const createResponse = await createBlog(blogPayload);

      console.log("CREATE RESPONSE:", createResponse);

      /*
      |--------------------------------------------------------------------------
      | Get Created Blog
      |--------------------------------------------------------------------------
      */

      const blog = createResponse?.blog;

      if (!blog?._id) {
        console.error(
          "Blog creation response does not contain blog._id:",
          createResponse,
        );

        throw new Error("Blog was created but no blog ID was returned.");
      }

      console.log("========================================");
      console.log("BLOG CREATED SUCCESSFULLY");
      console.log("BLOG ID:", blog._id);
      console.log("BLOG:", blog);
      console.log("========================================");

      /*
      |--------------------------------------------------------------------------
      | STEP 2: Upload Cover Image
      |--------------------------------------------------------------------------
      */

      if (imageData?.file instanceof File) {
        console.log("Uploading cover image...");

        console.log("IMAGE FILE:", imageData.file);

        const uploadResponse = await uploadBlogCoverImage(
          blog._id,
          imageData.file,
        );

        console.log("COVER IMAGE UPLOAD RESPONSE:", uploadResponse);
      } else {
        console.log("No new cover image selected.");
      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      toast.success("Blog created successfully.");

      navigate("/admin/blogs");
    } catch (error) {
      console.error("========================================");
      console.error("CREATE BLOG ERROR");
      console.error("ERROR:", error);
      console.error("RESPONSE:", error?.response);
      console.error("RESPONSE DATA:", error?.response?.data);
      console.error("MESSAGE:", error?.message);
      console.error("========================================");

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
