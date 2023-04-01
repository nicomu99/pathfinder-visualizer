import { runDijkstra } from './dijkstra'
import { togglePath, toggleWasVisited } from '../redux/mapSlice'
import store from '../redux/store'

// Create a delay so the path is updated incrementally
const delay = ms => new Promise(res => setTimeout(res, ms))

// Updates the path tiles one by one
async function updatePath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
        await delay(50)
        store.dispatch(togglePath(shortestPath[i]))
    }
}

async function visualizeFocusOrdering(focusOrdering) {
    for (let i = 0; i < focusOrdering.length; i++) {
        await delay(10)
        store.dispatch(toggleWasVisited(focusOrdering[i]))
    }
}

async function runAlgorithm(algorithm) {

    let map = store.getState().map.tiles
    let startIndex = store.getState().map.startIndex
    let endIndex = store.getState().map.endIndex

    if (startIndex === '' || endIndex === '') {
        return
    }

    let algorithmPath = null

    switch (algorithm) {
        case 'dijkstra':
            algorithmPath = await runDijkstra(map, startIndex, endIndex)
            break
        default:
            break
    }

    if (algorithmPath === null) {
        return
    }

    await visualizeFocusOrdering(algorithmPath.wasVisited)
    updatePath(algorithmPath.shortestPath)
}

export { runAlgorithm }