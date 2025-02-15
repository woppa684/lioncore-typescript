import {SerializationChunk, sortByStringKey} from "../src-pkg/index.js"


/**
 * @return A shortened version of a {@link SerializedModel JSON serialization}, which should make it easier to inspect.
 *  Note that the shortened version doesn't contain all information, and could (in theory) be malformed.
 */
export const shortenedSerialization = ({nodes}: SerializationChunk) =>
    nodes.map((node) => ({
        id: node.id,
        concept: node.concept.key,
        parent: node.parent ?? undefined,
        ...Object.fromEntries(
            [
                ...node.properties.map((serProp) => [serProp.property.key, serProp.value]),
                ...node.children.map((serContainment) => [serContainment.containment.key, serContainment.children]),
                ...node.references.map((serReference) => [serReference.reference.key, serReference.targets.map(({reference}) => reference)])
            ]
        )
    }))


/**
 * @return A sorted version of a {@link SerializedModel JSON serialization}, which should make it easier to inspect.
 *  Note that the sorted version destroy the order of links, which might effectively alter semantics.
 */
export const sortedSerialization = ({serializationFormatVersion, languages, nodes}: SerializationChunk): SerializationChunk =>
    ({
        serializationFormatVersion,
        languages,
        nodes: sortByStringKey(nodes, ({id}) => id)
            .map((node) => ({
                id: node.id,
                concept: node.concept,
                parent: node.parent,
                properties: sortByStringKey(node.properties, ({property}) => property.key),
                children: sortByStringKey(node.children, ({containment}) => containment.key)
                        .map(({containment, children}) => ({
                            containment,
                            children: children.sort()
                        })),
                references: sortByStringKey(node.references, ({reference}) => reference.key)
                        .map(({reference, targets}) => ({
                            reference,
                            targets: sortByStringKey(targets, ({reference}) => reference)
                        }))
            }))
    })

