import * as React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormField = ({ name, control, ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} control={control} {...props} />
    </FormFieldContext.Provider>
  );
};

const FormFieldContext = React.createContext(null);

const FormItemContext = React.createContext(null);

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});

FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const itemContext = React.useContext(FormItemContext);

  return (
    <label
      ref={ref}
      htmlFor={itemContext?.id}
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
});

FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ children, ...props }, ref) => {
  const itemContext = React.useContext(FormItemContext);

  const fieldContext = React.useContext(FormFieldContext);

  if (!React.isValidElement(children)) {
    return children;
  }

  return React.cloneElement(children, {
    ...props,
    ...children.props,
    ref,
    id: itemContext?.id,
    name: fieldContext?.name,
  });
});

FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const fieldContext = React.useContext(FormFieldContext);

    const { formState } = useFormContext();

    const error = fieldContext?.name
      ? formState.errors?.[fieldContext.name]
      : undefined;

    const body = error?.message || children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);

FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
