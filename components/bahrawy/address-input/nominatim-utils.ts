export interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    house_number?: string
    road?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}

export interface AddressData {
  street: string
  city: string
  state: string
  zip: string
  country: string
  lat?: number
  lon?: number
  formatted?: string
}

/**
 * Search for addresses using Nominatim (OpenStreetMap)
 */
export async function searchAddress(
  query: string,
  signal?: AbortSignal,
): Promise<NominatimResult[]> {
  if (!query.trim() || query.length < 3) return []

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '5',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        'Accept-Language': 'en',
      },
      signal,
    },
  )

  if (!response.ok) return []
  return response.json()
}

/**
 * Reverse geocode coordinates to an address
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<NominatimResult | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
    addressdetails: '1',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    {
      headers: {
        'Accept-Language': 'en',
      },
      signal,
    },
  )

  if (!response.ok) return null
  return response.json()
}

/**
 * Convert Nominatim result to our AddressData format
 */
export function toAddressData(result: NominatimResult): AddressData {
  const addr = result.address
  const street = [addr.house_number, addr.road].filter(Boolean).join(' ')
  const city = addr.city || addr.town || addr.village || ''

  return {
    street,
    city,
    state: addr.state ?? '',
    zip: addr.postcode ?? '',
    country: addr.country ?? '',
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    formatted: result.display_name,
  }
}
