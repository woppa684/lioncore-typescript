import {asIds, Issue} from "../../src-pkg/index.js"


/**
 * Deletes all {@code undefined} values in objects hanging off of the given root.
 * This makes it possible to compare serializations before and after writing to disk,
 * because:
<pre>!deepEqual({ foo: undefined }, {})</pre>
 */
export const undefinedValuesDeletedFrom = <T>(root: T): T => {
    const visited: Record<string, unknown>[] = []

    const visit = (val: unknown) => {
        if (Array.isArray(val)) {
            val.forEach(visit)
        }

        if (typeof val !== "object") {
            return
        }

        const obj = val as Record<string, unknown>

        if (visited.indexOf(obj) > -1) {
            return obj
        }
        visited.push(obj)

        Object.entries(obj).forEach(([key, value]) => {
            if (value === undefined) {
                delete obj[key]
            } else {
                if (value !== null) {
                    visit(value)
                }
            }
        })
    }

    visit(root)

    return root
}


export const logUnresolvedReferences = (unresolvedReferences: string[]) => {
    if (unresolvedReferences.length > 0) {
        console.error(`unresolved references:`)
        unresolvedReferences.forEach((location) => {
            console.error(`\t${location}`)
        })
    }
}


export const logIssues = (issues: Issue[]) => {
    if (issues.length > 0) {
        console.error(`constraint violations:`)
        issues.forEach(({message, secondaries}) => {
            console.error(`\t${message}`)
            if (secondaries.length > 0 ) {
                console.error(`\t\tIDs of secondary locations: ${asIds(secondaries).join(", ")}`)
            }
        })
    }
}

