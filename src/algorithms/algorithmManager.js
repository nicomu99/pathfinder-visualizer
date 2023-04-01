import { runDijkstra } from './dijkstra'
import store from '../redux/store'

function runAlgorithm(algorithm) {

    let map = store.getState().map.tiles
    let startIndex = store.getState().map.startIndex
    let endIndex = store.getState().map.endIndex

    if (startIndex === '' || endIndex === '') {
        return
    }

    switch(algorithm) {
        case 'dijkstra':
            runDijkstra(map, startIndex, endIndex)
            break
        default:
            break
    }

}

export { runAlgorithm }