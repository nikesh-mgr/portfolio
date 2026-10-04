import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createBlog, uploadBlogCoverImage } from "@/api/blogApi";

import BlogForm from "@/components/admin/blogs/BlogForm";
import getApiErrorMessage from "@/utils/ApiErrorhandler";

const BlogCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({ values, imageData }) => {
      const tags = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const keywords = values.keywords
        ? values.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        : [];

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

      const createResponse = await createBlog(blogPayload);
      const blog = createResponse?.blog;

      if (!blog?._id) {
        throw new Error(
          "Blog was created, but the server did not return its ID.",
        );
      }

      if (imageData?.file instanceof File) {
        await uploadBlogCoverImage(blog._id, imageData.file);
      }

      return createResponse;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });

      toast.success("Blog created successfully.");
      navigate("/admin/blogs");
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "The blog could not be created. Please try again.",
        ),
      );
    },
  });

  const handleSubmit = (values, imageData) => {
    createMutation.mutate({
      values,
      imageData,
    });
  };

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create blog</h1>

        <p className="mt-2 text-muted-foreground">
          Create a new article for your portfolio.
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
