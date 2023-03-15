import React from 'react';
import { useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './style/Visualizer.module.css';
import { Path } from './Path';
import {
	changePickingMode
} from './redux/mapSlice'

export function Visualizer() {
	const dispatch = useDispatch();

	function choosePickingMode(pickingMode) {
		dispatch(changePickingMode(pickingMode))
	}

	return (
		<div className={styles.container}>
			<Dropdown>
				<Dropdown.Toggle variant="Primary" id="dropdown-basic">
					Change Algorithm
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item href="#/action-3">Action</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			<DropdownButton id="dropdown-basic-button" title="Choose Picking Mode">
				<Dropdown.Item onClick={() => choosePickingMode('wall')}>Wall</Dropdown.Item>
				<Dropdown.Item onClick={() => choosePickingMode('start')}>Start</Dropdown.Item>
				<Dropdown.Item onClick={() => choosePickingMode('end')}>End</Dropdown.Item>
			</DropdownButton>
			<Path />
		</div>
	);
}