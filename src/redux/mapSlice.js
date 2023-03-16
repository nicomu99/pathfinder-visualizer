import { createSlice } from '@reduxjs/toolkit'

let tileMap = []

for (let i = 0; i < 50; i++) {

    let neighbors = []
    if(i % 10 !== 0) {
        neighbors.push(i - 1)
    }

    if(i % 9 !== 0 || i === 0) {
        neighbors.push(i + 1)
    }

    if(i < 40) {
        neighbors.push(i + 10)
    }

    if(i > 9) {
        neighbors.push(i - 10)
    }

    tileMap.push({
        isWall: false,
        isPath: false,
        isStart: false,
        isEnd: false,
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
        endIndex: ''
    },
    reducers: {
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
        togglePath: (state, action) => {
            state.tiles[action.payload].isPath = !state.tiles[action.payload].isPath
        },
        changePickingMode: (state, action) => {
            state.choosingMode = action.payload
        }
    }
})

export const { toggleTileFunction, togglePath, changePickingMode } = mapSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectMap = (state) => state.map.tiles
export const selectStartIndex = (state) => state.map.startIndex
export const selectEndIndex = (state) => state.map.endIndex 

export default mapSlice.reducer