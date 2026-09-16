import { Mail } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact | Portfolio";
  }, []);

  return (
    <div>
      <section className="border-b">
        <div className="container-page py-16 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Mail className="size-3.5 text-primary" />
              Contact
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Let's build something useful.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Have a project, job opportunity, collaboration, or simply want to
              talk about software? Send me a message.
            </p>
          </motion.div>
        </div>
      </section>

      <main>
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
              >
                <p className="text-sm font-medium text-primary">Get in touch</p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Tell me what you're working on.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                  I’m always interested in meaningful software projects,
                  technical challenges, and opportunities to collaborate.
                </p>

                <div className="mt-8">
                  <ContactInfo />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border bg-card p-5 sm:p-7 lg:p-8"
              >
                <div className="mb-7">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Send a message
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Fill out the form below and your message will be sent
                    directly through the portfolio.
                  </p>
                </div>

                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
