import { Plus, X } from "lucide-react";
import { useState } from "react";

const TechnologyInput = ({ value = [], onChange, error }) => {
  const [inputValue, setInputValue] = useState("");

  const addTechnology = () => {
    const technology = inputValue.trim();

    if (!technology) {
      return;
    }

    const alreadyExists = value.some(
      (item) => item.toLowerCase() === technology.toLowerCase(),
    );

    if (alreadyExists) {
      setInputValue("");
      return;
    }

    onChange([...value, technology]);
    setInputValue("");
  };

  const removeTechnology = (technologyToRemove) => {
    onChange(value.filter((technology) => technology !== technologyToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTechnology();
    }
  };

  return (
    <div>
      <div
        className={[
          "min-h-11 rounded-md border bg-background p-2",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          error ? "border-destructive" : "",
        ].join(" ")}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((technology) => (
            <span
              key={technology}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium"
            >
              {technology}

              <button
                type="button"
                onClick={() => removeTechnology(technology)}
                className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Remove ${technology}`}
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}

          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTechnology}
            placeholder={
              value.length === 0 ? "Add a technology..." : "Add another..."
            }
            className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Add technology"
          />

          <button
            type="button"
            onClick={addTechnology}
            className="inline-flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Add technology"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground">
        Press Enter or comma to add a technology.
      </p>

      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default TechnologyInput;
