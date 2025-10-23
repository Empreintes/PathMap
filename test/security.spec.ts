import { describe, it } from "mocha"
import { expect } from "chai"
import { PathMap } from "../src/PathMap"

describe("Security Tests", () => {
  describe("Prototype Pollution Prevention", () => {
    it("should reject __proto__ key from JSON string", () => {
      expect(() => {
        new PathMap('{"__proto__": {"polluted": true}}')
      }).to.throw(Error, 'Dangerous key "__proto__" is not allowed')
    })

    it("should reject __proto__ key from parsed JSON", () => {
      const maliciousData = JSON.parse('{"__proto__": {"polluted": true}}')
      expect(() => {
        new PathMap(maliciousData)
      }).to.throw(Error, 'Dangerous key "__proto__" is not allowed')
    })

    it("should reject constructor key", () => {
      expect(() => {
        new PathMap({ "constructor": { polluted: true } })
      }).to.throw(Error, 'Dangerous key "constructor" is not allowed')
    })

    it("should reject prototype key", () => {
      expect(() => {
        new PathMap({ "prototype": { polluted: true } })
      }).to.throw(Error, 'Dangerous key "prototype" is not allowed')
    })

    it("should accept safe keys", () => {
      expect(() => {
        new PathMap({ "safe_key": "value", "another": 123 })
      }).to.not.throw()
    })
  })

  describe("JSON Parsing Safety", () => {
    it("should handle invalid JSON gracefully", () => {
      expect(() => {
        new PathMap('{"invalid": json}')
      }).to.throw(SyntaxError, "PathMap: Invalid JSON string")
    })

    it("should handle valid JSON", () => {
      expect(() => {
        new PathMap('{"valid": "json"}')
      }).to.not.throw()
    })

    it("should reject malformed JSON", () => {
      expect(() => {
        new PathMap('{incomplete')
      }).to.throw(SyntaxError)
    })
  })

  describe("Array Bounds Checking", () => {
    it("should reject out of bounds positive index", () => {
      const pathMap = new PathMap({ data: [1, 2, 3] })
      expect(() => {
        pathMap.path("data#10")
      }).to.throw(Error, "Index 10 out of bounds")
    })

    it("should reject negative index", () => {
      const pathMap = new PathMap({ data: [1, 2, 3] })
      // Regex doesn't match negative numbers, so it will fail with a different error
      expect(() => {
        pathMap.path("data#-1")
      }).to.throw(Error)
    })

    it("should accept valid array index", () => {
      const pathMap = new PathMap({ data: [1, 2, 3] })
      expect(pathMap.path("data#0")).to.equal(1)
      expect(pathMap.path("data#2")).to.equal(3)
    })

    it("should handle nested array bounds checking", () => {
      const pathMap = new PathMap({ 
        data: [
          { items: [10, 20, 30] },
          { items: [40, 50] }
        ]
      })
      expect(() => {
        pathMap.path("data#0.items#5")
      }).to.throw(Error, "Index 5 out of bounds")
    })
  })

  describe("Path Validation", () => {
    it("should reject empty path", () => {
      const pathMap = new PathMap({ data: "value" })
      expect(() => {
        pathMap.path("")
      }).to.throw(Error, "path cannot be empty")
    })

    it("should reject invalid path segments", () => {
      const pathMap = new PathMap({ data: "value" })
      expect(() => {
        pathMap.path("data.!@#$%")
      }).to.throw(Error, "Invalid path segment")
    })
  })

  describe("Type Safety", () => {
    it("should handle non-string path input", () => {
      const pathMap = new PathMap({ data: "value" })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pathMap.path(null as any)).to.be.null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(pathMap.path(undefined as any)).to.be.null
    })
  })
})
