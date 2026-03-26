import * as THREE from 'three'

interface TargetEntry {
  id: string
  position: THREE.Vector3
  radius: number
  onHit: () => void
}

const targets = new Map<string, TargetEntry>()

export function registerTarget(entry: TargetEntry) {
  targets.set(entry.id, entry)
}

export function unregisterTarget(id: string) {
  targets.delete(id)
}

const _diff = new THREE.Vector3()

/**
 * Check if a ray hits any registered target.
 * Returns the id of the closest hit target, or null.
 */
export function checkRayHit(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  maxDist: number,
): string | null {
  let closestId: string | null = null
  let closestT = maxDist

  for (const [id, target] of targets) {
    // Ray-sphere intersection
    _diff.subVectors(target.position, origin)
    const tca = _diff.dot(direction)
    if (tca < 0) continue // target is behind the ray

    const d2 = _diff.lengthSq() - tca * tca
    const r2 = target.radius * target.radius
    if (d2 > r2) continue // ray misses the sphere

    const thc = Math.sqrt(r2 - d2)
    const t = tca - thc
    if (t > 0 && t < closestT) {
      closestT = t
      closestId = id
    }
  }

  if (closestId) {
    targets.get(closestId)?.onHit()
  }
  return closestId
}

/**
 * Check if a moving sphere (projectile) hits any registered target along its path.
 * Returns the id of the closest hit target, or null.
 */
export function checkProjectileHit(
  prevPos: THREE.Vector3,
  currPos: THREE.Vector3,
  projectileRadius: number,
): string | null {
  const dir = _diff.subVectors(currPos, prevPos)
  const segLen = dir.length()
  if (segLen < 0.0001) return null
  dir.divideScalar(segLen) // normalize

  let closestId: string | null = null
  let closestT = segLen

  for (const [id, target] of targets) {
    const combinedR = projectileRadius + target.radius
    const oc = new THREE.Vector3().subVectors(prevPos, target.position)
    const b = oc.dot(dir)
    const c = oc.lengthSq() - combinedR * combinedR
    const disc = b * b - c
    if (disc < 0) continue
    const t = -b - Math.sqrt(disc)
    if (t >= 0 && t < closestT) {
      closestT = t
      closestId = id
    }
    // Also check if projectile is already inside the sphere
    if (t < 0 && c < 0 && closestId === null) {
      closestT = 0
      closestId = id
    }
  }

  return closestId
}

/**
 * Check if any targets are within explosion radius.
 * Calls onHit for each target hit.
 */
export function checkExplosionHits(center: THREE.Vector3, radius: number): string[] {
  const hits: string[] = []
  for (const [id, target] of targets) {
    const dist = center.distanceTo(target.position)
    if (dist < radius + target.radius) {
      target.onHit()
      hits.push(id)
    }
  }
  return hits
}
