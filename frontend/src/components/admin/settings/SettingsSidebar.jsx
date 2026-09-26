const SettingsSidebar = ({ sections, activeSection, onSectionChange }) => {
  return (
    <aside className="h-fit rounded-xl border bg-card p-2 lg:sticky lg:top-24">
      <nav className="flex gap-1 overflow-x-auto lg:block">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
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
  );
};

export default SettingsSidebar;
