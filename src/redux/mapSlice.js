import { createSlice } from '@reduxjs/toolkit'

let tiles = [
    {
        isWall: false,
        isPath: false
    },
    {
        isWall: false,
        isPath: false
    },
    {
        isWall: false,
        isPath: false
    },
    {
        isWall: false,
        isPath: false
    }
]


export const mapSlice = createSlice({
    name: 'map',
    initialState: {
        map: tiles,
    },
    reducers: {
        toggleWall: (state, index) => {
            state.map[index].isWall = !state.map[index].isWall
        },
        togglePath: (state, index) => {
            state.map[index].isPath = !state.map[index].isPath
        }
    }
})

export const { toggleWall, togglePath } = mapSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectMap = (state) => state.counter.map

export default mapSlice.reducer