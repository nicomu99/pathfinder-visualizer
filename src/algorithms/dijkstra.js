import {
    togglePath,
    updateDistance,
    toggleIsFocused,
    toggleIsOut,
    setMaxDistance,
    toggleWasVisited
} from '../redux/mapSlice'
import store from '../redux/store'

// Updates the distance values in the store
function updateDistanceValue(elementId, alternativeWay) {
    store.dispatch(updateDistance({ id: elementId, newDistance: alternativeWay }))
}

// Toggles the focus state of a tile in the store
function focusTile(elementId) {
    store.dispatch(toggleIsFocused(elementId))
}

// An implementation of the dijkstra pathfinding algorithm
async function dijsktraAlgorithm(map, startIndex, endIndex) {

    if (startIndex === '' || endIndex === '') {
        // Need to have an ending an a start for this to work
        return
    }

    // Initialize helper arrays
    let focusOrdering = []
    let distance = Array(100).fill(Infinity)
    let predecessor = Array(100).fill(null)
    distance[startIndex] = 0

    // We are not deleting tiles, so we need a different measure of when everything has been visited
    let count = 0

    while (count < map.length) {

        count++

        // Find vertex with smallest value in distance
        let smallestIndex = -1
        let smallestValue = Infinity
        map.forEach(element => {
            if (!element.wasVisited && !element.isWall) {
                let index = element.id
                if (distance[index] < smallestValue) {
                    smallestValue = distance[index]
                    smallestIndex = index
                }
            }
        })

        // Get the current element
        var currentTile = map[smallestIndex]
        focusOrdering.push(currentTile.id)

        // Mark the tile visited and update the map
        store.dispatch(toggleWasVisited(currentTile.id))
        map = store.getState().map.tiles

        // The following line disables a warning
        // eslint-disable-next-line
        currentTile.neighbors.forEach(element => {
            // Update the neighbors distances and predecessors
            let neighbor = map[element]
            let tileNotVisited = neighbor.wasVisited === false
            let tileIsNotWall = neighbor.isWall === false

            // Only update if the tile has not been visited before and it is not a wall
            if (tileNotVisited && tileIsNotWall) {
                let alternativeWay = distance[currentTile.id] + 1
                if (alternativeWay < distance[element]) {
                    distance[element] = alternativeWay
                    predecessor[element] = smallestIndex
                }
            }
        })

        // Check if we already found end tile
        if (currentTile.id === endIndex) {
            break
        }
    }

    return {
        predecessor: predecessor,
        distance: distance,
        focusOrdering
    }
}

// Generate the path calculated by the dijkstra algorithm
function generatePath(predecessors, endIndex) {
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
        await delay(50)
        store.dispatch(togglePath(shortestPath[i]))
    }
}


async function visualizeFocusOrdering(focusOrdering, distance) {

    distance = distance.map(d => {
        if (d === Infinity) {
            return -1
        }
        return d
    })

    let max = Math.max(...distance)
    store.dispatch(setMaxDistance(max))

    for (let i = 0; i < focusOrdering.length; i++) {
        focusTile(focusOrdering[i])
        await delay(20)
        focusTile(focusOrdering[i])
        updateDistanceValue(focusOrdering[i], distance[focusOrdering[i]])
    }
}

// Runs all required steps to generate the path and update the tiles color's
async function runAlgorithm() {

    let map = store.getState().map.tiles
    let startIndex = store.getState().map.startIndex
    let endIndex = store.getState().map.endIndex

    let dijkstra = await dijsktraAlgorithm(map, startIndex, endIndex)
    let shortestPath = generatePath(dijkstra.predecessor, endIndex)

    await visualizeFocusOrdering(dijkstra.focusOrdering, dijkstra.distance)

    updatePath(shortestPath)
}

export { runAlgorithm }