import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectMap,
    selectStartIndex,
    selectEndIndex,
    toggleTileFunction
} from './redux/mapSlice'
import * as d3 from 'd3'
import styles from './style/Path.module.css';

export function Path() {  
    const map = useSelector(selectMap);
    const dispatch = useDispatch();

    useEffect(() => {
        function drawMap() {
            let mapSvg = d3.select("#mapSvg")
                        .attr("width", 545)
                        .attr("height", 270)
    
            let yOffset = 0
            let xOffset = 0
            mapSvg.selectAll(".tile")
                    .data(map)
                    .join("rect")
                        .attr("x", function(d, i) {
                            if(i % 10 === 0) {
                                xOffset = 0
                            } else {
                                xOffset += 55
                            }
                            return xOffset
                        })
                        .attr("y", function(d, i) {
                            if(i % 10 === 0 && i !== 0) {
                                yOffset += 55
                            }

                            return yOffset
                        })
                        .attr("width", 50)
                        .attr("height", 50)
                        .attr("fill", (d) => {
                            if(d.isWall) {
                                return "#000"
                            } else if(d.isPath) {
                                return "#00E02D"
                            } else if(d.isStart) {
                                return "#00B825"
                            } else if(d.isEnd) {
                                return "#860018"
                            }

                            return "#ddd"
                        })
                        .attr("class", "tile")
                        .on("click", function(e, d) {
                            dispatch(toggleTileFunction(d.id))
                        })
        };
        drawMap();
    });

    
     

    return (
        <div id="mapDiv" className={styles.mapDiv}>
            <svg id="mapSvg"></svg>
        </div>
    )
}