import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createBlog, uploadBlogCoverImage } from "@/api/blogApi";

import BlogForm from "@/components/admin/blogs/BlogForm";

const BlogCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /*
  |--------------------------------------------------------------------------
  | Create blog mutation
  |--------------------------------------------------------------------------
  */

  const createMutation = useMutation({
    mutationFn: async ({ values, imageData }) => {
      /*
      |--------------------------------------------------------------------------
      | Convert comma-separated tags into an array
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
      | Convert comma-separated SEO keywords into an array
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
      | Prepare API payload
      |--------------------------------------------------------------------------
      |
      | Slug is intentionally omitted.
      | The backend generates it from the title.
      |--------------------------------------------------------------------------
      */

      const blogPayload = {
        title: values.title.trim(),

        excerpt: values.excerpt.trim(),

        content: values.content.trim(),

        category: values.category.trim() || null,

        tags,

        published: Boolean(values.published),

        readingTime: Number(values.readingTime),

        seo: {
          metaTitle: values.metaTitle.trim() || null,

          metaDescription: values.metaDescription.trim() || null,

          keywords,

          canonicalUrl: values.canonicalUrl.trim() || null,
        },

        order: 0,
      };

      /*
      |--------------------------------------------------------------------------
      | STEP 1: Create blog
      |--------------------------------------------------------------------------
      */

      const createResponse = await createBlog(blogPayload);

      const blog = createResponse?.blog;

      if (!blog?._id) {
        throw new Error(
          "Blog was created but no blog ID was returned by the server.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 2: Upload cover image separately
      |--------------------------------------------------------------------------
      |
      | The blog document is created first because the image endpoint
      | requires the blog ID.
      |--------------------------------------------------------------------------
      */

      if (imageData?.file instanceof File) {
        await uploadBlogCoverImage(blog._id, imageData.file);
      }

      return {
        ...createResponse,
        blog,
      };
    },

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["publishedBlogs"],
      });

      const blogId = response?.blog?._id;
      const blogSlug = response?.blog?.slug;

      if (blogId) {
        queryClient.removeQueries({
          queryKey: ["blog", blogId],
        });
      }

      if (blogSlug) {
        queryClient.removeQueries({
          queryKey: ["blog", blogSlug],
        });
      }

      toast.success("Blog created successfully.");

      navigate("/admin/blogs");
    },

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create blog.";

      toast.error(message);
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (values, imageData) => {
    createMutation.mutate({
      values,
      imageData,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Blog</h1>

        <p className="mt-2 text-muted-foreground">
          Create a new blog post for your portfolio.
        </p>
      </div>

      <BlogForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create blog"
      />
    </div>
  );
};

export default BlogCreate;
