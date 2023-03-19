import React, { useState } from 'react';
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
	clearWholeMap,
	updateDistance,
	toggleIsFocused
} from './redux/mapSlice'

export function Visualizer() {
	const dispatch = useDispatch()
	const startIndex = useSelector(selectStartIndex)
	const endIndex = useSelector(selectEndIndex)
	const [updateOrder, setUpdateOrder] = useState([])
	let map = useSelector(selectMap).slice()

	function choosePickingMode(pickingMode) {
		dispatch(changePickingMode(pickingMode))
	}

	// Initializes the distance and predecessor array for the dijskstra algorithm
	function initializeDistAndPred() {
		let distance = []
		let predecessor = []

		map.forEach(() => {
			distance.push(Infinity)
			predecessor.push(null)
		});
		distance[startIndex] = 0

		return [distance, predecessor]
	}

	async function updateDistanceValue(elementId, alternativeWay) {
		await delay(500)
		dispatch(updateDistance({id: elementId, newDistance: alternativeWay}))
	}

	async function focusTile(elementId) {
		dispatch(toggleIsFocused(elementId))
	}

	// An implementation of the dijkstra pathfinding algorithm
	async function dijsktraAlgorithm() {
		if (startIndex === '' || endIndex === '') {
			// Need to have an ending an a start for this to work
			return
		}

		let initialization = initializeDistAndPred()
		let distance = initialization[0]
		let predecessor = initialization[1]

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

			focusTile(thisObject[0].id)
			await delay(100)

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
							updateOrder.push({id: element, newDistance: alternativeWay})
						}
					}
				}
			})

			focusTile(thisObject[0].id)
			updateDistanceValue(thisObject[0].id, distance[thisObject[0].id])
		}

		return predecessor
	}

	// Generate the path calculated by the dijkstra algorithm
	function generatePath(predecessors) {
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

		console.log(shortestPath)

		for (let i = 0; i < shortestPath.length; i++) {
			await delay(500)
			dispatch(togglePath(shortestPath[i]))
		}
	}

	// Runs all required steps to generate the path and update the tiles color's
	async function runAlgorithm() {
		let predecessors = await dijsktraAlgorithm()
		console.log("hey")
		let shortestPath = generatePath(predecessors)
		updatePath(shortestPath)
	}

	// Clears the map of all highlighting
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