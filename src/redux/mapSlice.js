import { createSlice } from '@reduxjs/toolkit'

let tilesPerRow = 50
let tileCount = tilesPerRow * 25

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
        animationSpeed: 10
    },
    reducers: {
        // Toggles a tiles function, meaning if it is a path, wall, end or simply nothing
        toggleTileFunction: (state, action) => {
            let id = action.payload.id

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
                    state.startIndex = id
                } else if (state.choosingMode === 'end') {
                    state.endIndex = id
                }
            } else {
                // Toggle everything to off before changing the tile, so no collisions can happen
                if (id === state.startIndex) {
                    state.startIndex = ''
                } else if (id === state.endIndex) {
                    state.endIndex = ''
                }
            }

            if(state.choosingMode === 'wall' && action.payload.button === 'hold') {
                state.tiles[id].mode = state.choosingMode
            } else if (action.payload.button === 'clicked' && state.choosingMode !== 'wall') {
                state.tiles[id].mode = state.choosingMode
            }
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
        },
        setAnimationSpeed(state, action) {
            state.animationSpeed = action.payload
        }
    }
})

export const {
    toggleTileFunction,
    togglePath,
    changePickingMode,
    clearWholeMap,
    toggleWasVisited,
    setAnimationSpeed
} = mapSlice.actions

export const selectMap = (state) => state.map.tiles
export const selectPickingMode = (state) => state.map.choosingMode
export const selectStartIndex = (state) => state.map.startIndex
export const selectEndIndex = (state) => state.map.endIndex
export const selectTilesPerRow = (state) => state.map.tilesPerRow
export const selectTileCount = (state) => state.map.tileCount
export const selectAnimationSpeed = (state) => state.map.animationSpeed

export default mapSlice.reducer