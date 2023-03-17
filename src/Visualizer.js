import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import styles from './style/Visualizer.module.css';
import { Path } from './Path';
import {
	changePickingMode,
	selectStartIndex,
	selectEndIndex,
	selectMap,
	togglePath,
	clearWholeMap
} from './redux/mapSlice'

export function Visualizer() {
	const dispatch = useDispatch()
	const startIndex = useSelector(selectStartIndex)
	const endIndex = useSelector(selectEndIndex)
	let map = useSelector(selectMap).slice()

	function choosePickingMode(pickingMode) {
		dispatch(changePickingMode(pickingMode))
	}

	function initializeDistAndPred() {
		let distance = []
		let predecessor = []

		map.forEach((elem, index) => {
			distance.push(Infinity)
			predecessor.push(null)
		});

		distance[startIndex] = 0

		return [distance, predecessor]
	}

	function dijsktraAlgorithm() {
		if (startIndex === '' || endIndex === '') {
			// Need to have an ending an a start for this to work
			return
		}

		let initialization = initializeDistAndPred()

		let distance = initialization[0]
		let predecessor = initialization[1]

		let count = 0

		map = map.filter(element => {
			return !element.isWall
		});

		while (map.length !== 0 && count < 50) {
			count++

			// Find vertex with smalles value in distance
			let smallestIndex = -1
			let smallestValue = Infinity
			map.forEach(element => {
				let index = element.id
				if (distance[index] < smallestValue) {
					smallestValue = distance[index]
					smallestIndex = index
				}
				// console.log(index + " " + element.id + " " + distance[index])
			});

			var thisObject = map.filter(element => {
				return element.id === smallestIndex
			})

			map = map.filter(element => {
				return element.id !== smallestIndex
			});

			// eslint-disable-next-line
			thisObject[0].neighbors.forEach(element => {

				let elementExists = map.some(ele => {
					return ele.id === element
				})

				if (elementExists) {

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

		}

		return predecessor
	}

	function generatePath(predecessors) {
		let path = [endIndex]
		let prevIndex = endIndex

		while (predecessors[prevIndex] != null) {
			prevIndex = predecessors[prevIndex]
			path.unshift(prevIndex)
		}

		return path
	}

	const delay = ms => new Promise(res => setTimeout(res, ms))

	const updatePath = async (shortestPath) => {

		for (let i = 0; i < shortestPath.length; i++) {
			await delay(1000)
			dispatch(togglePath(shortestPath[i]))
		}
	}

	function runAlgorithm() {
		let predecessors = dijsktraAlgorithm()

		let shortestPath = generatePath(predecessors)

		updatePath(shortestPath)

		console.log(shortestPath)
	}

	function clearMap() {
		dispatch(clearWholeMap())
	}

	return (
		<div className={styles.container}>
			<div className={styles.menu}>
				<Dropdown>
					<Dropdown.Toggle variant="primary" id="dropdown-basic">
						Change Algorithm
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item>Action</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<DropdownButton id="dropdown-basic-button" title="Choose Picking Mode">
					<Dropdown.Item onClick={() => choosePickingMode('wall')}>Wall</Dropdown.Item>
					<Dropdown.Item onClick={() => choosePickingMode('start')}>Start</Dropdown.Item>
					<Dropdown.Item onClick={() => choosePickingMode('end')}>End</Dropdown.Item>
				</DropdownButton>
				<Button variant="primary" onClick={() => runAlgorithm()}>Run Algorithm</Button>
				<Button variant="primary" onClick={() => clearMap()}>Clear Map</Button>
			</div>
			<Path />
		</div>
	);
}