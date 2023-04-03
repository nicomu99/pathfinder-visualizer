// An implementation of the dijkstra pathfinding algorithm
async function dijsktraAlgorithm(map, startIndex, endIndex) {
    // Initialize helper arrays
    let wasVisited = []
    let predecessor = Array(map.length).fill(null)
    let distance = Array(map.length).fill(Infinity)
    distance[startIndex] = 0

    while (true) {
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
        let currentTile = map[smallestIndex]
        if (currentTile === undefined) {
            // No path found
            break
        }
        wasVisited.push(currentTile.id)

        // Check if we already found end tile
        if (currentTile.id === endIndex) {
            break
        }

        // Update the neighbors distances and predecessors
        currentTile.neighbors.forEach(element => {
            if (map[element].mode !== 'wall') {
                // Only update if the tile is not a wall
                let alternativeWay = distance[currentTile.id] + 1
                if (alternativeWay < distance[element]) {
                    distance[element] = alternativeWay
                    predecessor[element] = smallestIndex
                }
            }
        })

    }

    return {
        predecessor: predecessor,
        wasVisited: wasVisited
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

// Runs all required steps to generate the path and update the tiles color's
async function runDijkstra(map, startIndex, endIndex) {
    let dijkstra = await dijsktraAlgorithm(map, startIndex, endIndex)
    let shortestPath = generatePath(dijkstra.predecessor, endIndex)

    if (shortestPath.length === 1) {
        // No path found
        return false
    }

    return {
        shortestPath: shortestPath,
        wasVisited: dijkstra.wasVisited,
    }
}

export { runDijkstra }