import {
    togglePath,
    toggleWasVisited
} from '../redux/mapSlice'
import store from '../redux/store'

// An implementation of the dijkstra pathfinding algorithm
async function dijsktraAlgorithm(map, startIndex, endIndex) {

    if (startIndex === '' || endIndex === '') {
        // Need to have an ending and a start for this to work
        return
    }

    // Initialize helper arrays
    let focusOrdering = []
    let wasVisited = []
    let predecessor = Array(map.length).fill(null)
    let distance = Array(map.length).fill(Infinity)
    distance[startIndex] = 0

    // We are not deleting tiles, so we need a different measure of when everything has been visited
    let count = 0

    while (count < map.length) {

        count++

        // Find vertex with smallest value in distance
        let smallestIndex = -1
        let smallestValue = Infinity
        map.forEach(element => {
            let index = element.id
            if (!wasVisited.includes(index) && !element.isWall) {
                if (distance[index] < smallestValue) {
                    smallestValue = distance[index]
                    smallestIndex = index
                }
            }
        })

        // Get the current element
        var currentTile = map[smallestIndex]
        if(currentTile === undefined) {
            // For debugging purposes
            console.log(map)
            break
        }

        // Mark the tile visited and update the map
        map = store.getState().map.tiles
        focusOrdering.push(currentTile.id)
        wasVisited.push(currentTile.id)

        // The following line disables a warning
        // eslint-disable-next-line
        currentTile.neighbors.forEach(element => {
            // Update the neighbors distances and predecessors
            let neighbor = map[element]
            // let tileNotVisited = neighbor.wasVisited === false
            let tileIsNotWall = neighbor.mode !== 'wall'

            // Only update if the tile has not been visited before and it is not a wall
            if (tileIsNotWall) {
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
        await delay(100)
        store.dispatch(togglePath(shortestPath[i]))
    }
}

async function visualizeFocusOrdering(focusOrdering) {
    for (let i = 0; i < focusOrdering.length; i++) {
        await delay(50)
        store.dispatch(toggleWasVisited(focusOrdering[i]))
    }
}

// Runs all required steps to generate the path and update the tiles color's
async function runAlgorithm() {

    let map = store.getState().map.tiles
    let startIndex = store.getState().map.startIndex
    let endIndex = store.getState().map.endIndex

    let dijkstra = await dijsktraAlgorithm(map, startIndex, endIndex)
    let shortestPath = generatePath(dijkstra.predecessor, endIndex)
    
    if(shortestPath.length === 1) {
        // No path found
        return
    }

    await visualizeFocusOrdering(dijkstra.focusOrdering, dijkstra.distance)

    updatePath(shortestPath)
}

export { runAlgorithm }