export class PathMap extends Map {
  regex = /(?<key_name>\w+)#?(?<index_value>\d+)?/g

  /**
   * @throws {SyntaxError} if can't perform iteration on data
   * @param data
   */
  constructor(data: string | JSON | Record<string | number, unknown>) {
    super()
    const _data = typeof data === "string" ? JSON.parse(data) : data
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
    dot_path.split(".").forEach((rawkey_name) => {
      const { key_name, index_value } = [
        ...rawkey_name.matchAll(this.regex)
      ].pop().groups

      if (this.has(key_name) && out === null) {
        out = this.get(key_name)
        if (index_value !== undefined && Array.isArray(out)) {
          out = out[index_value]
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

      out =
        Array.isArray(out[key_name]) && index_value !== undefined
          ? out[key_name][index_value]
          : out[key_name]
    })
    return out
  }
}
