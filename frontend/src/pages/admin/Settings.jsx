import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  Globe,
  Loader2,
  MapPin,
  Save,
  Search,
  Settings as SettingsIcon,
  Trash2,
} from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { toast } from "sonner";

import {
  createSiteSettings,
  deleteSiteSettings,
  getSiteSettings,
  updateSiteSettings,
} from "@/api/siteSettingsApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

const emptySettings = {
  siteName: "",
  developerName: "",
  tagline: "",
  bio: "",
  profileImage: "",
  resumeUrl: "",
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
    ogImage: "",
  },
  isMaintenanceMode: false,
};

const normalizeSettings = (settings) => ({
  siteName: settings?.siteName || "",
  developerName: settings?.developerName || "",
  tagline: settings?.tagline || "",
  bio: settings?.bio || "",
  profileImage: settings?.profileImage || "",
  resumeUrl: settings?.resumeUrl || "",
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
    ogImage: settings?.seo?.ogImage || "",
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

const Settings = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(emptySettings);
  const [activeSection, setActiveSection] = useState("general");
  const [isDirty, setIsDirty] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: getSiteSettings,
    retry: false,
  });

  const settings = data?.settings || null;

  useEffect(() => {
    if (settings) {
      setFormData(normalizeSettings(settings));
      setIsDirty(false);
    }
  }, [settings]);

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
      ["profileImage", formData.profileImage],
      ["resumeUrl", formData.resumeUrl],
      ["github", formData.socialLinks.github],
      ["linkedin", formData.socialLinks.linkedin],
      ["twitter", formData.socialLinks.twitter],
      ["facebook", formData.socialLinks.facebook],
      ["instagram", formData.socialLinks.instagram],
      ["ogImage", formData.seo.ogImage],
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
      profileImage: formData.profileImage.trim() || null,
      resumeUrl: formData.resumeUrl.trim() || null,
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
        ogImage: formData.seo.ogImage.trim() || null,
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

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete site settings? This will remove your current portfolio configuration.",
    );

    if (!confirmed) return;

    deleteMutation.mutate();
  };

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
          <aside className="h-fit rounded-xl border bg-card p-2 lg:sticky lg:top-24">
            <nav className="flex gap-1 overflow-x-auto lg:block">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:w-full ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 space-y-6">
            {activeSection === "general" && (
              <>
                <section className="rounded-xl border bg-card">
                  <div className="border-b p-5">
                    <h2 className="font-semibold">General information</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Basic information displayed throughout your portfolio.
                    </p>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-2">
                    <FormField
                      label="Site name"
                      required
                      value={formData.siteName}
                      onChange={(value) => updateField("siteName", value)}
                      placeholder="My Developer Portfolio"
                      error={validationErrors.siteName}
                    />

                    <FormField
                      label="Developer name"
                      required
                      value={formData.developerName}
                      onChange={(value) => updateField("developerName", value)}
                      placeholder="John Doe"
                      error={validationErrors.developerName}
                    />

                    <div className="md:col-span-2">
                      <FormField
                        label="Tagline"
                        value={formData.tagline}
                        onChange={(value) => updateField("tagline", value)}
                        placeholder="Full Stack Developer building useful products."
                        maxLength={200}
                        error={validationErrors.tagline}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <TextAreaField
                        label="Bio"
                        value={formData.bio}
                        onChange={(value) => updateField("bio", value)}
                        placeholder="Tell visitors about yourself, your development experience, interests, and goals."
                        maxLength={3000}
                        rows={7}
                        error={validationErrors.bio}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border bg-card">
                  <div className="border-b p-5">
                    <h2 className="font-semibold">Profile & contact</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Information visitors can use to identify and contact you.
                    </p>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-2">
                    <UrlField
                      label="Profile image URL"
                      value={formData.profileImage}
                      onChange={(value) => updateField("profileImage", value)}
                      placeholder="https://..."
                      error={validationErrors.profileImage}
                    />

                    <UrlField
                      label="Resume URL"
                      value={formData.resumeUrl}
                      onChange={(value) => updateField("resumeUrl", value)}
                      placeholder="https://..."
                      error={validationErrors.resumeUrl}
                    />

                    <FormField
                      label="Contact email"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(value) => updateField("contactEmail", value)}
                      placeholder="hello@example.com"
                      error={validationErrors.contactEmail}
                    />

                    <FormField
                      label="Location"
                      value={formData.location}
                      onChange={(value) => updateField("location", value)}
                      placeholder="Kathmandu, Nepal"
                      icon={MapPin}
                    />
                  </div>
                </section>
              </>
            )}

            {activeSection === "social" && (
              <section className="rounded-xl border bg-card">
                <div className="border-b p-5">
                  <h2 className="font-semibold">Social links</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your professional and social profiles.
                  </p>
                </div>

                <div className="grid gap-5 p-5">
                  <SocialUrlField
                    label="GitHub"
                    value={formData.socialLinks.github}
                    onChange={(value) =>
                      updateNestedField("socialLinks", "github", value)
                    }
                    placeholder="https://github.com/username"
                    icon={FaGithub}
                    error={validationErrors.github}
                  />

                  <SocialUrlField
                    label="LinkedIn"
                    value={formData.socialLinks.linkedin}
                    onChange={(value) =>
                      updateNestedField("socialLinks", "linkedin", value)
                    }
                    placeholder="https://linkedin.com/in/username"
                    icon={FaLinkedin}
                    error={validationErrors.linkedin}
                  />

                  <SocialUrlField
                    label="Twitter / X"
                    value={formData.socialLinks.twitter}
                    onChange={(value) =>
                      updateNestedField("socialLinks", "twitter", value)
                    }
                    placeholder="https://x.com/username"
                    icon={FaTwitter}
                    error={validationErrors.twitter}
                  />

                  <SocialUrlField
                    label="Facebook"
                    value={formData.socialLinks.facebook}
                    onChange={(value) =>
                      updateNestedField("socialLinks", "facebook", value)
                    }
                    placeholder="https://facebook.com/username"
                    icon={FaFacebook}
                    error={validationErrors.facebook}
                  />

                  <SocialUrlField
                    label="Instagram"
                    value={formData.socialLinks.instagram}
                    onChange={(value) =>
                      updateNestedField("socialLinks", "instagram", value)
                    }
                    placeholder="https://instagram.com/username"
                    icon={FaInstagram}
                    error={validationErrors.instagram}
                  />
                </div>
              </section>
            )}

            {activeSection === "seo" && (
              <section className="rounded-xl border bg-card">
                <div className="border-b p-5">
                  <h2 className="font-semibold">Search engine optimization</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Configure metadata used by search engines and social
                    previews.
                  </p>
                </div>

                <div className="space-y-5 p-5">
                  <FormField
                    label="Meta title"
                    value={formData.seo.metaTitle}
                    onChange={(value) =>
                      updateNestedField("seo", "metaTitle", value)
                    }
                    placeholder="John Doe — Full Stack Developer"
                    maxLength={70}
                    error={validationErrors.metaTitle}
                  />

                  <TextAreaField
                    label="Meta description"
                    value={formData.seo.metaDescription}
                    onChange={(value) =>
                      updateNestedField("seo", "metaDescription", value)
                    }
                    placeholder="Full Stack Developer building modern web applications..."
                    maxLength={160}
                    rows={4}
                    error={validationErrors.metaDescription}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Keywords
                    </label>

                    <input
                      type="text"
                      value={formData.seo.keywords.join(", ")}
                      onChange={(event) =>
                        handleKeywordsChange(event.target.value)
                      }
                      placeholder="react, node.js, mongodb, full stack developer"
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      Separate keywords using commas.
                    </p>
                  </div>

                  <UrlField
                    label="Open Graph image URL"
                    value={formData.seo.ogImage}
                    onChange={(value) =>
                      updateNestedField("seo", "ogImage", value)
                    }
                    placeholder="https://..."
                    error={validationErrors.ogImage}
                  />
                </div>
              </section>
            )}

            {activeSection === "advanced" && (
              <>
                <section className="rounded-xl border bg-card">
                  <div className="border-b p-5">
                    <h2 className="font-semibold">Maintenance mode</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Temporarily indicate that your portfolio is unavailable.
                    </p>
                  </div>

                  <div className="p-5">
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                      <input
                        type="checkbox"
                        checked={formData.isMaintenanceMode}
                        onChange={(event) =>
                          updateField("isMaintenanceMode", event.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded"
                      />

                      <span>
                        <span className="block text-sm font-medium">
                          Enable maintenance mode
                        </span>

                        <span className="mt-1 block text-sm text-muted-foreground">
                          Enable this when the public portfolio is temporarily
                          unavailable.
                        </span>
                      </span>
                    </label>

                    {formData.isMaintenanceMode && (
                      <div className="mt-4 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                        <p className="text-sm">
                          Maintenance mode is enabled. Make sure your frontend
                          handles this setting before relying on it in
                          production.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {settings && (
                  <section className="rounded-xl border border-destructive/30 bg-destructive/5">
                    <div className="border-b border-destructive/20 p-5">
                      <h2 className="font-semibold text-destructive">
                        Danger zone
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Permanently remove the current site settings document.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">Delete site settings</p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          You can create the settings again afterward.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-destructive/40 px-4 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground disabled:pointer-events-none disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete settings
                      </button>
                    </div>
                  </section>
                )}
              </>
            )}

            <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isDirty ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Unsaved changes
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    All changes saved
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  saveMutation.isPending ||
                  Object.keys(validationErrors).length > 0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {settings ? "Save changes" : "Create settings"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const FormField = ({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  error,
  icon: Icon,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            Icon ? "pl-9" : ""
          } ${error ? "border-destructive" : ""}`}
        />
      </div>

      <div className="mt-1 flex justify-between gap-3">
        {error ? <p className="text-xs text-destructive">{error}</p> : <span />}

        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 5,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={`w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "border-destructive" : ""
        }`}
      />

      <div className="mt-1 flex justify-between gap-3">
        {error ? <p className="text-xs text-destructive">{error}</p> : <span />}

        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

const UrlField = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
}) => {
  return (
    <FormField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      icon={Icon}
    />
  );
};

const SocialUrlField = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-10 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            error ? "border-destructive" : ""
          }`}
        />
      </div>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default Settings;
