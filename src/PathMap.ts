export class PathMap extends Map {
  regex = /(?<key_name>\w+)#?(?<index_value>\d+)?/g

  /**
   * @throws {SyntaxError} if can't perform iteration on data
   * @param data
   */
  constructor(data: string | JSON | Record<string | number, unknown>) {
    super()
    let _data: Record<string | number, unknown>
    
    // Safely parse JSON data
    if (typeof data === "string") {
      try {
        _data = JSON.parse(data)
      } catch (error) {
        throw new SyntaxError(`PathMap: Invalid JSON string - ${error.message}`)
      }
    } else {
      _data = data as Record<string | number, unknown>
    }

    // Prevent prototype pollution by checking dangerous keys
    const dangerousKeys = ["__proto__", "constructor", "prototype"]
    
    // Check for dangerous keys including in parsed JSON
    for (const key of dangerousKeys) {
      if (Object.prototype.hasOwnProperty.call(_data, key)) {
        throw new Error(`PathMap: Dangerous key "${key}" is not allowed`)
      }
    }
    
    for (const [key, value] of Object.entries(_data)) {
      this.set(key, value)
    }
  }

  /**
   * @throws {Error} if path
   * @param dot_path
   */
  path(dot_path: string): unknown {
    let out = null
    if (typeof dot_path !== "string") return null
    
    // Validate path input to prevent injection
    if (!dot_path || dot_path.length === 0) {
      throw new Error("PathMap: path cannot be empty")
    }

    dot_path.split(".").forEach((rawkey_name) => {
      const matches = [...rawkey_name.matchAll(this.regex)]
      if (matches.length === 0) {
        throw new Error(`PathMap: Invalid path segment "${rawkey_name}"`)
      }
      
      const { key_name, index_value } = matches.pop().groups

      if (this.has(key_name) && out === null) {
        out = this.get(key_name)
        if (index_value !== undefined && Array.isArray(out)) {
          const idx = parseInt(index_value, 10)
          if (idx < 0 || idx >= out.length) {
            throw new Error(`PathMap: Index ${idx} out of bounds for array of length ${out.length}`)
          }
          out = out[idx]
        }
        return
      }

      if (out === null || out === undefined)
        throw new Error(`PathMap : can't find value from ${out}`)

      if (typeof out[key_name] !== "object" && index_value !== undefined)
        throw new Error(
          `PathMap : Can't find ${index_value} on non object : ${typeof out[
            key_name
          ]}`
        )

      if (Array.isArray(out[key_name]) && index_value !== undefined) {
        const idx = parseInt(index_value, 10)
        if (idx < 0 || idx >= out[key_name].length) {
          throw new Error(`PathMap: Index ${idx} out of bounds for array of length ${out[key_name].length}`)
        }
        out = out[key_name][idx]
      } else {
        out = out[key_name]
      }
    })
    return out
  }
}
