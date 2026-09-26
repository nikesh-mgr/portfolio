import ProfileImageField from "./ProfileImageField";
import { FormField, LocationField, TextAreaField } from "./SettingsFormFields";

const GeneralSettings = ({
  formData,
  validationErrors,
  updateField,
  profileImageUrl,
  imagePreview,
  selectedImage,
  fileInputRef,
  isImageMutationPending,
  onSelectImage,
  onUploadImage,
  onCancelImage,
  onDeleteImage,
}) => {
  return (
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
          <div className="md:col-span-2">
            <ProfileImageField
              profileImageUrl={profileImageUrl}
              imagePreview={imagePreview}
              selectedImage={selectedImage}
              fileInputRef={fileInputRef}
              isPending={isImageMutationPending}
              onSelect={onSelectImage}
              onUpload={onUploadImage}
              onCancel={onCancelImage}
              onDelete={onDeleteImage}
            />
          </div>

          <FormField
            label="Contact email"
            type="email"
            value={formData.contactEmail}
            onChange={(value) => updateField("contactEmail", value)}
            placeholder="hello@example.com"
            error={validationErrors.contactEmail}
          />

          <LocationField
            label="Location"
            value={formData.location}
            onChange={(value) => updateField("location", value)}
            placeholder="Kathmandu, Nepal"
          />
        </div>
      </section>
    </>
  );
};

export default GeneralSettings;
