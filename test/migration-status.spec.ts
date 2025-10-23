import { describe, it } from "mocha"
import { expect } from "chai"
import { MigrationStatus } from "../src/migration-status"

describe("Migration Status", () => {
  describe("checkMigrationStatus", () => {
    it("should identify breaking changes in 0.0.4", () => {
      const migrationStatus = new MigrationStatus("0.0.3")
      const info = migrationStatus.checkMigrationStatus("0.0.4")

      expect(info.hasBreakingChanges).to.be.true
      expect(info.compatibilityStatus).to.equal("needs-migration")
      expect(info.securityImprovements).to.have.length.greaterThan(0)
      expect(info.migrationSteps).to.have.length.greaterThan(0)
    })

    it("should show compatible status for same version", () => {
      const migrationStatus = new MigrationStatus("0.0.3")
      const info = migrationStatus.checkMigrationStatus("0.0.3")

      expect(info.hasBreakingChanges).to.be.false
      expect(info.compatibilityStatus).to.equal("compatible")
    })

    it("should throw error for unknown version", () => {
      const migrationStatus = new MigrationStatus("0.0.3")
      expect(() => {
        migrationStatus.checkMigrationStatus("99.99.99")
      }).to.throw(Error, "Version information not found")
    })
  })

  describe("getSecurityStatus", () => {
    it("should report security fixes for 0.0.4", () => {
      const migrationStatus = new MigrationStatus("0.0.4")
      const status = migrationStatus.getSecurityStatus()

      expect(status.version).to.equal("0.0.4")
      expect(status.securityFixes).to.have.length.greaterThan(0)
      expect(status.securityFixes).to.include("Added prototype pollution prevention")
    })

    it("should recommend upgrade for older versions", () => {
      const migrationStatus = new MigrationStatus("0.0.3")
      const status = migrationStatus.getSecurityStatus()

      expect(status.hasSecurityIssues).to.be.true
      expect(status.recommendations).to.have.length.greaterThan(0)
    })

    it("should throw error for unknown version", () => {
      const migrationStatus = new MigrationStatus("99.99.99")
      expect(() => {
        migrationStatus.getSecurityStatus()
      }).to.throw(Error, "Version information not found")
    })
  })

  describe("printMigrationReport", () => {
    it("should not throw when printing migration report", () => {
      const migrationStatus = new MigrationStatus("0.0.3")
      expect(() => {
        migrationStatus.printMigrationReport("0.0.4")
      }).to.not.throw()
    })
  })

  describe("printSecurityReport", () => {
    it("should not throw when printing security report", () => {
      const migrationStatus = new MigrationStatus("0.0.4")
      expect(() => {
        migrationStatus.printSecurityReport()
      }).to.not.throw()
    })
  })
})
