import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectTilesPerRow,
    toggleTileFunction
} from './redux/mapSlice'

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
        return "#3A3A3A"
    }
    return "#ddd"
}

function Tile({tile}) {
    const dispatch = useDispatch()
    const tilesPerRow = useSelector(selectTilesPerRow)
    const tileSize = 18
    const xOffset = (tile.id % tilesPerRow) * (tileSize + 2)
    const yOffset = Math.floor(tile.id / tilesPerRow) * (tileSize + 2)
    console.log("rerender")
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
            onClick={() => dispatch(toggleTileFunction(tile.id))}
        />
    )
}

export default React.memo(Tile)