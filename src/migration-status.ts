/**
 * Migration Status Utility
 * 
 * This utility helps track migration status and compatibility between versions
 * of PathMap. It checks for breaking changes and provides migration guidance.
 */

export interface MigrationInfo {
  currentVersion: string
  targetVersion?: string
  hasBreakingChanges: boolean
  securityImprovements: string[]
  migrationSteps: string[]
  compatibilityStatus: "compatible" | "needs-migration" | "incompatible"
}

export interface VersionInfo {
  version: string
  breakingChanges: string[]
  securityFixes: string[]
  deprecated: string[]
}

// Version history with security and breaking changes
const versionHistory: Record<string, VersionInfo> = {
  "0.0.4": {
    version: "0.0.4",
    breakingChanges: [
      "Dangerous keys (__proto__, constructor, prototype) are now rejected",
      "Empty paths now throw an error instead of returning null",
      "Invalid path segments now throw an error",
      "Array index bounds are now strictly checked"
    ],
    securityFixes: [
      "Added prototype pollution prevention",
      "Improved JSON parsing with proper error handling",
      "Added array bounds checking to prevent out-of-bounds access",
      "Added input validation for path segments"
    ],
    deprecated: []
  },
  "0.0.3": {
    version: "0.0.3",
    breakingChanges: [],
    securityFixes: [],
    deprecated: []
  }
}

export class MigrationStatus {
  private currentVersion: string

  constructor(currentVersion: string) {
    this.currentVersion = currentVersion
  }

  /**
   * Check migration status from current version to target version
   */
  checkMigrationStatus(targetVersion: string): MigrationInfo {
    const currentInfo = versionHistory[this.currentVersion]
    const targetInfo = versionHistory[targetVersion]

    if (!currentInfo || !targetInfo) {
      throw new Error(`Version information not found for ${this.currentVersion} or ${targetVersion}`)
    }

    const hasBreakingChanges = targetInfo.breakingChanges.length > 0
    const migrationSteps: string[] = []

    // Determine compatibility status
    let compatibilityStatus: "compatible" | "needs-migration" | "incompatible" = "compatible"

    if (hasBreakingChanges) {
      compatibilityStatus = "needs-migration"
      migrationSteps.push("Review breaking changes before upgrading")
      
      targetInfo.breakingChanges.forEach(change => {
        migrationSteps.push(`- ${change}`)
      })

      migrationSteps.push("")
      migrationSteps.push("Action items:")
      migrationSteps.push("1. Ensure your code doesn't use dangerous keys (__proto__, constructor, prototype)")
      migrationSteps.push("2. Add error handling for empty paths")
      migrationSteps.push("3. Validate path segments before use")
      migrationSteps.push("4. Check array indices are within bounds before accessing")
      migrationSteps.push("5. Update tests to expect errors for invalid inputs")
    }

    return {
      currentVersion: this.currentVersion,
      targetVersion,
      hasBreakingChanges,
      securityImprovements: targetInfo.securityFixes,
      migrationSteps,
      compatibilityStatus
    }
  }

  /**
   * Get security status for current version
   */
  getSecurityStatus(): {
    version: string
    hasSecurityIssues: boolean
    securityFixes: string[]
    recommendations: string[]
  } {
    const currentInfo = versionHistory[this.currentVersion]
    
    if (!currentInfo) {
      throw new Error(`Version information not found for ${this.currentVersion}`)
    }

    const recommendations: string[] = []
    const latestVersion = Object.keys(versionHistory).sort().pop()!
    const latestInfo = versionHistory[latestVersion]

    if (this.currentVersion !== latestVersion && latestInfo.securityFixes.length > 0) {
      recommendations.push(`Upgrade to version ${latestVersion} for security improvements:`)
      latestInfo.securityFixes.forEach(fix => {
        recommendations.push(`  - ${fix}`)
      })
    }

    return {
      version: this.currentVersion,
      hasSecurityIssues: this.currentVersion !== latestVersion && latestInfo.securityFixes.length > 0,
      securityFixes: currentInfo.securityFixes,
      recommendations
    }
  }

  /**
   * Print migration report
   */
  printMigrationReport(targetVersion: string): void {
    const info = this.checkMigrationStatus(targetVersion)
    
    console.log("=".repeat(60))
    console.log("PATHMAP MIGRATION STATUS REPORT")
    console.log("=".repeat(60))
    console.log(`Current Version: ${info.currentVersion}`)
    console.log(`Target Version:  ${info.targetVersion}`)
    console.log(`Compatibility:   ${info.compatibilityStatus.toUpperCase()}`)
    console.log("")

    if (info.hasBreakingChanges) {
      console.log("⚠️  BREAKING CHANGES DETECTED")
      console.log("-".repeat(60))
      info.migrationSteps.forEach(step => console.log(step))
      console.log("")
    }

    if (info.securityImprovements.length > 0) {
      console.log("🔒 SECURITY IMPROVEMENTS")
      console.log("-".repeat(60))
      info.securityImprovements.forEach(improvement => {
        console.log(`✓ ${improvement}`)
      })
      console.log("")
    }

    console.log("=".repeat(60))
  }

  /**
   * Print security status report
   */
  printSecurityReport(): void {
    const status = this.getSecurityStatus()
    
    console.log("=".repeat(60))
    console.log("PATHMAP SECURITY STATUS REPORT")
    console.log("=".repeat(60))
    console.log(`Version: ${status.version}`)
    console.log("")

    if (status.securityFixes.length > 0) {
      console.log("🔒 SECURITY FIXES IN THIS VERSION")
      console.log("-".repeat(60))
      status.securityFixes.forEach(fix => {
        console.log(`✓ ${fix}`)
      })
      console.log("")
    }

    if (status.hasSecurityIssues) {
      console.log("⚠️  SECURITY RECOMMENDATIONS")
      console.log("-".repeat(60))
      status.recommendations.forEach(rec => console.log(rec))
      console.log("")
    } else {
      console.log("✅ No known security issues in current version")
      console.log("")
    }

    console.log("=".repeat(60))
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)
  const command = args[0]
  const currentVersion = "0.0.4" // Should be read from package.json in production

  const migrationStatus = new MigrationStatus(currentVersion)

  if (command === "security") {
    migrationStatus.printSecurityReport()
  } else if (command === "check" && args[1]) {
    migrationStatus.printMigrationReport(args[1])
  } else {
    console.log("Usage:")
    console.log("  ts-node src/migration-status.ts security           - Show security status")
    console.log("  ts-node src/migration-status.ts check <version>    - Check migration to version")
    console.log("")
    console.log("Examples:")
    console.log("  ts-node src/migration-status.ts security")
    console.log("  ts-node src/migration-status.ts check 0.0.4")
  }
}
