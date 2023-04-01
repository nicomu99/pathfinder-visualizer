import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectTilesPerRow,
    toggleTileFunction
} from './redux/mapSlice'

// Returns the color of the tile based on its mode
const getTileColor = (tile) => {
    if (tile.mode === 'wall') {
        return "#191919"
    } else if (tile.isPath) {
        return "#C84B31"
    } else if (tile.mode === 'start') {
        return "#00B825"
    } else if (tile.mode === 'end') {
        return "#860018"
    } else if (tile.wasVisited) {
        return "#494949"
    }
    return "#FFFFFF"
}

function Tile({tile}) {
    const dispatch = useDispatch()
    const tilesPerRow = useSelector(selectTilesPerRow)
    const tileSize = 25
    const tilePadding = 1
    const xOffset = (tile.id % tilesPerRow) * (tileSize + tilePadding)
    const yOffset = Math.floor(tile.id / tilesPerRow) * (tileSize + tilePadding)
    
    return (
        <rect
            key={tile.id}
            x={xOffset}
            y={yOffset}
            width={tileSize}
            height={tileSize}
            className="tile"
            fill={getTileColor(tile)}
            style={{ transition: "fill 200ms linear" }}
            onMouseOver={(e) => {
                // if the left mouse button is pressed, toggle the tile
                if (e.buttons === 1) {
                    dispatch(toggleTileFunction({id: tile.id, button: 'hold'}))
                }
            }}
            onClick={() => dispatch(toggleTileFunction({id: tile.id, button: 'clicked'}))}
        />
    )
}

export default React.memo(Tile)