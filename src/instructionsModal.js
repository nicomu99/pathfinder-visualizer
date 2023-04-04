import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function InstructionsModal({ show, handleClose }) {
    const [page, setPage] = useState(0)

    return (
        <Modal show={show} onHide={() => {
            handleClose()
            setPage(0)
        }} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Instructions ({page + 1}/4)</Modal.Title>
            </Modal.Header>
            {page === 0 && <Modal.Body>
                <p>This program is a pathfinding visualizer. In the field below, you can draw mazes or 
                    structures of your liking. The visualizer will then visualize the path the algorithm of
                    your choice took to find the path between the start and end node.</p>
            </Modal.Body>}
            {page === 1 && <Modal.Body>
                <p>Start by drawing your maze in the 2D map below. By default, the wall picker is selected.
                    To draw walls, simply click and drag your mouse over the grid. If you keep the left mousebutton cliked,
                    every square you hover over will be filled with a wall. To change the picker, click on the dropdown
                    menu in the top left corner of the screen. The other two options are the start and end node. The start
                    node is the node the algorithm will start at, and the end node is the node the algorithm will try to
                    find a path to. After finishing the maze, pick a start and end node.
                </p>
            </Modal.Body>}
            {page === 2 && <Modal.Body>
                <p>Next, you can pick an algorithm to visualize. The dropdown menu in the top left corner of the screen
                    next to the "Choose Picking Mode" button will allow you to pick an algorithm. The algorithms currently
                    supported are Dijkstra's Algorithm, A*, Depth First Search, and Breadth First Search. After picking an
                    algorithm, click the "Run Algorithm" button to visualize the algorithm. The algorithm will run at the
                    speed you have selected in the dropdown menu "Algorithm Speed" button. The default speed is medium.
                </p>
            </Modal.Body>}
            {page === 3 && <Modal.Body>
                <p>You can compare the algorithms by clearing the grid using the "Clear Path" button in the "Reset Map" dropdown
                    menu. Clearing the path only clears the path and visited nodes the algorithm took, but not the walls or 
                    start and end nodes. You can also clear the entire grid by clicking the "Clear Grid" button in the "Reset Map"
                    dropdown menu. This will clear the entire grid.
                </p>
            </Modal.Body>}
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { 
                    if(page > 0) {
                        setPage(page - 1) 
                    }                    
                }}
                >Back</Button>
                <Button vairant="primary" onClick={() => {
                    if(page < 3) {
                        setPage(page + 1)

                    }
                }}
                >Next</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default InstructionsModal