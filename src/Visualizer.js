import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './redux/counterSlice';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './style/Visualizer.module.css';

export function Visualizer() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

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
    </div>
  );
}