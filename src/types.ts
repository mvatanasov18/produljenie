import type { Position } from "@threlte/core"

export type StarData = {
    id: string,
    rightAscencion: number,
    declination: number,
    parallax: number,
    pseudocolor: string,
    mag: number,
    coordinates: Position,
    discoverer: string|undefined,
    scientificName: string |undefined
    givenName: string | undefined
}

export type Connection = {
    startingStar: StarData | undefined,
    endingStar: StarData | undefined
}

export type ConstellationData = {
    id:string
    name: string,
    discoverer: string,
    connections: Connection[],
    viewedFromStarId: string
}