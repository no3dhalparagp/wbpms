import { prisma } from "./prisma"

export type SystemSettingsMap = Record<string, boolean>

export async function getSystemSettings(): Promise<SystemSettingsMap> {
  const rows = await prisma.systemSetting.findMany()
  const settings = Object.fromEntries(
    rows.map((row: { key: string; boolValue: boolean | null; value: string | null }) => [
      row.key,
      row.boolValue ?? (row.value === "true"),
    ])
  ) as SystemSettingsMap

  if (settings["feature.gpMenu.enabled"] === undefined) {
    settings["feature.gpMenu.enabled"] = true
  }

  return settings
}

export async function setSystemSetting(key: string, enabled: boolean) {
  await prisma.systemSetting.upsert({
    where: { key },
    update: { boolValue: enabled, value: String(enabled) },
    create: { key, boolValue: enabled, value: String(enabled) },
  })
}

