import api from "./axios";

/*
|--------------------------------------------------------------------------
| Get all public blogs
|--------------------------------------------------------------------------
|
| Backend:
| GET /api/blogs
|
| The backend intentionally returns published blogs only.
*/
export const getBlogs = async () => {
  const response = await api.get("/blogs");

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get blog by ID (Admin)
|--------------------------------------------------------------------------
|
| Backend:
| GET /api/blogs/admin/:blogid
|
| Requires authentication.
| Used by the admin edit page.
*/
export const getBlogById = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required.");
  }

  const response = await api.get(`/blogs/admin/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get blog by slug
|--------------------------------------------------------------------------
|
| Backend:
| GET /api/blogs/:slug
|
| Public endpoint.
| The backend returns published blogs only.
*/
export const getBlogBySlug = async (slug) => {
  if (!slug) {
    throw new Error("Blog slug is required.");
  }

  const response = await api.get(`/blogs/${slug}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create blog
|--------------------------------------------------------------------------
|
| Backend:
| POST /api/blogs
|
| Sends normal blog data as JSON.
|
| Cover image is intentionally uploaded separately through
| uploadBlogCoverImage() after the blog has been created.
*/
export const createBlog = async (data) => {
  if (!data || typeof data !== "object") {
    throw new Error("Blog data is required.");
  }

  const response = await api.post("/blogs", data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update blog
|--------------------------------------------------------------------------
|
| Backend:
| PATCH /api/blogs/:id
|
| Sends normal blog fields as JSON.
|
| Cover image is intentionally NOT included here.
*/
export const updateBlog = async ({ id, data }) => {
  if (!id) {
    throw new Error("Blog ID is required.");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Blog data is required.");
  }

  const response = await api.patch(`/blogs/${id}`, data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Upload / replace blog cover image
|--------------------------------------------------------------------------
|
| Backend:
| POST /api/blogs/:id/cover-image
|
| Uses multipart/form-data because an actual File is uploaded.
*/
export const uploadBlogCoverImage = async (id, file) => {
  if (!id) {
    throw new Error("Blog ID is required.");
  }

  if (!(file instanceof File)) {
    throw new Error("Cover image file is required.");
  }

  const formData = new FormData();

  formData.append("coverImage", file);

  /*
   * Do not manually set Content-Type here.
   *
   * Axios/browser automatically adds:
   * multipart/form-data; boundary=...
   *
   * The boundary is required for Multer to parse the request correctly.
   */
  const response = await api.post(`/blogs/${id}/cover-image`, formData);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete blog cover image
|--------------------------------------------------------------------------
|
| Backend:
| DELETE /api/blogs/:id/cover-image
*/
export const deleteBlogCoverImage = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required.");
  }

  const response = await api.delete(`/blogs/${id}/cover-image`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete blog
|--------------------------------------------------------------------------
|
| Backend:
| DELETE /api/blogs/:id
|
| Requires authentication.
*/
export const deleteBlog = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required.");
  }

  const response = await api.delete(`/blogs/${id}`);

  return response.data;
};
export const getAdminBlogs = async () => {
  const response = await api.get("/blogs/admin");
  return response.data;
};
