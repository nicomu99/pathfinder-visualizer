import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectMap,
    selectMaxDistance,
    toggleTileFunction,
    selectTilesPerRow
} from './redux/mapSlice'
import * as d3 from 'd3'
import styles from './style/Path.module.css'

export function Path() {
    const map = useSelector(selectMap)
    const maxDistance = useSelector(selectMaxDistance)
    const tilesPerRow = useSelector(selectTilesPerRow)
    const dispatch = useDispatch()

    useEffect(() => {

        // Calculate the width of the canvas
        const tileSize = 30
        const tilePadding = 3
        const width = tilesPerRow * (tileSize + tilePadding) - tilePadding

        // Calculate the height of the canvas using the number of rows
        const tilesPerColumn = map.length / tilesPerRow
        const height = tilesPerColumn * (tileSize + tilePadding) - tilePadding

        // Draws the tiles onto the canvas
        let mapSvg = d3.select("#mapSvg")
            .attr("width", width)
            .attr("height", height)

        let yOffset = 0
        let xOffset = 0

        mapSvg.selectAll(".tile")
            .data(map)
            .join("rect")
            .attr("x", function (d, i) {
                if (i % tilesPerRow === 0) {
                    xOffset = 0
                } else {
                    xOffset += tileSize + tilePadding
                }
                return xOffset
            })
            .attr("y", function (d, i) {
                if (i % tilesPerRow === 0 && i !== 0) {
                    yOffset += tileSize + tilePadding
                }

                return yOffset
            })
            .attr("width", tileSize)
            .attr("height", tileSize)
            .attr("class", "tile")
            .on("click", function (e, d) {
                dispatch(toggleTileFunction(d.id))
            })
    }, [])

    // Rerenders the component when the map changes
    useEffect(() => {
        // Recolor the tiles
        d3.selectAll("rect")
            .data(map)
            .transition()
            .duration(100)
            .attr("fill", (d) => {
                if (d.isWall) {
                    return "#E3B448"
                } else if (d.isPath) {
                    return "#3A6B35"
                } else if (d.isStart) {
                    return "#00B825"
                } else if (d.isEnd) {
                    return "#860018"
                } else if (d.isFocused) {
                    return "#555"
                } else if (d.wasVisited && maxDistance !== 0) {
                    return "#000"
                }
                return "#ddd"
            })
    }, [map])

    return (
        <div id="mapDiv" className={styles.mapDiv}>
            <svg id="mapSvg"></svg>
        </div>
    )
}