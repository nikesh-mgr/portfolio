import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Globe,
  Loader2,
  Search,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  createSiteSettings,
  deleteProfileImage,
  deleteSiteSettings,
  getSiteSettings,
  updateProfileImage,
  updateSiteSettings,
  uploadProfileImage,
} from "@/api/siteSettingsApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import AdvancedSettings from "@/components/admin/settings/AdvancedSettings";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import SeoSettings from "@/components/admin/settings/SeoSettings";
import SettingsSaveBar from "@/components/admin/settings/SettingsSaveBar";
import SettingsSidebar from "@/components/admin/settings/SettingsSidebar";
import SocialSettings from "@/components/admin/settings/SocialSettings";

const emptySettings = {
  siteName: "",
  developerName: "",
  tagline: "",
  bio: "",
  contactEmail: "",
  location: "",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
  },
  isMaintenanceMode: false,
};

const normalizeSettings = (settings) => ({
  siteName: settings?.siteName || "",
  developerName: settings?.developerName || "",
  tagline: settings?.tagline || "",
  bio: settings?.bio || "",
  contactEmail: settings?.contactEmail || "",
  location: settings?.location || "",

  socialLinks: {
    github: settings?.socialLinks?.github || "",
    linkedin: settings?.socialLinks?.linkedin || "",
    twitter: settings?.socialLinks?.twitter || "",
    facebook: settings?.socialLinks?.facebook || "",
    instagram: settings?.socialLinks?.instagram || "",
  },

  seo: {
    metaTitle: settings?.seo?.metaTitle || "",
    metaDescription: settings?.seo?.metaDescription || "",
    keywords: Array.isArray(settings?.seo?.keywords)
      ? settings.seo.keywords
      : [],
  },

  isMaintenanceMode: Boolean(settings?.isMaintenanceMode),
});

