# PathMap

return value somewhere in a json object, from a dotted string path

## Getting Started
This script target nodejs environment

    npm install @empreintes/pathmath
    # or
    yarn add @empreintes/pathmath

---
    const { PathMap } = require("@empreintes/pathmap")
    const data = {
      data: [
        {
          id: 47179,
          stuff: {
            id: 2
          }
        }
        ...
      ]
      foo : {
        bar : true
      }
    }
    const pathMap = new PathMap(data)
    pathMap.path("data#0.stuff.id") // 2
    pathMap.path("data#0.id") // 47179
    pathMap.path("foo.bar") // true

## Security

Version 0.0.4 includes important security improvements:

- 🔒 **Prototype pollution prevention** - Rejects dangerous keys (`__proto__`, `constructor`, `prototype`)
- ✅ **Safe JSON parsing** - Proper error handling for invalid JSON
- 🛡️ **Array bounds checking** - Prevents out-of-bounds access
- 🔍 **Input validation** - Validates path segments before processing

Check your security status:
```bash
npm run migration:status
```

See [SECURITY.md](SECURITY.md) for detailed security information and best practices.

## Migration Status

Check migration compatibility when upgrading:
```bash
npm run migration:check 0.0.4
```

This will show:
- Breaking changes between versions
- Security improvements
- Migration steps required

## Licence

released under the MIT license.

## Versioning

[Semantic Versioning](http://semver.org/) for versioning.

## Authors

- **Julien Appéré <@empreintes>** -
  [Github](https://github.com/empreintes) | [Twitter](https://twitter.com/empreintes)

## Acknowledgments

- This is a side project of a side project of a side project (for real)
- Use in production only if you know what you do.
- Extend Map Object for personal choice. 