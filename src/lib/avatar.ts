import { createAvatar } from "@dicebear/core"
import { avataaars } from "@dicebear/collection"

export function generateAvatar(seed: string): string {
  const avatar = createAvatar(avataaars, {
    seed,
    size: 128,
    backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
    backgroundType: ["solid"],
  })

  return avatar.toDataUri()
}

export function generateAvatarFromEmail(email: string): string {
  return generateAvatar(email)
}

export function generateAvatarFromName(name: string): string {
  return generateAvatar(name)
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
