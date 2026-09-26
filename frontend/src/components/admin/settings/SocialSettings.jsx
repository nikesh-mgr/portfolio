import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import { SocialUrlField } from "./SettingsFormFields";

const SocialSettings = ({
  socialLinks,
  validationErrors,
  updateNestedField,
}) => {
  const fields = [
    {
      key: "github",
      label: "GitHub",
      icon: FaGithub,
      placeholder: "https://github.com/username",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: FaLinkedin,
      placeholder: "https://linkedin.com/in/username",
    },
    {
      key: "twitter",
      label: "Twitter / X",
      icon: FaTwitter,
      placeholder: "https://x.com/username",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: FaFacebook,
      placeholder: "https://facebook.com/username",
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: FaInstagram,
      placeholder: "https://instagram.com/username",
    },
  ];

  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-semibold">Social links</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add your professional and social profiles.
        </p>
      </div>

      <div className="grid gap-5 p-5">
        {fields.map((field) => (
          <SocialUrlField
            key={field.key}
            label={field.label}
            value={socialLinks[field.key]}
            onChange={(value) =>
              updateNestedField("socialLinks", field.key, value)
            }
            placeholder={field.placeholder}
            icon={field.icon}
            error={validationErrors[field.key]}
          />
        ))}
      </div>
    </section>
  );
};

export default SocialSettings;
