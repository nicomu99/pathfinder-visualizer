import { createSlice } from '@reduxjs/toolkit'

let tilesPerRow = 15
let tileCount = tilesPerRow * 15

// Initializes the tileMap
let tileMap = []
for (let i = 0; i < tileCount; i++) {

    // Calculate neighbors
    let neighbors = []
    if (i % tilesPerRow !== 0) {
        neighbors.push(i - 1)
    }
    if ((i + 1) % tilesPerRow !== 0) {
        neighbors.push(i + 1)
    }
    if (i < (tileCount - tilesPerRow)) {
        neighbors.push(i + tilesPerRow)
    }
    if (i > (tilesPerRow - 1)) {
        neighbors.push(i - tilesPerRow)
    }

    // Initialize the tile
    tileMap.push({
        isWall: false,
        isPath: false,
        isStart: false,
        isEnd: false,
        wasVisited: false,
        neighbors: neighbors,
        id: i
    })
}

export const mapSlice = createSlice({
    name: 'map',
    initialState: {
        tiles: tileMap,
        choosingMode: 'wall',
        startIndex: '',
        endIndex: '',
        tilesPerRow: tilesPerRow,
        tileCount: tileCount,
    },
    reducers: {
        // Toggles a tiles function, meaning if it is a path, wall, end or simply nothing
        toggleTileFunction: (state, action) => {
            if (state.choosingMode === 'start') {
                const tempPropValue = !state.tiles[action.payload].isStart

                // If a start already exists and a new start is set, we have to change it first
                state.tiles = state.tiles.map((d) => {
                    if (d.isStart) {
                        return {
                            ...d,
                            isStart: false
                        }
                    }
                    return d
                })

                // Toggle everything to off before changing the tile, so no collisions can happen
                state.tiles[action.payload].isEnd = false
                state.tiles[action.payload].isWall = false

                // Finally, toggle the right property
                state.tiles[action.payload].isStart = tempPropValue
                state.startIndex = action.payload
            } else if (state.choosingMode === 'end') {
                const tempPropValue = !state.tiles[action.payload].isEnd

                // Same goes for end
                state.tiles = state.tiles.map((d, i) => {
                    if (d.isEnd) {
                        return {
                            ...d,
                            isEnd: false
                        }
                    }
                    return d
                })

                // Toggle everything to off before changing the tile, so no collisions can happen
                state.tiles[action.payload].isStart = false
                state.tiles[action.payload].isWall = false

                // Finally, toggle the right property
                state.tiles[action.payload].isEnd = tempPropValue
                state.endIndex = action.payload
            } else {
                // Toggle everything to off before changing the tile, so no collisions can happen
                state.tiles[action.payload].isStart = false
                state.tiles[action.payload].isEnd = false
                state.tiles[action.payload].isWall = !state.tiles[action.payload].isWall
            }
        },
        // Toggles a tiles function to if it is a path or not
        togglePath: (state, action) => {
            state.tiles = state.tiles.slice()
            state.tiles[action.payload].isPath = true

            return state
        },
        // Changes the input a users selection of a tile causes
        changePickingMode: (state, action) => {
            return {
                ...state,
                choosingMode: action.payload
            }
        },
        // Clears the whole map of all highlighting
        clearWholeMap: (state) => {

            state.tiles = state.tiles.slice()
            state.tiles.forEach((ele) => {
                ele.isPath = false
                ele.isWall = false
                ele.isEnd = false
                ele.isStart = false
                ele.isFocused = false
                ele.wasVisited = false
                ele.distance = -1
            })

            state.startIndex = ''
            state.endIndex = ''

            return state
        },
        toggleWasVisited: (state, action) => {
            state.tiles = state.tiles.slice()
            state.tiles[action.payload].wasVisited = !state.tiles[action.payload].wasVisited

            return state
        }
    }
})

export const { toggleTileFunction,
    togglePath,
    changePickingMode,
    clearWholeMap,
    toggleRerenderOff,
    updateDistance,
    toggleWasVisited
} = mapSlice.actions

export const selectMap = (state) => state.map.tiles
export const selectStartIndex = (state) => state.map.startIndex
export const selectEndIndex = (state) => state.map.endIndex
export const selectTilesPerRow = (state) => state.map.tilesPerRow
export const selectTileCount = (state) => state.map.tileCount

export default mapSlice.reducer