const isValidUrl = (value) => {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const isValidEmail = (value) => {
  if (!value.trim()) return true;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const Settings = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(emptySettings);
  const [activeSection, setActiveSection] = useState("general");
  const [isDirty, setIsDirty] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getSiteSettings,
    retry: false,
  });

  const settings = data?.settings || null;

  const profileImageUrl =
    settings?.profileImage?.url || settings?.profileImage || null;

  useEffect(() => {
    if (!settings) return;

    setFormData(normalizeSettings(settings));
    setIsDirty(false);
  }, [settings]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (settings) {
        return updateSiteSettings(payload);
      }

      return createSiteSettings(payload);
    },

    onSuccess: (response) => {
      queryClient.setQueryData(["siteSettings"], response);

      setFormData(normalizeSettings(response.settings));
      setIsDirty(false);

      toast.success(
        settings
          ? "Site settings updated successfully"
          : "Site settings created successfully",
      );
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to save site settings",
      );
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadProfileImage,

    onSuccess: (response) => {
      queryClient.setQueryData(["siteSettings"], response);

      clearImageSelection();

      toast.success("Profile image uploaded successfully");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to upload profile image",
      );
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: updateProfileImage,

    onSuccess: (response) => {
      queryClient.setQueryData(["siteSettings"], response);

      clearImageSelection();

      toast.success("Profile image updated successfully");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to update profile image",
      );
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteProfileImage,

    onSuccess: (response) => {
      queryClient.setQueryData(["siteSettings"], response);

      toast.success("Profile image removed successfully");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to remove profile image",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSiteSettings,

    onSuccess: () => {
      queryClient.setQueryData(["siteSettings"], {
        success: true,
        settings: null,
      });

      setFormData(emptySettings);
      setIsDirty(false);

      toast.success("Site settings deleted successfully");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          "Failed to delete site settings",
      );
    },
  });

  const clearImageSelection = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setIsDirty(true);
  };

  const updateNestedField = (section, field, value) => {
    setFormData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));

    setIsDirty(true);
  };

  const validationErrors = useMemo(() => {
    const errors = {};

    if (!formData.siteName.trim()) {
      errors.siteName = "Site name is required";
    } else if (formData.siteName.trim().length < 2) {
      errors.siteName = "Site name must be at least 2 characters";
    }

    if (!formData.developerName.trim()) {
      errors.developerName = "Developer name is required";
    } else if (formData.developerName.trim().length < 2) {
      errors.developerName = "Developer name must be at least 2 characters";
    }

    if (!isValidEmail(formData.contactEmail)) {
      errors.contactEmail = "Please provide a valid email address";
    }

    const urlFields = [
      ["github", formData.socialLinks.github],
      ["linkedin", formData.socialLinks.linkedin],
      ["twitter", formData.socialLinks.twitter],
      ["facebook", formData.socialLinks.facebook],
      ["instagram", formData.socialLinks.instagram],
    ];

    urlFields.forEach(([field, value]) => {
      if (!isValidUrl(value)) {
        errors[field] = "Please provide a valid HTTP or HTTPS URL";
      }
    });

    if (formData.tagline.length > 200) {
      errors.tagline = "Tagline cannot exceed 200 characters";
    }

    if (formData.bio.length > 3000) {
      errors.bio = "Bio cannot exceed 3000 characters";
    }

    if (formData.seo.metaTitle.length > 70) {
      errors.metaTitle = "SEO meta title cannot exceed 70 characters";
    }

    if (formData.seo.metaDescription.length > 160) {
      errors.metaDescription =
        "SEO meta description cannot exceed 160 characters";
    }

    return errors;
  }, [formData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const payload = {
      siteName: formData.siteName.trim(),
      developerName: formData.developerName.trim(),
      tagline: formData.tagline.trim() || null,
      bio: formData.bio.trim() || null,
      contactEmail: formData.contactEmail.trim() || null,
      location: formData.location.trim() || null,

      socialLinks: {
        github: formData.socialLinks.github.trim() || null,
        linkedin: formData.socialLinks.linkedin.trim() || null,
        twitter: formData.socialLinks.twitter.trim() || null,
        facebook: formData.socialLinks.facebook.trim() || null,
        instagram: formData.socialLinks.instagram.trim() || null,
      },

      seo: {
        metaTitle: formData.seo.metaTitle.trim() || null,
        metaDescription: formData.seo.metaDescription.trim() || null,
        keywords: formData.seo.keywords
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      },

      isMaintenanceMode: formData.isMaintenanceMode,
    };

    saveMutation.mutate(payload);
  };

  const handleKeywordsChange = (value) => {
    const keywords = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    updateNestedField("seo", "keywords", keywords);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Profile image must be smaller than 5 MB");

      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUploadImage = () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    if (profileImageUrl) {
      updateImageMutation.mutate(selectedImage);
      return;
    }

    uploadImageMutation.mutate(selectedImage);
  };

  const handleDeleteImage = () => {
    if (!window.confirm("Remove the current profile image?")) {
      return;
    }

    deleteImageMutation.mutate();
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        "Delete site settings? This will remove your current portfolio configuration.",
      )
    ) {
      return;
    }

    deleteMutation.mutate();
  };

  const isImageMutationPending =
    uploadImageMutation.isPending ||
    updateImageMutation.isPending ||
    deleteImageMutation.isPending;

  const sections = [
    {
      id: "general",
      label: "General",
      icon: SettingsIcon,
    },
    {
      id: "social",
      label: "Social",
      icon: Globe,
    },
    {
      id: "seo",
      label: "SEO",
      icon: Search,
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: AlertTriangle,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Site Settings"
          description="Manage your portfolio website configuration."
        />

        <div className="flex min-h-[400px] items-center justify-center rounded-xl border bg-card">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading site settings...
          </div>
        </div>
      </div>
    );
  }

  const settingsNotFound = isError && error?.response?.status === 404;

  if (isError && !settingsNotFound) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Site Settings"
          description="Manage your portfolio website configuration."
        />

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold">Unable to load settings</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error?.response?.data?.message ||
              "Something went wrong while loading site settings."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Site Settings"
        description="Manage your portfolio identity, social links, SEO, and site behavior."
      />

      {!settings && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex gap-3">
            <SettingsIcon className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-medium">Configure your portfolio</p>

              <p className="mt-1 text-sm text-muted-foreground">
                No site settings exist yet. Complete the form below to create
                your portfolio configuration.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <SettingsSidebar
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="min-w-0 space-y-6">
            {activeSection === "general" && (
              <GeneralSettings
                formData={formData}
                validationErrors={validationErrors}
                updateField={updateField}
                profileImageUrl={profileImageUrl}
                imagePreview={imagePreview}
                selectedImage={selectedImage}
                fileInputRef={fileInputRef}
                isImageMutationPending={isImageMutationPending}
                onSelectImage={handleImageSelect}
                onUploadImage={handleUploadImage}
                onCancelImage={clearImageSelection}
                onDeleteImage={handleDeleteImage}
              />
            )}

            {activeSection === "social" && (
              <SocialSettings
                socialLinks={formData.socialLinks}
                validationErrors={validationErrors}
                updateNestedField={updateNestedField}
              />
            )}

            {activeSection === "seo" && (
              <SeoSettings
                seo={formData.seo}
                validationErrors={validationErrors}
                updateNestedField={updateNestedField}
                onKeywordsChange={handleKeywordsChange}
              />
            )}

            {activeSection === "advanced" && (
              <AdvancedSettings
                formData={formData}
                updateField={updateField}
                settings={settings}
                deleteMutation={deleteMutation}
                onDelete={handleDelete}
              />
            )}

            <SettingsSaveBar
              isDirty={isDirty}
              isPending={saveMutation.isPending}
              hasValidationErrors={Object.keys(validationErrors).length > 0}
              hasSettings={Boolean(settings)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
