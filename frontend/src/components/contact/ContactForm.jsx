import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { sendContactMessage } from "@/api/contactApi";

const MAX_MESSAGE_LENGTH = 5000;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be less than 100 characters."),

  email: z.string().trim().email("Please enter a valid email address."),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject must be less than 150 characters."),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must be less than ${MAX_MESSAGE_LENGTH} characters.`,
    ),
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const messageValue = watch("message", "");

  const onSubmit = async (formData) => {
    try {
      const response = await sendContactMessage(formData);

      toast.success(
        response?.message || "Your message has been sent successfully.",
      );

      reset();
    } catch (error) {
      const responseData = error?.response?.data;

      if (responseData?.errors && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((fieldError) => {
          if (fieldError?.field && fieldError?.message) {
            setError(fieldError.field, {
              type: "server",
              message: fieldError.message,
            });
          }
        });
      }

      toast.error(
        responseData?.message ||
          "Unable to send your message. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
      aria-label="Contact form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="flex h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            {...register("name")}
          />

          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="flex h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            {...register("email")}
          />

          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>

        <input
          id="subject"
          type="text"
          placeholder="What would you like to discuss?"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className="flex h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          {...register("subject")}
        />

        {errors.subject && (
          <p
            id="subject-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>

          <span
            className={[
              "text-xs tabular-nums",
              messageValue.length >= MAX_MESSAGE_LENGTH
                ? "text-destructive"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {messageValue.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>

        <textarea
          id="message"
          rows={7}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Tell me about your project, opportunity, or idea..."
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="flex min-h-40 w-full resize-y rounded-md border bg-background px-3 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          {...register("message")}
        />

        {errors.message && (
          <p
            id="message-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-xs leading-5 text-muted-foreground"
          aria-live="polite"
        >
          Your message will be sent securely through the portfolio contact
          system.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send message
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
