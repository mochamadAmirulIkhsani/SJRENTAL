# Form Error Handling Best Practices

## Common Form Reset Error

### Error Description

```
TypeError: Cannot read properties of null (reading 'reset')
```

This error occurs when trying to call `reset()` on a form element that might be null.

### Problem Code

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // ... form handling
  e.currentTarget.reset(); // ❌ Potentially null
};
```

### Solution: Using useRef with Null Checks

```tsx
import { useState, useRef } from "react";

export function MyForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset(); // ✅ Safe with null check
    }
    // Reset any additional state
    setOtherState("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // ... submit logic
      resetForm(); // ✅ Safe reset
    } catch (error) {
      // Error handling
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Best Practices

### 1. Always Use Refs for Form Manipulation

```tsx
const formRef = useRef<HTMLFormElement>(null);

// ✅ Good
if (formRef.current) {
  formRef.current.reset();
}

// ❌ Avoid
e.currentTarget.reset();
```

### 2. Create Centralized Reset Function

```tsx
const resetForm = () => {
  if (formRef.current) {
    formRef.current.reset();
  }
  // Reset all related state
  setState1("");
  setState2([]);
  setState3(null);
};
```

### 3. Handle Modal/Dialog Cleanup

```tsx
const handleOpenChange = (newOpen: boolean) => {
  setOpen(newOpen);
  if (!newOpen) {
    resetForm();
    setLoading(false);
  }
};
```

### 4. Error Boundaries for Forms

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Form submission logic
    await submitData(formData);
    resetForm(); // Reset on success
    onSuccess();
  } catch (error) {
    console.error("Form submission error:", error);
    toast.error("Failed to submit form");
  } finally {
    setLoading(false);
  }
};
```

## Common Patterns

### Dialog/Modal Form Pattern

```tsx
export function MyModal({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    // Reset state
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form ref={formRef} onSubmit={handleSubmit}>
        {/* form content */}
      </form>
    </Dialog>
  );
}
```

### Controlled vs Uncontrolled Components

```tsx
// For controlled components, reset state directly
const [value, setValue] = useState("");
const resetForm = () => {
  setValue("");
  setOtherValue("");
};

// For uncontrolled components, use form.reset()
const formRef = useRef<HTMLFormElement>(null);
const resetForm = () => {
  if (formRef.current) {
    formRef.current.reset();
  }
};
```

## Prevention Checklist

- [ ] Use `useRef` for form references
- [ ] Always check `if (formRef.current)` before calling methods
- [ ] Create centralized reset functions
- [ ] Handle modal/dialog state cleanup
- [ ] Add proper error boundaries
- [ ] Test form reset in different scenarios
- [ ] Consider controlled vs uncontrolled patterns
