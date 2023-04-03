function reconstructPath(predecessor, current) {
    let totalPath = [current]
    while (predecessor[current] !== undefined) {
        current = predecessor[current]
        totalPath.unshift(current)
    }
    return totalPath
}

async function runBFS(map, startIndex, endIndex) {
    let openList = []
    openList.push(map[startIndex])

    let wasVisited = []
    let predecessor = {}

    while(openList.length > 0) {
        let currId = openList.shift().id

        if(currId === endIndex) {
            return {
                shortestPath: reconstructPath(predecessor, endIndex),
                wasVisited: wasVisited
            }
        }

        if(!wasVisited.includes(currId)) {
            wasVisited.push(currId)
            map[currId].neighbors.forEach(neighbor => {
                if(map[neighbor].mode !== 'wall' && !wasVisited.includes(neighbor)) {
                    openList.push(map[neighbor])
                    predecessor[neighbor] = currId
                }
            })
        }
    }

    return false
}

export { runBFS }