# Security Policy

## Security Improvements in Version 0.0.4

PathMap v0.0.4 includes several important security enhancements to protect against common vulnerabilities:

### 1. Prototype Pollution Prevention

**Issue**: Malicious input could potentially pollute JavaScript object prototypes through special keys like `__proto__`, `constructor`, or `prototype`.

**Fix**: The constructor now explicitly checks for and rejects these dangerous keys:

```typescript
const dangerousKeys = ["__proto__", "constructor", "prototype"]
for (const key of dangerousKeys) {
  if (Object.prototype.hasOwnProperty.call(_data, key)) {
    throw new Error(`PathMap: Dangerous key "${key}" is not allowed`)
  }
}
```

**Impact**: Prevents prototype pollution attacks that could lead to arbitrary code execution or property injection.

### 2. Safe JSON Parsing

**Issue**: Unvalidated JSON parsing could lead to errors that expose system information or crash the application.

**Fix**: JSON parsing is now wrapped in try-catch with proper error handling:

```typescript
if (typeof data === "string") {
  try {
    _data = JSON.parse(data)
  } catch (error) {
    throw new SyntaxError(`PathMap: Invalid JSON string - ${error.message}`)
  }
}
```

**Impact**: Prevents information disclosure through error messages and provides better error handling.

### 3. Array Bounds Checking

**Issue**: Accessing array indices without validation could lead to undefined behavior or information disclosure.

**Fix**: All array access now includes bounds checking:

```typescript
const idx = parseInt(index_value, 10)
if (idx < 0 || idx >= out.length) {
  throw new Error(`PathMap: Index ${idx} out of bounds for array of length ${out.length}`)
}
```

**Impact**: Prevents out-of-bounds access that could lead to unexpected behavior or crashes.

### 4. Input Validation

**Issue**: Unvalidated path input could lead to injection attacks or unexpected behavior.

**Fix**: Path segments are now validated before processing:

```typescript
if (!dot_path || dot_path.length === 0) {
  throw new Error("PathMap: path cannot be empty")
}

const matches = [...rawkey_name.matchAll(this.regex)]
if (matches.length === 0) {
  throw new Error(`PathMap: Invalid path segment "${rawkey_name}"`)
}
```

**Impact**: Prevents malformed input from causing unexpected behavior.

## Running Security Checks

You can check the security status of your PathMap installation:

```bash
npm run migration:status
```

This will display:
- Current version security fixes
- Known security issues (if any)
- Upgrade recommendations

## Migration Guide

### Migrating to v0.0.4

Version 0.0.4 includes breaking changes for improved security. To migrate:

1. **Check for dangerous keys**: Ensure your data doesn't use `__proto__`, `constructor`, or `prototype` as keys
2. **Handle empty paths**: Add error handling for cases where paths might be empty
3. **Validate path segments**: Ensure path segments contain only valid characters (alphanumeric and underscores)
4. **Check array indices**: Validate that array indices are within bounds before accessing
5. **Update error handling**: Update tests and error handling to expect errors for invalid inputs

Check migration status:

```bash
npm run migration:check 0.0.4
```

## Reporting Security Issues

If you discover a security vulnerability in PathMap, please report it by creating a GitHub issue or contacting the maintainer directly.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Best Practices

When using PathMap:

1. **Validate input data**: Always validate data before passing it to PathMap
2. **Handle errors**: Wrap PathMap operations in try-catch blocks
3. **Use type checking**: Leverage TypeScript types to catch potential issues at compile time
4. **Sanitize user input**: Never pass unsanitized user input directly to PathMap
5. **Keep dependencies updated**: Regularly update PathMap to get the latest security fixes

## Security Testing

PathMap includes comprehensive security tests in `test/security.spec.ts`:

- Prototype pollution prevention tests
- JSON parsing safety tests
- Array bounds checking tests
- Path validation tests
- Type safety tests

Run security tests:

```bash
npm test
```

## Dependency Security

PathMap has minimal runtime dependencies. Development dependencies are regularly updated to address known vulnerabilities.

Check for dependency vulnerabilities:

```bash
npm audit
```

## Version History

- **v0.0.4**: Added prototype pollution prevention, improved JSON parsing, array bounds checking, and input validation
- **v0.0.3**: Previous version (security improvements recommended)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Prototype Pollution](https://portswigger.net/web-security/prototype-pollution)
