import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectMap,
    toggleTileFunction,
    selectTilesPerRow
} from './redux/mapSlice'
import * as d3 from 'd3'
import styles from './style/Path.module.css'

// Returns the color of the tile based on its mode
const getTileColor = (tile) => {
    if (tile.mode === 'wall') {
        return "#E3B448"
    } else if (tile.isPath) {
        return "#3A6B35"
    } else if (tile.mode === 'start') {
        return "#00B825"
    } else if (tile.mode === 'end') {
        return "#860018"
    } else if (tile.wasVisited) {
        return "#000"
    }
    return "#ddd"
}

export function Path() {
    const map = useSelector(selectMap)
    const tilesPerRow = useSelector(selectTilesPerRow)
    const dispatch = useDispatch()
    const xOffset = useRef(0)
    const yOffset = useRef(0)
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
                map.map((tile, i) => {
                    if (i % tilesPerRow === 0) {
                        xOffset.current = 0
                    } else {
                        xOffset.current += tileSize + tilePadding
                    }
                    if (i % tilesPerRow === 0 && i !== 0) {
                        yOffset.current += tileSize + tilePadding
                    } else if (i === 0) {
                        yOffset.current = 0
                    }

                    return (
                        <rect
                            key={tile.id}
                            x={xOffset.current}
                            y={yOffset.current}
                            width={tileSize}
                            height={tileSize}
                            className="tile"
                            fill={getTileColor(tile)}
                            style={{transition: "fill 200ms linear"}}
                            onClick={() => dispatch(toggleTileFunction(tile.id))}
                        />
                    )
                }
                )
            }</svg>
        </div>
    )
}