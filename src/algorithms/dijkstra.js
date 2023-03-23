import {
    togglePath,
    updateDistance,
    toggleIsFocused,
    toggleIsOut,
    setMaxDistance
} from '../redux/mapSlice'
import store from '../redux/store'

// Initializes the distance and predecessor array for the dijskstra algorithm
function initializeDistAndPred(map, startIndex) {
    let distance = []
    let predecessor = []

    map.forEach(() => {
        distance.push(Infinity)
        predecessor.push(null)
    });
    distance[startIndex] = 0

    return [distance, predecessor]
}

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

    let initialization = initializeDistAndPred(map, startIndex)
    let distance = initialization[0]
    let predecessor = initialization[1]
    let focusOrdering = []

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

        focusOrdering.push(thisObject[0].id)

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


        if(thisObject[0].id === endIndex) {
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

    for(let i = 0; i < 50; i++) {
        if(!shortestPath.includes(i)) {
            store.dispatch(toggleIsOut(i))
        }
    }

    for (let i = 0; i < shortestPath.length; i++) {
        await delay(500)
        store.dispatch(togglePath(shortestPath[i]))
    }
}


async function visualizeFocusOrdering(focusOrdering, distance) {

    distance = distance.map(d => {
        if(d === Infinity) {
            return -1
        }
        return d
    })

    let max = Math.max(...distance)
    store.dispatch(setMaxDistance(max))
    console.log(max)

    for(let i = 0; i < focusOrdering.length; i++) {
        focusTile(focusOrdering[i])
        await delay(200)
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