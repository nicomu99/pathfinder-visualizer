import React from 'react';
import { useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import styles from './style/Visualizer.module.css';
import { Path } from './Path';
import {
	changePickingMode,
	clearWholeMap,
} from './redux/mapSlice'
import { runAlgorithm } from './algorithms/dijkstra';

export function Visualizer() {
	const dispatch = useDispatch()

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