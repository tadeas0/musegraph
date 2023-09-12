import type { Artist } from "./types/Artist";

const DBPEDIA_URL = "https://dbpedia.org/sparql";
const PREFIXES = `@prefix dbo: <http://dbpedia.org/ontology/>.
				  @prefix schema: <https://schema.org/>.`;

interface ArtistResponse {
    results: {
        bindings: {
            name: { value: string };
            artist: { value: string };
            genreName: { value: string } | undefined;
        }[];
    };
}

function mapResults(res: ArtistResponse): Artist[] {
    const artists: Artist[] = [];
    for (const b of res.results.bindings) {
        const i = artists.findIndex((a) => a.dbpediaUrl === b.artist.value);
        if (i !== -1 && b.genreName) {
            artists[i].genres.push(b.genreName.value);
        } else {
            const genres = b.genreName ? [b.genreName.value] : [];
            artists.push({
                name: b.name.value,
                dbpediaUrl: b.artist.value,
                genres: genres
            });
        }
    }

    return artists;
}

export async function sendQuery(query: string) {
    const fullQuery = `${PREFIXES}
                       ${query}`;
    const params = new URLSearchParams({
        query: fullQuery
    });
    return fetch(`${DBPEDIA_URL}?${params}`, {
        method: "GET",
        headers: {
            accept: "application/json"
        }
    });
}

export async function getArtistsByName(name: string, limit = 10): Promise<Artist[]> {
    const res = await sendQuery(
        `SELECT DISTINCT ?artist ?name ?genreName
            WHERE {
				{
                    ?s dbo:artist|dbp:artist ?artist.
                } UNION {
                    ?artist a dbo:Band.
                }
				?artist dbp:name ?name.
                OPTIONAL {
                    ?artist dbo:genre ?genre.
                    ?genre rdfs:label ?genreName.
                }
                FILTER regex(?name, ".*${name}.*", "i").
                FILTER (lang(?name) = "en").
                FILTER (!bound(?genreName) || lang(?genreName) = "en").
			}
            LIMIT ${limit}`
    );
    const b: ArtistResponse = await res.json();
    return mapResults(b);
}

export async function getArtistByUrl(artistUrl: string): Promise<Artist> {
    const res = await sendQuery(
        `SELECT DISTINCT ?name ?genreName
        WHERE {
            <${artistUrl}> dbp:name ?name.
            OPTIONAL {
                <${artistUrl}> dbo:genre ?genre.
                ?genre rdfs:label ?genreName.
            }
            FILTER (lang(?name) = "en").
            FILTER (!bound(?genreName) || lang(?genreName) = "en").
        }
        LIMIT 100`
    );
    const d: {
        results: {
            bindings: { name: { value: string }; genreName: { value: string } }[];
        };
    } = await res.json();
    const genres = d.results.bindings
        .filter((a) => a.genreName)
        .map((a) => a.genreName.value);
    return d.results.bindings.map((a) => ({
        name: a.name.value,
        dbpediaUrl: artistUrl,
        genres
    }))[0];
}

export async function getSimilarArtists(artistUrl: string): Promise<Artist[]> {
    const res = await sendQuery(
        `SELECT * {
            {
                SELECT DISTINCT ?artist ?name
                WHERE {
                    <${artistUrl}> dbp:associatedActs|dbo:associatedMusicalArtist|dbo:associatedBand  ?artist.
                    ?artist dbp:name ?name.
                }
            } UNION {
                SELECT DISTINCT ?artist ?name
                WHERE {
                    ?artist dbp:associatedActs|dbo:associatedMusicalArtist|dbo:associatedBand <${artistUrl}>;
                    dbp:name ?name.
                }
            }
            OPTIONAL {
                ?artist dbo:genre ?genre.
                ?genre rdfs:label ?genreName.
            }
            FILTER (lang(?name) = "en").
            FILTER (!bound(?genreName) || lang(?genreName) = "en").
        }
        LIMIT 100`
    );
    const b = await res.json();
    return mapResults(b);
}
