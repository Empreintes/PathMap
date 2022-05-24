import { describe } from "mocha"
import { expect } from "chai"
import { PathMap } from "../src/PathMap"
import { contentProvider } from "@empreintes/content-provider"

const cp = contentProvider({ file_extension: "json", base_path: "./test/" })

describe("pathMap", () => {
  const nba = cp("nba")
  const pathMap = new PathMap(nba)

  it("nba data : simple path", () => {
    expect(
      pathMap.path("data#1.home_team.full_name"),
      "data > home_team > full_name "
    ).to.be.string("Boston Celtics")

    expect(pathMap.path("meta.total_pages"), "search meta > total_pages")
      .to.be.an("number")
      .and.eqls(2050)

    expect(pathMap.path("data#5.home_team"), "search in teams > home_team")
      .to.be.an("object")
      .and.ownPropertyDescriptor("full_name")

    expect(pathMap.path("data"), "first lvl data").to.be.an("array")

    expect(pathMap.path("meta"), "first lvl meta").to.be.an("object")

    expect(pathMap.path("data#2.postseason")).to.be.false
    expect(() => pathMap.path("stuff#890.postseason")).to.throw()
  })

  it("Wrong data", () => {
    expect(() => new PathMap(` "abbreviation": "CHA"`)).to.throw()
  })

  it("Functions types", () => {
    const f = new PathMap({
      [2]: () => 2,
      foo: { fighters: () => null }
    })
    expect(() => f.path("foo.fighters")).to.be.an("function")
    expect(() => f.path("2")).to.be.an("function")
  })
})
