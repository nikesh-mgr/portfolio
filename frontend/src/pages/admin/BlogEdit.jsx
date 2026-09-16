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

const BlogEdit = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  /*
  |--------------------------------------------------------------------------
  | Load blog
  |--------------------------------------------------------------------------
  */

  const blogQuery = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
  });

  /*
  |--------------------------------------------------------------------------
  | Update blog
  |--------------------------------------------------------------------------
  */

  const updateMutation = useMutation({
    mutationFn: async ({ values, coverImage }) => {
      /*
      |--------------------------------------------------------------------------
      | Convert tags
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
      | Convert SEO keywords
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
      | Build payload
      |--------------------------------------------------------------------------
      */

      const payload = {
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
      console.log("UPDATING BLOG");
      console.log("BLOG ID:", id);
      console.log("PAYLOAD:", payload);
      console.log("COVER IMAGE:", coverImage);
      console.log("========================================");

      /*
      |--------------------------------------------------------------------------
      | STEP 1: Update normal blog fields
      |--------------------------------------------------------------------------
      */

      const response = await updateBlog({
        id,
        data: payload,
      });

      console.log("BLOG UPDATE RESPONSE:", response);

      /*
      |--------------------------------------------------------------------------
      | STEP 2: Upload new cover image
      |--------------------------------------------------------------------------
      */

      if (coverImage?.file instanceof File) {
        console.log("UPLOADING NEW COVER IMAGE:", coverImage.file);

        const uploadResponse = await uploadBlogCoverImage(id, coverImage.file);

        console.log("NEW COVER IMAGE RESPONSE:", uploadResponse);
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 3: Remove existing cover image
      |--------------------------------------------------------------------------
      */

      if (coverImage?.remove === true && !coverImage?.file) {
        console.log("DELETING EXISTING COVER IMAGE");

        await deleteBlogCoverImage(id);
      }

      /*
      |--------------------------------------------------------------------------
      | Return final response
      |--------------------------------------------------------------------------
      */

      return response;
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
        queryKey: ["blog", id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["publishedBlogs"],
      });

      toast.success(response?.message || "Blog updated successfully.");

      navigate("/admin/blogs");
    },

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    onError: (error) => {
      console.error("========================================");
      console.error("UPDATE BLOG ERROR");
      console.error("ERROR:", error);
      console.error("RESPONSE:", error?.response);
      console.error("RESPONSE DATA:", error?.response?.data);
      console.error("========================================");

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update blog.",
      );
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (values, coverImage) => {
    console.log("========================================");
    console.log("EDIT FORM SUBMITTED");
    console.log("VALUES:", values);
    console.log("COVER IMAGE:", coverImage);
    console.log("BLOG ID:", id);
    console.log("========================================");

    if (!id) {
      toast.error("Invalid blog ID.");
      return;
    }

    updateMutation.mutate({
      values,
      coverImage,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (blogQuery.isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit blog"
          description="Loading blog information..."
        />

        <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-card">
          <p className="text-sm text-muted-foreground">Loading blog...</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (blogQuery.isError) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit blog"
          description="Unable to load this blog."
        />

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm font-medium text-destructive">
            {blogQuery.error?.response?.data?.message || "Failed to load blog."}
          </p>

          <div className="mt-4 flex justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => blogQuery.refetch()}
            >
              Try again
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blogs")}
            >
              <ArrowLeft className="size-4" />
              Back to blogs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Get blog from API response
  |--------------------------------------------------------------------------
  */

  const blog = blogQuery.data?.blog || blogQuery.data?.data || blogQuery.data;

  /*
  |--------------------------------------------------------------------------
  | Blog not found
  |--------------------------------------------------------------------------
  */

  if (!blog) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit blog"
          description="The requested blog could not be found."
        />

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Blog not found.</p>

          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/admin/blogs")}
          >
            <ArrowLeft className="size-4" />
            Back to blogs
          </Button>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Normalize API data for BlogForm
  |--------------------------------------------------------------------------
  |
  | Backend:
  |
  | tags: ["react", "javascript"]
  |
  | seo: {
  |   metaTitle: "...",
  |   metaDescription: "...",
  |   keywords: ["react", "web"],
  |   canonicalUrl: "..."
  | }
  |
  | BlogForm:
  |
  | tags: "react, javascript"
  | metaTitle: "..."
  | metaDescription: "..."
  | keywords: "react, web"
  | canonicalUrl: "..."
  |
  */

  const formInitialValues = {
    title: blog.title || "",

    slug: blog.slug || "",

    excerpt: blog.excerpt || "",

    content: blog.content || "",

    category: blog.category || "",

    tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",

    published: Boolean(blog.published),

    readingTime: Number(blog.readingTime) || 1,

    metaTitle: blog.seo?.metaTitle || "",

    metaDescription: blog.seo?.metaDescription || "",

    keywords: Array.isArray(blog.seo?.keywords)
      ? blog.seo.keywords.join(", ")
      : blog.seo?.keywords || "",

    canonicalUrl: blog.seo?.canonicalUrl || "",

    /*
     * Keep coverImage because BlogForm uses it
     * to initialize the existing image.
     */
    coverImage: blog.coverImage || {
      url: null,
      publicId: null,
    },
  };

  console.log("========================================");
  console.log("BLOG EDIT");
  console.log("RAW BLOG:", blog);
  console.log("FORM INITIAL VALUES:", formInitialValues);
  console.log("COVER IMAGE:", formInitialValues.coverImage);
  console.log("========================================");

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

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
            <ArrowLeft className="size-4" />
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
