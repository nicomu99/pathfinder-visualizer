import { createSlice } from '@reduxjs/toolkit'

// Initializes the tileMap
let tileMap = []
for (let i = 0; i < 800; i++) {

    // Calculate neighbors
    let neighbors = []
    if (i % 40 !== 0) {
        neighbors.push(i - 1)
    }
    if (i % 10 !== 39) {
        neighbors.push(i + 1)
    }
    if (i < 760) {
        neighbors.push(i + 40)
    }
    if (i > 39) {
        neighbors.push(i - 40)
    }

    // Initialize the tile
    tileMap.push({
        isWall: false,
        isPath: false,
        isStart: false,
        isEnd: false,
        triggerRerender: true,
        isFocused: false,
        isOut: false,
        neighbors: neighbors,
        distance: -1,
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
        maxDistance: 0
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
            state.tiles[action.payload].isPath = true
        },
        // Changes the input a users selection of a tile causes
        changePickingMode: (state, action) => {
            state.choosingMode = action.payload
        },
        // Clears the whole map of all highlighting
        clearWholeMap: (state) => {
            state.tiles.forEach((ele) => {
                ele.isPath = false
                ele.isWall = false
                ele.isEnd = false
                ele.isStart = false
                ele.isFocused = false
                ele.distance = -1
                ele.isOut = false
            })

            state.startIndex = ''
            state.endIndex = ''
        },
        toggleRerenderOff: (state, action) => {
            state.tiles[action.payload].triggerRerender = false
        },
        toggleIsFocused: (state, action) => {
            state.tiles[action.payload].isFocused = !state.tiles[action.payload].isFocused
        },
        toggleIsOut: (state, action) => {
            state.tiles[action.payload].isOut = true
        },
        updateDistance: (state, action) => {
            state.tiles[action.payload.id].distance = action.payload.newDistance
        },
        setMaxDistance: (state, action) => {
            state.maxDistance = action.payload
        }
    }
})

export const { toggleTileFunction,
    togglePath,
    changePickingMode,
    clearWholeMap,
    toggleRerenderOff,
    updateDistance,
    toggleIsFocused,
    toggleIsOut,
    setMaxDistance
} = mapSlice.actions

export const selectMap = (state) => state.map.tiles
export const selectStartIndex = (state) => state.map.startIndex
export const selectEndIndex = (state) => state.map.endIndex
export const selectMaxDistance = (state) => state.map.maxDistance

export default mapSlice.reducer