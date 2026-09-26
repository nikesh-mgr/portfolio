import api from "./axios";

/*
|--------------------------------------------------------------------------
| Get all blogs
|--------------------------------------------------------------------------
*/

export const getBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get blog by ID
|--------------------------------------------------------------------------
*/

export const getAdminBlogs = async () => {
  const response = await api.get("/blogs/admin");
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await api.get(`/blogs/admin/${id}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get blog by slug
|--------------------------------------------------------------------------
*/

export const getBlogBySlug = async (slug) => {
  const response = await api.get(`/blogs/${slug}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create blog
|--------------------------------------------------------------------------
*/

export const createBlog = async (data) => {
  const response = await api.post("/blogs", data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update blog
|--------------------------------------------------------------------------
*/

export const updateBlog = async ({ id, data }) => {
  const response = await api.patch(`/blogs/${id}`, data);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Upload blog cover image
|--------------------------------------------------------------------------
*/

export const uploadBlogCoverImage = async (id, file) => {
  if (!file) {
    throw new Error("Cover image file is required.");
  }

  const formData = new FormData();

  formData.append("coverImage", file);

  const response = await api.post(`/blogs/${id}/cover-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete blog cover image
|--------------------------------------------------------------------------
*/

export const deleteBlogCoverImage = async (id) => {
  const response = await api.delete(`/blogs/${id}/cover-image`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete blog
|--------------------------------------------------------------------------
*/

export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);

  return response.data;
};
