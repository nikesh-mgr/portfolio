import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  deleteBlogCoverImage,
  getBlogById,
  updateBlog,
  uploadBlogCoverImage,
} from "@/api/blogApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BlogForm from "@/components/admin/blogs/BlogForm";
import { Button } from "@/components/ui/button";
import getApiErrorMessage from "@/utils/ApiErrorhandler";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const blogQuery = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ values, coverImage }) => {
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

      const payload = {
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
      };

      const response = await updateBlog({
        id,
        data: payload,
      });

      if (coverImage?.file instanceof File) {
        await uploadBlogCoverImage(id, coverImage.file);
      } else if (coverImage?.remove === true) {
        await deleteBlogCoverImage(id);
      }

      return response;
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["blogs"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["blog", id],
        }),
      ]);

      toast.success("Blog updated successfully.");
      navigate("/admin/blogs");
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "The blog could not be updated. Please try again.",
        ),
      );
    },
  });

  const handleSubmit = (values, coverImage) => {
    if (!id) {
      toast.error("The blog ID is missing.");
      return;
    }

    updateMutation.mutate({
      values,
      coverImage,
    });
  };

  if (blogQuery.isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit blog"
          description="Loading blog information..."
        />

        <div
          className="flex min-h-[400px] items-center justify-center rounded-xl border bg-card"
          aria-busy="true"
        >
          <p className="text-sm text-muted-foreground">
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  if (blogQuery.isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit blog"
          description="Unable to load this blog."
        />

        <div
          className="rounded-xl border bg-card p-8 text-center"
          role="alert"
        >
          <p className="text-sm font-medium text-destructive">
            {getApiErrorMessage(
              blogQuery.error,
              "The blog could not be loaded.",
            )}
          </p>

          <div className="mt-4 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => blogQuery.refetch()}
              disabled={blogQuery.isFetching}
            >
              {blogQuery.isFetching ? "Retrying..." : "Try again"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blogs")}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to blogs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const blog = blogQuery.data?.blog;

  if (!blog) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit blog"
          description="The requested blog could not be found."
        />

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Blog not found.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/admin/blogs")}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to blogs
          </Button>
        </div>
      </div>
    );
  }

  const formInitialValues = {
    title: blog.title || "",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    category: blog.category || "",
    tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
    published: Boolean(blog.published),
    readingTime: Number(blog.readingTime) || 1,
    metaTitle: blog.seo?.metaTitle || "",
    metaDescription: blog.seo?.metaDescription || "",
    keywords: Array.isArray(blog.seo?.keywords)
      ? blog.seo.keywords.join(", ")
      : "",
    canonicalUrl: blog.seo?.canonicalUrl || "",
    coverImage: blog.coverImage || {
      url: null,
      publicId: null,
    },
  };

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <AdminPageHeader
        title="Edit blog"
        description={`Update ${blog.title || "blog"} information.`}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/blogs")}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to blogs
          </Button>
        }
      />

      <div className="mt-8">
        <BlogForm
          initialValues={formInitialValues}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
};

export default BlogEdit;