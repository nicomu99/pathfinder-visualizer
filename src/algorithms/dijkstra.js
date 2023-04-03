// An implementation of the dijkstra pathfinding algorithm
async function runDijkstra(map, startIndex, endIndex) {
    // Initialize helper arrays
    let wasVisited = []
    let predecessor = {}
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
        if (map[smallestIndex] === undefined) {
            // No path found
            return false
        }
        wasVisited.push(smallestIndex)

        // Check if we already found end tile
        if (smallestIndex === endIndex) {
            return {
                predecessor: predecessor,
                wasVisited: wasVisited
            }
        }

        // Update the neighbors distances and predecessors
        map[smallestIndex].neighbors.forEach(element => {
            if (map[element].mode !== 'wall') {
                // Only update if the tile is not a wall
                let alternativeWay = distance[smallestIndex] + 1
                if (alternativeWay < distance[element]) {
                    distance[element] = alternativeWay
                    predecessor[element] = smallestIndex
                }
            }
        })

    }
}

export { runDijkstra }