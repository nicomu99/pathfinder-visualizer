import React, { useEffect } from 'react'
import { useSelector} from 'react-redux'
import {
    selectMap,
    selectTilesPerRow
} from './redux/mapSlice'
import * as d3 from 'd3'
import styles from './style/Path.module.css'
import Tile from './Tile'

export function Path() {
    const map = useSelector(selectMap)
    const tilesPerRow = useSelector(selectTilesPerRow)
    const tileSize = 18
    const tilePadding = 2

    useEffect(() => {
        // Calculate width and height of the canvas using the number of rows
        const tilesPerColumn = map.length / tilesPerRow
        const height = tilesPerColumn * (tileSize + tilePadding) - tilePadding
        const width = tilesPerRow * (tileSize + tilePadding) - tilePadding

        // Set width and height of the svg
        d3.select("#mapSvg")
            .attr("width", width)
            .attr("height", height)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <div id="mapDiv" className={styles.mapDiv}>
            <svg id="mapSvg">{
                map.map((tile) => <Tile key={tile.id} tile={tile} />
                )
            }</svg>
        </div>
    )
}