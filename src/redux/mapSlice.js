import { createSlice } from '@reduxjs/toolkit'

let tilesPerRow = 40
let tileCount = tilesPerRow * 20

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
        mode: 'nothing',
        isPath: false,
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
            state.tiles = state.tiles.slice()

            if (!(state.choosingMode === 'wall')) {
                // If a start already exists and a new start is set, we have to change it first
                state.tiles = state.tiles.map((d) => {
                    if (d.mode === state.choosingMode) {
                        return {
                            ...d,
                            mode: 'nothing'
                        }
                    }
                    return d
                })

                if(state.choosingMode === 'start') {
                    state.startIndex = action.payload
                } else if (state.choosingMode === 'end') {
                    state.endIndex = action.payload
                }
            } else {
                // Toggle everything to off before changing the tile, so no collisions can happen
                if (action.payload === state.startIndex) {
                    state.startIndex = ''
                } else if (action.payload === state.endIndex) {
                    state.endIndex = ''
                }
            }

            state.tiles[action.payload].mode = state.choosingMode

            return state
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
                ele.mode = 'nothing'
                ele.wasVisited = false
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

export const {
    toggleTileFunction,
    togglePath,
    changePickingMode,
    clearWholeMap,
    toggleWasVisited
} = mapSlice.actions

export const selectMap = (state) => state.map.tiles
export const selectStartIndex = (state) => state.map.startIndex
export const selectEndIndex = (state) => state.map.endIndex
export const selectTilesPerRow = (state) => state.map.tilesPerRow
export const selectTileCount = (state) => state.map.tileCount

export default mapSlice.reducer