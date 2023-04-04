
# Pathfinding Visualizer

This project is a visual guide of a few pathfinding algorithms. The project was created using React.js, Redux and plain JavaScript. 

## Learning Goals

- Strengthen knowledge of D3, React
- Get an insight into Redux
- Reiterate pathfinding algorithms

## Challenges

I initially wanted to use D3 to visualize the algorithms. However, D3 rerendered the whole map each time a tile was changed.
This quickly became a huge performance overhead. With 1250 Tiles, the tiles were updated more than 500.000 times if the start and end node where far apart from each other. I therefore changed my plans and left D3 out of the project. The problem still persisted, until I started using React.memo().

Another challenge I had to face was the Redux store, since I had no knowledge of how to use it. I have read multiple times before, that Redux is a library each React developer should know how to use, so this project provided a good opportunity to get to know it. The documentation provided a straightforward guide into how to use it. It turned out very easy to use.

## The Project

As stated above, this project visualizes a few pathfinding algorithms on 2D-Tilemap. The map consists of 25 rows with 50 tiles each, so a total of 1250 tiles. This number can be changed in the mapSlice.js file. No matter what combination of integers is inserted, the visualizer should still work.

The user can draw start nodes, end nodes and wall nodes onto the map to their liking. These nodes provide the challenge the algorithms have to face. The user can also choose between 4 different algorithms. The algorithms are:

- Dijkstra's Algorithm
- A* Search
- Depth-First Search
- Breadth-First Search

By running the algorithms, the user can see how each algorithm solves the challenge. Through the choice "Clear Path" in the dropdown menu, the user can only clear the path the algorithm has found and then compare it to a different algorithm. 

## Take Aways

This project was a great opportunity to get to know Redux. I also had the chance to reiterate my knowledge of pathfinding algorithms and React. Furthermore, I learned how to improve performance on a React project by using React.memo().



