import store from '../redux/store'

function indexToCoordinates(index) {
    let tilesPerRow = store.getState().map.tilesPerRow

    return {
        x: index % tilesPerRow,
        y: Math.floor(index / tilesPerRow)
    }
}

function manhattanDistance(sourceIndex, destinationIndex) {
    let source = indexToCoordinates(sourceIndex)
    let destination = indexToCoordinates(destinationIndex)
    return Math.abs(source.x - destination.x) + Math.abs(source.y - destination.y)
} 

function runAStar(map, startIndex, endIndex) {
    let openSet = [startIndex]
    let wasVisited = []

    let predecessor = {}

    let gScore = Array(map.length).fill(Infinity)
    gScore[startIndex] = 0

    let fScore = Array(map.length).fill(Infinity)
    fScore[startIndex] = manhattanDistance(startIndex, endIndex)

    while (openSet.length > 0) {
        // Find vertex with smallest value in fScore
        let smallestIndex = -1
        let smallestValue = Infinity
        openSet.forEach(element => {
            if (fScore[element] < smallestValue) {
                smallestValue = fScore[element]
                smallestIndex = element
            }
        })

        // Get the current element
        let currentTile = map[smallestIndex]
        if (currentTile === undefined) {
            // No path found
            break
        }
        wasVisited.push(currentTile.id)

        // Check if we already found end tile
        if (currentTile.id === endIndex) {
            return {
                predecessor: predecessor,
                wasVisited: wasVisited
            }
        }

        // Remove current tile from openSet
        openSet.splice(openSet.indexOf(smallestIndex), 1)

        // Update the neighbors distances and predecessors
        currentTile.neighbors.forEach(element => {
            if (map[element].mode !== 'wall') {
                // Only update if the tile is not a wall
                let alternativeWay = gScore[currentTile.id] + 1
                if (alternativeWay < gScore[element]) {
                    predecessor[element] = smallestIndex
                    gScore[element] = alternativeWay
                    fScore[element] = gScore[element] + manhattanDistance(element, endIndex)
                    if (!openSet.includes(element)) {
                        openSet.push(element)
                    }
                }
            }
        })
    }

    return false
}

export { runAStar }