const DashboardSection = ({ title, description, action, children }) => {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
};

export default DashboardSection;
