# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.4] - 2025-10-23

### Added
- Migration status utility with CLI (`npm run migration:status`, `npm run migration:check`)
- Comprehensive security test suite (18 security-focused tests)
- SECURITY.md documentation with best practices
- CHANGELOG.md to track version changes
- Security section in README.md

### Security
- **Prototype pollution prevention**: Now rejects dangerous keys (`__proto__`, `constructor`, `prototype`)
- **Safe JSON parsing**: Added try-catch with proper error handling for JSON.parse()
- **Array bounds checking**: All array access now validates indices are within bounds
- **Input validation**: Path segments are validated before processing
- **Updated dependencies**: Upgraded mocha to fix CVE vulnerabilities

### Changed
- **BREAKING**: Constructor now throws an error when dangerous keys are present
- **BREAKING**: Empty paths now throw an error instead of returning null
- **BREAKING**: Invalid path segments now throw an error instead of failing silently
- **BREAKING**: Out-of-bounds array access now throws an error

### Fixed
- CVE in nanoid (via mocha upgrade)
- CVE in serialize-javascript (via mocha upgrade)
- Potential prototype pollution vulnerability
- Unsafe JSON parsing
- Unchecked array access

## [0.0.3] - Previous

### Note
- Previous version without security enhancements
- Upgrade to 0.0.4 recommended for security improvements

## Migration Guide

### From 0.0.3 to 0.0.4

#### Breaking Changes

1. **Dangerous keys are now rejected**
   ```javascript
   // ❌ This will now throw an error
   new PathMap({ "__proto__": { polluted: true } })
   
   // ✅ Use safe keys instead
   new PathMap({ "safe_key": "value" })
   ```

2. **Empty paths throw errors**
   ```javascript
   // ❌ This will now throw an error
   pathMap.path("")
   
   // ✅ Always provide valid paths
   pathMap.path("data.field")
   ```

3. **Invalid path segments throw errors**
   ```javascript
   // ❌ This will now throw an error
   pathMap.path("data.!invalid")
   
   // ✅ Use valid alphanumeric paths
   pathMap.path("data.valid_field")
   ```

4. **Array bounds are checked**
   ```javascript
   // ❌ This will now throw an error if out of bounds
   pathMap.path("data#999")
   
   // ✅ Check array length or handle errors
   try {
     const value = pathMap.path("data#0")
   } catch (error) {
     // Handle out of bounds
   }
   ```

#### Action Items

1. Search your codebase for uses of dangerous keys
2. Add error handling around PathMap.path() calls
3. Validate input data before passing to PathMap
4. Test with the new version in a staging environment
5. Update tests to expect errors for invalid inputs

#### Security Benefits

After migrating, you'll benefit from:
- Protection against prototype pollution attacks
- Safer JSON parsing
- Prevention of out-of-bounds access
- Better input validation

Check migration status with:
```bash
npm run migration:check 0.0.4
```
