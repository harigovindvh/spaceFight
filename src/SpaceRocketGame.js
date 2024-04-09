import React, { useState, useEffect } from 'react';
import './SpaceRocketGame.css';

const App = () => {
  const [rocketPosition, setRocketPosition] = useState({ x: 0, y: 0 });
  const [bullets, setBullets] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setRocketPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      const newBullet = {
        id: Math.random().toString(36).substr(2, 9),
        x: rocketPosition.x,
        y: rocketPosition.y,
      };
      setBullets((prevBullets) => [...prevBullets, newBullet]);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [rocketPosition]);

  useEffect(() => {
    const moveBullets = () => {
      setBullets((prevBullets) =>
        prevBullets.map((bullet) => ({
          ...bullet,
          y: bullet.y - 5, // Adjust bullet speed as needed
        }))
      );

      // Remove bullets that have moved off the screen
      setBullets((prevBullets) =>
        prevBullets.filter((bullet) => bullet.y > 0)
      );
    };

    const bulletInterval = setInterval(moveBullets, 50); // Adjust interval as needed

    return () => {
      clearInterval(bulletInterval);
    };
  }, []);

  useEffect(() => {
      const obstacleInterval = setInterval(() => {
      const newObstacle = {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * window.innerWidth,
        y: -30,
      };
      setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
    }, 1000); // Adjust interval as needed

    const moveObstaclesInterval = setInterval(() => {
      setObstacles((prevObstacles) =>
        prevObstacles.map((obstacle) => ({
          ...obstacle,
          y: obstacle.y + 5, // Adjust obstacle speed as needed
        }))
      );

      setObstacles((prevObstacles) =>
        prevObstacles.filter((obstacle) => obstacle.y < window.innerHeight + 30)
      );

    }, 50); // Adjust interval as needed

    return () => {
      clearInterval(obstacleInterval);
      clearInterval(moveObstaclesInterval);
    };
  }, []);

  useEffect(() => {
    const checkCollision = () => {
        const rocketWidth = 60; // Adjust according to rocket width
        const rocketHeight = 180; // Adjust according to rocket height
      obstacles.forEach((obstacle) => {
        const obstacleRadius = 15;
        const rocketX = rocketPosition.x;
        const rocketY = rocketPosition.y;
        const obstacleX = obstacle.x;
        const obstacleY = obstacle.y;
        const distanceX = Math.abs(rocketX - obstacleX);
        const distanceY = Math.abs(rocketY - obstacleY);
        
        if (distanceX < (rocketWidth / 15 + obstacleRadius) && distanceY < (rocketHeight / 15 + obstacleRadius)) {
          setGameOver(true);
        }
      });
    };
  
    checkCollision();
  }, [rocketPosition, obstacles]);

  useEffect(() => {
    const checkCollision = () => {

      bullets.forEach((bullet) => {
        obstacles.forEach((obstacle) => {
          const bulletRadius = 3;
          const obstacleRadius = 15;

          const distanceX = bullet.x - obstacle.x - obstacleRadius + bulletRadius;
          const distanceY = bullet.y - obstacle.y - obstacleRadius + bulletRadius;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          if (distance < bulletRadius + obstacleRadius) {
            setObstacles((prevObstacles) =>
              prevObstacles.filter((o) => o.id !== obstacle.id)
            );
            setScore((prevScore) => prevScore + 1);
            console.log(score)
            setBullets((prevBullets) =>
              prevBullets.filter((b) => b.id !== bullet.id)
            );
          }
        });
      });
    };

    checkCollision();
  }, [bullets, obstacles]);

  const restartGame = () => {
    setGameOver(false);
    setBullets([]);
    setObstacles([]);
    setScore(0);
  };

  return (
    <div className="game-container">
      {gameOver && (
        <div className="game-over">
          Game Over!
          <button onClick={restartGame} className="restart-btn">Restart</button>
        </div>
      )}
      {!gameOver && (
        <>
          <div
            className="rocket"
            style={{ left: rocketPosition.x, top: rocketPosition.y }}
          ></div>
          {bullets.map((bullet) => (
            <div
              key={bullet.id}
              className="bullet"
              style={{ left: bullet.x, top: bullet.y }}
            ></div>
          ))}
          {obstacles.map((obstacle) => (
            <div
              key={obstacle.id}
              className="obstacle"
              style={{ left: obstacle.x, top: obstacle.y }}
            ></div>
          ))}
          <div className="score">Score: {score}</div>
        </>
      )}
    </div>
  );
};

export default App;
