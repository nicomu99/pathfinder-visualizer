import React from 'react'
import { useSelector } from 'react-redux'
import {
    selectMap,
    selectTilesPerRow
} from './redux/mapSlice'
import styles from './style/Path.module.css'
import Tile from './Tile'

export function Path() {
    const map = useSelector(selectMap)
    const tilesPerRow = useSelector(selectTilesPerRow)
    const tileSize = 25
    const tilePadding = 1

    // Calculate width and height of the canvas using the number of rows
    const tilesPerColumn = map.length / tilesPerRow
    const height = tilesPerColumn * (tileSize + tilePadding) - tilePadding
    const width = tilesPerRow * (tileSize + tilePadding) - tilePadding

    return (
        <div id="mapDiv" className={styles.mapDiv}>
            <svg id="mapSvg" width={width} height={height}>
                {map.map((tile) => 
                    <Tile key={tile.id} tile={tile} />
                )}
            </svg>
        </div>
    )
}