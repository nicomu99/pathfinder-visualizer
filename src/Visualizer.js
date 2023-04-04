import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import styles from './style/Visualizer.module.css';
import { Path } from './Path';
import {
	changePickingMode,
	clearWholeMap,
	clearPath,
	selectAnimationSpeed,
	selectPickingMode,
	setAnimationSpeed
} from './redux/mapSlice'
import { runAlgorithm } from './algorithms/algorithmManager';
import InstructionsModal from './instructionsModal';

import { IoAlertCircleOutline } from "react-icons/io5";
/*
Copyright notice for the icons used in this project:


The MIT License(MIT)
Copyright (c) 2015-present Ionic (http://ionic.io/)
	
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
	
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
	
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

export function Visualizer() {
	const dispatch = useDispatch()
	const pickingMode = useSelector(selectPickingMode)
	const animationSpeed = useSelector(selectAnimationSpeed)
	const [algorithm, setAlgorithm] = useState('dijkstra')
	const [animationSpeedText, setAnimationSpeedText] = useState('')
	const [algorithmText, setAlgorithmText] = useState('Dijkstra')
	const [algorithmFinished, setAlgorithmFinished] = useState(true)
	const [showInstructions, setShowInstructions] = useState(false)

	// Get a textual representation of the animation speed
	useEffect(() => {
		if (animationSpeed === 5) {
			setAnimationSpeedText('Fast')
		} else if (animationSpeed === 10) {
			setAnimationSpeedText('Medium')
		} else if (animationSpeed === 20) {
			setAnimationSpeedText('Slow')
		}
	}, [animationSpeed])

	// Get a textual representation of the algorithm
	useEffect(() => {
		if (algorithm === 'dijkstra') {
			setAlgorithmText('Dijkstra')
		} else if (algorithm === 'aStar') {
			setAlgorithmText('A*')
		} else if (algorithm === 'dfs') {
			setAlgorithmText('DFS')
		} else if (algorithm === 'bfs') {
			setAlgorithmText('BFS')
		}
	}, [algorithm])

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
		setAlgorithmFinished(true)
		dispatch(clearWholeMap())
	}

	function clearPathFocusing() {
		setAlgorithmFinished(true)
		dispatch(clearPath())
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
	const runVisualization = async () => {
		let algorithmDidFinish = await runAlgorithm(algorithm)
		setAlgorithmFinished(algorithmDidFinish)
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
				<div className={styles.info}>
					<IoAlertCircleOutline size="38" onClick={() => setShowInstructions(true)}/>
				</div>
				<DropdownButton id="dropdown-basic-button" title={"Choose Picking Mode"} menuVariant="dark" variant="dark">
					<Dropdown.Item onClick={() => choosePickingMode('wall')}>Wall</Dropdown.Item>
					<Dropdown.Item onClick={() => choosePickingMode('start')}>Start</Dropdown.Item>
					<Dropdown.Item onClick={() => choosePickingMode('end')}>End</Dropdown.Item>
				</DropdownButton>
				<DropdownButton id="dropdown-basic-button" title="Choose Algorithm" menuVariant="dark" variant="dark">
					<Dropdown.Item onClick={() => chooseAlgorithm('dijkstra')}>Dijkstra</Dropdown.Item>
					<Dropdown.Item onClick={() => chooseAlgorithm('aStar')}>A*</Dropdown.Item>
					<Dropdown.Item onClick={() => chooseAlgorithm('dfs')}>Depth First Search</Dropdown.Item>
					<Dropdown.Item onClick={() => chooseAlgorithm('bfs')}>Breadth First Search</Dropdown.Item>
				</DropdownButton>
				<Button variant="dark" onClick={() => runVisualization()}>Run Algorithm</Button>
				<DropdownButton id="dropdown-basic-button" title="Reset Map" menuVariant="dark" variant="dark">
					<Dropdown.Item onClick={() => clearMap()}>Clear Map</Dropdown.Item>
					<Dropdown.Item onClick={() => clearPathFocusing()}>Clear Path</Dropdown.Item>
				</DropdownButton>
				<DropdownButton id="dropdown-basic-button" title="Animation Speed" menuVariant="dark" variant="dark">
					<Dropdown.Item onClick={() => changeAnimationSpeed(20)}>Slow</Dropdown.Item>
					<Dropdown.Item onClick={() => changeAnimationSpeed(10)}>Medium</Dropdown.Item>
					<Dropdown.Item onClick={() => changeAnimationSpeed(5)}>Fast</Dropdown.Item>
				</DropdownButton>
			</div>
			<div className={styles.heading}>
				<div className={styles.flexRow}>
					<h5 className={styles.infoText}>Picking Mode: {pickingMode.charAt(0).toUpperCase() + pickingMode.slice(1)}</h5>
					<h5 className={styles.infoText}>Animation Speed: {animationSpeedText}</h5>
				</div>
				<div className={styles.flexRow}>
					<h5 className={styles.infoText}>Algorithm: {algorithmText}</h5>
					{!algorithmFinished && <h5 className={styles.infoText}>No Path Found</h5>}
				</div>
			</div>
			<Path />
			<InstructionsModal show={showInstructions} handleClose={() => setShowInstructions(false)} />
		</div>
	);
}