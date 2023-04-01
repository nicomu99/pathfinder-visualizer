import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import styles from './style/Visualizer.module.css';
import { Path } from './Path';
import {
	changePickingMode,
	clearWholeMap,
	selectPickingMode,
	setAnimationSpeed
} from './redux/mapSlice'
import { runAlgorithm } from './algorithms/algorithmManager';

export function Visualizer() {
	const dispatch = useDispatch()
	const pickingMode = useSelector(selectPickingMode)
	const [algorithm, setAlgorithm] = useState('dijkstra')

	/*
	Dispatches the action to change the tile
	picking mode to the store
	*/
	function choosePickingMode(pickingMode) {
		dispatch(changePickingMode(pickingMode))
	}

	/*
	Dispatches the action to delete all 
	highlighting in the map to the store
	*/
	function clearMap() {
		dispatch(clearWholeMap())
	}

	/*
	Changes the algorithm to the one selected
	*/
	const chooseAlgorithm = (newAlgorithm) => {
		setAlgorithm(newAlgorithm)
	}

	/*
	Runs the algorithm selected
	*/
	const runVisualization = () => {
		runAlgorithm(algorithm)
	}

	/*
	Changes the animation speed of the algorithm
	*/
	const changeAnimationSpeed = (newSpeed) => {
		dispatch(setAnimationSpeed(newSpeed))
	}


	return (
		<div className={styles.container}>
			<div className={styles.menu}>
				<h1>Pathfinding Visualizer</h1>
				<DropdownButton id="dropdown-basic-button" title={"Picking Mode: " + pickingMode.toUpperCase()} menuVariant="dark" variant="dark">
					<Dropdown.Item onClick={() => choosePickingMode('wall')}>Wall</Dropdown.Item>
					<Dropdown.Item onClick={() => choosePickingMode('start')}>Start</Dropdown.Item>
					<Dropdown.Item onClick={() => choosePickingMode('end')}>End</Dropdown.Item>
				</DropdownButton>
				<DropdownButton id="dropdown-basic-button" title="Choose Algorithm" menuVariant="dark" variant="dark">
					<Dropdown.Item onClick={() => chooseAlgorithm('dijkstra')}>Dijkstra</Dropdown.Item>
				</DropdownButton>
				<Button variant="dark" onClick={() => runVisualization()}>Run Algorithm</Button>
				<Button variant="dark" onClick={() => clearMap()}>Clear Map</Button>
				<DropdownButton id="dropdown-basic-button" title="Animation Speed" menuVariant="dark" variant="dark">
					<Dropdown.Item onClick={() => changeAnimationSpeed(20)}>Slow</Dropdown.Item>
					<Dropdown.Item onClick={() => changeAnimationSpeed(10)}>Medium</Dropdown.Item>
					<Dropdown.Item onClick={() => changeAnimationSpeed(5)}>Fast</Dropdown.Item>
				</DropdownButton>
			</div>
			<Path />
		</div>
	);
}