import React from 'react';
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
} from './redux/mapSlice'
import { runAlgorithm } from './algorithms/dijkstra';

export function Visualizer() {
	const dispatch = useDispatch()
	const pickingMode = useSelector(selectPickingMode)

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

	const chooseAlgorithm = (algorithm) => {
		runAlgorithm(algorithm)
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
				<Button variant="dark" onClick={() => runAlgorithm()}>Run Algorithm</Button>
				<Button variant="dark" onClick={() => clearMap()}>Clear Map</Button>
			</div>
			<Path />
		</div>
	);
}