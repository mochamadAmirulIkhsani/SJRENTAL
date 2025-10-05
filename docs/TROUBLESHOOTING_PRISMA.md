# Troubleshooting: Prisma Client Issues

## Problem: Schema Changes Not Reflected in Client

### Issue Description

When updating Prisma schema, you might encounter errors like:

```
Unknown argument. Available options are marked with ?.
```

This happens when the Prisma client hasn't been regenerated after schema changes.

### Root Cause

- Prisma schema was updated with field changes
- Migration was applied to database
- **But Prisma client was not regenerated**

### Solution Steps

#### 1. Kill Running Processes

```bash
# Windows PowerShell
taskkill /f /im node.exe

# Or manually stop development server
```

#### 2. Regenerate Prisma Client

```bash
cd "your-project-directory"
npx prisma generate
```

#### 3. Verify Migration Status

```bash
npx prisma migrate status
```

#### 4. Start Development Server

```bash
pnpm run dev
```

### Prevention

Always run these commands after schema changes:

1. `npx prisma migrate dev --name "description"`
2. `npx prisma generate`

### Common Errors

#### Error 1: Permission Denied

```
EPERM: operation not permitted, unlink 'query_engine-windows.dll.node'
```

**Solution**: Kill all Node.js processes first, then regenerate.

#### Error 2: Database Out of Sync

```
Your database is not in sync with your schema
```

**Solution**: Run `npx prisma migrate dev` or `npx prisma db push`

#### Error 3: Unknown Field in Types

```
Property 'fieldName' does not exist on type
```

**Solution**: Regenerate Prisma client and restart TypeScript server.

### Verification

Check if fields are available by looking at generated types:

```typescript
// In node_modules/.prisma/client/index.d.ts
export type Motorcycle = {
  id: string;
  brand: string;
  // ... verify expected fields are present
};
```

### Best Practices

1. Always regenerate client after schema changes
2. Use `npx prisma migrate dev` for development
3. Kill development server before regenerating
4. Verify migration status before proceeding
5. Check generated types if still having issues
