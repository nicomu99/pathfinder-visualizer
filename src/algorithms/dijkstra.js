import { useDispatch, useSelector } from 'react-redux';
import {
    togglePath,
    updateDistance,
    toggleIsFocused,
    selectMap,
    selectStartIndex,
    selectEndIndex
} from '../redux/mapSlice'
import store from '../redux/store'

const thunkMiddleware = ({ dispatch, getState }) =>
    next =>
        action => {
            if (typeof action === 'function') {
                return action(dispatch, getState)
            }

            return next(action)
        }


let map = []
let startIndex = -1
let endIndex = -1

// Initializes the distance and predecessor array for the dijskstra algorithm
function initializeDistAndPred() {
    let distance = []
    let predecessor = []

    map = store.getState().map.tiles
    startIndex = store.getState().map.startIndex
    endIndex = store.getState().map.endIndex

    map.forEach(() => {
        distance.push(Infinity)
        predecessor.push(null)
    });
    distance[startIndex] = 0

    return [distance, predecessor]
}

// Updates the distance values in the store
async function updateDistanceValue(elementId, alternativeWay) {
    await delay(500)
    store.dispatch(updateDistance({ id: elementId, newDistance: alternativeWay }))
}

// Toggles the focus state of a tile in the store
async function focusTile(elementId) {
    store.dispatch(toggleIsFocused(elementId))
}

// An implementation of the dijkstra pathfinding algorithm
async function dijsktraAlgorithm() {
    if (startIndex === '' || endIndex === '') {
        // Need to have an ending an a start for this to work
        return
    }

    let initialization = initializeDistAndPred()
    let distance = initialization[0]
    let predecessor = initialization[1]

    // Delete all elements that are a wall from our map - they should not be passed by the path
    map = map.filter(element => {
        return !element.isWall
    })

    while (map.length !== 0) {

        // Find vertex with smalles value in distance
        let smallestIndex = -1
        let smallestValue = Infinity
        map.forEach(element => {
            let index = element.id
            if (distance[index] < smallestValue) {
                smallestValue = distance[index]
                smallestIndex = index
            }
        })

        // Get the element with the smallest path distance
        var thisObject = map.filter(element => {
            return element.id === smallestIndex
        })

        focusTile(thisObject[0].id)
        await delay(100)

        // Delete the element with the smallest path distance from our map - it should not be passed again
        map = map.filter(element => {
            return element.id !== smallestIndex
        });

        // The following line disables a warning
        // eslint-disable-next-line
        thisObject[0].neighbors.forEach(element => {
            // Update the neighbors distances and predecessors

            // Only update if the tile has not been visited before
            let tileExists = map.some(ele => {
                return ele.id === element
            })

            if (tileExists) {

                //Find the neighbor and for each neighbor update the distance
                var neighbor = map.filter(ele => {
                    return ele.id === element
                })
                if (!neighbor[0].isWall) {
                    let alternativeWay = distance[thisObject[0].id] + 1
                    if (alternativeWay < distance[element]) {
                        distance[element] = alternativeWay
                        predecessor[element] = smallestIndex
                    }
                }
            }
        })

        // Update the focus and distance value
        focusTile(thisObject[0].id)
        updateDistanceValue(thisObject[0].id, distance[thisObject[0].id])
    }

    return predecessor
}

// Generate the path calculated by the dijkstra algorithm
function generatePath(predecessors) {
    let path = [endIndex]
    let prevIndex = endIndex

    while (predecessors[prevIndex] != null) {
        prevIndex = predecessors[prevIndex]
        path.unshift(prevIndex)
    }

    return path
}

// Create a delay so the path is updated incrementally
const delay = ms => new Promise(res => setTimeout(res, ms))

// Updates the path tiles one by one
async function updatePath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
        await delay(500)
        store.dispatch(togglePath(shortestPath[i]))
    }
}

// Runs all required steps to generate the path and update the tiles color's
async function runAlgorithm() {
    let predecessors = await dijsktraAlgorithm()
    let shortestPath = generatePath(predecessors)
    updatePath(shortestPath)
}

export { runAlgorithm }