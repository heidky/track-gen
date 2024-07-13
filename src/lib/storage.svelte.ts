export interface Profile {
    id: string
    payload: any
}

function getProfiles(): Profile[] {
    const data = localStorage.getItem('__profiles')
    const profiles = data != null ? JSON.parse(data) : []
    return profiles
}

function setProfiles(profiles: Profile[]) {
    const data = JSON.stringify(profiles, null, 2)
    localStorage.setItem('__profiles', data)
}

// export function addProfile(profile: [])

export function profileStorage() {
    const profiles = $state(getProfiles())

    return {
        save(id: string, payload: any): boolean {
            id = id.trim()
            if (id.length <= 0) return false
            const index = profiles.findIndex((p) => p.id === id)
            if (index < 0) {
                profiles.push({ id, payload })
            } else {
                profiles[index].payload = payload
            }
            setProfiles(profiles)
            return true
        },

        load(id: string): any | null {
            id = id.trim()
            const profile = profiles.find((p) => p.id === id)
            return structuredClone($state.snapshot(profile?.payload)) ?? null
        },

        delete(id: string): boolean {
            id = id.trim()
            const index = profiles.findIndex((p) => p.id === id)
            if (index < 0) {
                return false
            }

            profiles.splice(index, 1)
            setProfiles(profiles)
            return true
        },

        get() {
            return profiles
        },

        getByName(name: string | null): Profile | null {
            if (!name) return null
            return profiles.find((p) => p.id === name) ?? null
        },
    }
}
