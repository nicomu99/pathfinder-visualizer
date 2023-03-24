import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectMap,
    selectMaxDistance,
    toggleTileFunction
} from './redux/mapSlice'
import * as d3 from 'd3'
import styles from './style/Path.module.css'

export function Path() {
    const map = useSelector(selectMap)
    const maxDistance = useSelector(selectMaxDistance)
    const dispatch = useDispatch()

    // Interpolation for color coding the distance to the starting position
    function calculateColor(distance) {
        let colorInterpolation = d3.interpolateHsl("#222222", "#999999")
        var colourScale = d3.scaleLinear()
                    .domain([0, maxDistance])
                    .range([0,1]);
        return colorInterpolation(colourScale(distance))
    }

    useEffect(() => {

        // Calculate the width of the canvas
        const tilesPerRow = 40
        const tileSize = 15 
        const tilePadding = 3
        const width = tilesPerRow * (tileSize + tilePadding) - tilePadding

        // Calculate the height of the canvas using the number of rows
        const tilesPerColumn = map.length / tilesPerRow
        const height = tilesPerColumn * (tileSize + tilePadding) - tilePadding

        // Draws the tiles onto the canvas
        function drawMap() {
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

            d3.selectAll("rect")
                .transition()
                .duration(100)
                .attr("fill", (d) => {
                    if (d.isWall) {
                        return "#000"
                    } else if (d.isStart) {
                        return "#00B825"
                    } else if (d.isEnd) {
                        return "#860018"
                    } else if(d.distance !== -1 && !d.isPath) {
                        return calculateColor(d.distance)
                    } else if(d.isFocused) {
                        return "#0000bb"
                    } 
                    return "#ddd"
                })
        }

        function redrawTiles() {
            d3.selectAll("rect")
                .transition()
                .duration(100)
                .attr("fill", (d) => {
                    if (d.isWall) {
                        return "#000"
                    } else if (d.isPath) {
                        return "#00E02D"
                    } else if (d.isStart) {
                        return "#00B825"
                    } else if (d.isEnd) {
                        return "#860018"
                    } else if(d.distance !== -1 && !d.isPath) {
                        return calculateColor(d.distance)
                    } else if(d.isFocused) {
                        return "#0000bb"
                    }
                    return "#ddd"
                })
        }

        drawMap()
        redrawTiles()
    });

    return (
        <div id="mapDiv" className={styles.mapDiv}>
            <svg id="mapSvg"></svg>
        </div>
    )
}