import { runDijkstra } from './dijkstra'
import { runAStar } from './aStar'
import { togglePath, toggleWasVisited, toggleAlgorithmRunning} from '../redux/mapSlice'
import store from '../redux/store'

// Create a delay so the path is updated incrementally
const delay = ms => new Promise(res => setTimeout(res, ms))

// Updates the path tiles one by one
async function updatePath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
        await delay(store.getState().map.animationSpeed)
        store.dispatch(togglePath(shortestPath[i]))
    }
}

async function visualizeFocusOrdering(focusOrdering) {
    for (let i = 0; i < focusOrdering.length; i++) {
        await delay(store.getState().map.animationSpeed)
        store.dispatch(toggleWasVisited(focusOrdering[i]))
    }
}

async function runAlgorithm(algorithm) {

    store.dispatch(toggleAlgorithmRunning(true))
    let map = store.getState().map.tiles
    let startIndex = store.getState().map.startIndex
    let endIndex = store.getState().map.endIndex

    if (startIndex === '' || endIndex === '') {
        return false    
    }

    let algorithmPath = null

    switch (algorithm) {
        case 'dijkstra':
            algorithmPath = await runDijkstra(map, startIndex, endIndex)
            break
        case 'aStar':
            algorithmPath = await runAStar(map, startIndex, endIndex)
            break
        default:
            break
    }

    if (algorithmPath === false) {
        store.dispatch(toggleAlgorithmRunning(false))
        return false
    }

    await visualizeFocusOrdering(algorithmPath.wasVisited)
    await updatePath(algorithmPath.shortestPath)
    store.dispatch(toggleAlgorithmRunning(false))

    return true
}

export { runAlgorithm }