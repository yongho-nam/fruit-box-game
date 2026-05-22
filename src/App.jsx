import { useEffect, useMemo, useRef, useState } from 'react';
import { fruitImages } from './fruitImages.js';

const MAX_LEVEL = 20;

const FRUITS = [
  '사과',
  '오렌지',
  '레몬',
  '라임',
  '포도',
  '블루베리',
  '복숭아',
  '배',
  '자두',
  '체리',
  '수박',
  '딸기',
  '파인애플',
  '망고',
  '키위',
  '코코넛',
  '바나나',
  '토마토',
  '멜론',
  '석류',
].map((name, index) => ({
  name,
  image: fruitImages[index],
}));

const LEVELS = Array.from({ length: MAX_LEVEL }, (_, index) => {
  const level = index + 1;
  return {
    level,
    rows: Math.min(6 + Math.floor(index / 3), 10),
    cols: Math.min(9 + Math.floor(index / 2), 17),
    target: 12 + index * 3,
    targetSum: 10 + Math.floor(index / 3),
    timeLimit: Math.max(35, 95 - index * 3),
    scorePerFruit: 10 + index * 3,
    timeBonus: 2 + Math.floor(index / 4),
    fruit: FRUITS[index],
  };
});

function createBoard(config) {
  return Array.from({ length: config.rows * config.cols }, (_, index) => ({
    id: `${config.level}-${index}-${crypto.randomUUID()}`,
    row: Math.floor(index / config.cols),
    col: index % config.cols,
    value: Math.floor(Math.random() * 9) + 1,
  }));
}

function getIndex(row, col, cols) {
  return row * cols + col;
}

function applyGravity(board, selectedIds, config) {
  const nextBoard = Array.from({ length: config.rows * config.cols }, () => null);

  for (let col = 0; col < config.cols; col += 1) {
    const fallingFruits = [];

    for (let row = config.rows - 1; row >= 0; row -= 1) {
      const fruit = board[getIndex(row, col, config.cols)];

      if (fruit && !selectedIds.includes(fruit.id)) {
        fallingFruits.push(fruit);
      }
    }

    fallingFruits.forEach((fruit, offset) => {
      const row = config.rows - 1 - offset;
      nextBoard[getIndex(row, col, config.cols)] = {
        ...fruit,
        row,
        col,
      };
    });
  }

  return nextBoard;
}

function getSelectionRect(start, current) {
  return {
    left: Math.min(start.x, current.x),
    right: Math.max(start.x, current.x),
    top: Math.min(start.y, current.y),
    bottom: Math.max(start.y, current.y),
  };
}

function rectsIntersect(first, second) {
  return !(
    first.right < second.left ||
    first.left > second.right ||
    first.bottom < second.top ||
    first.top > second.bottom
  );
}

function getPoint(event) {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

export default function App() {
  const boardRef = useRef(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = LEVELS[levelIndex];
  const [board, setBoard] = useState(() => createBoard(LEVELS[0]));
  const [selectedIds, setSelectedIds] = useState([]);
  const [drag, setDrag] = useState(null);
  const [levelScore, setLevelScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].timeLimit);
  const [status, setStatus] = useState('ready');
  const [lastClearPoints, setLastClearPoints] = useState(0);
  const [lastLevelBonus, setLastLevelBonus] = useState(0);
  const [message, setMessage] = useState('단계 안내를 확인하고 시작하세요.');

  useEffect(() => {
    if (status !== 'playing') {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setStatus('failed');
          setDrag(null);
          setSelectedIds([]);
          setLastClearPoints(0);
          setLastLevelBonus(0);
          setMessage('시간이 끝났습니다. 다시 도전해 보세요.');
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, levelIndex]);

  const selectedSum = useMemo(
    () =>
      board
        .filter((fruit) => fruit && selectedIds.includes(fruit.id))
        .reduce((sum, fruit) => sum + fruit.value, 0),
    [board, selectedIds],
  );

  const remainingCount = useMemo(
    () => board.filter(Boolean).length,
    [board],
  );

  const progress = Math.min(100, Math.round((levelScore / currentLevel.target) * 100));

  const getSelectedAppleIds = (start, current) => {
    const board = boardRef.current;

    if (!board) {
      return [];
    }

    const selectionRect = getSelectionRect(start, current);
    return Array.from(board.querySelectorAll('.fruit-tile'))
      .filter((element) => {
        const fruitRect = element.getBoundingClientRect();
        return rectsIntersect(selectionRect, fruitRect);
      })
      .map((element) => element.dataset.fruitId);
  };

  const updateSelection = (start, current) => {
    const nextSelectedIds = getSelectedAppleIds(start, current);

    setSelectedIds(nextSelectedIds);
  };

  const handlePointerDown = (event) => {
    if (status !== 'playing') {
      return;
    }

    if (event.button !== 0 && event.pointerType === 'mouse') {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const point = getPoint(event);
    setDrag({ start: point, current: point });
    setSelectedIds([]);
    updateSelection(point, point);
  };

  const handlePointerMove = (event) => {
    if (!drag) {
      return;
    }

    const current = getPoint(event);
    setDrag((prevDrag) => ({ ...prevDrag, current }));
    updateSelection(drag.start, current);
  };

  const handlePointerUp = (event) => {
    if (!drag) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);

    const finalSelectedIds = getSelectedAppleIds(drag.start, getPoint(event));
    const finalSelectedSum = board
      .filter((fruit) => fruit && finalSelectedIds.includes(fruit.id))
      .reduce((sum, fruit) => sum + fruit.value, 0);

    if (finalSelectedIds.length > 0 && finalSelectedSum === currentLevel.targetSum) {
      const clearedCount = finalSelectedIds.length;
      const nextLevelScore = levelScore + clearedCount;
      const clearPoints = clearedCount * currentLevel.scorePerFruit;

      setBoard((currentBoard) => applyGravity(currentBoard, finalSelectedIds, currentLevel));
      setLevelScore(nextLevelScore);
      setLastClearPoints(clearPoints);

      if (nextLevelScore >= currentLevel.target) {
        const hasNextLevel = levelIndex < LEVELS.length - 1;
        const completionBonus = timeLeft * currentLevel.timeBonus;
        const earnedPoints = clearPoints + completionBonus;

        setTotalScore((currentScore) => currentScore + earnedPoints);
        setLastLevelBonus(completionBonus);
        setStatus(hasNextLevel ? 'level-complete' : 'won');
        setMessage(
          hasNextLevel
            ? `${currentLevel.level}단계 성공! 보너스 ${completionBonus}점을 획득했습니다.`
            : `모든 20단계를 완료했습니다! 보너스 ${completionBonus}점을 획득했습니다.`,
        );
      } else {
        setTotalScore((currentScore) => currentScore + clearPoints);
        setLastLevelBonus(0);
        setMessage(
          `성공! ${currentLevel.fruit.name} ${clearedCount}개를 지워 ${clearPoints}점을 얻었습니다.`,
        );
      }
    } else if (finalSelectedIds.length > 0) {
      setMessage(
        `현재 합은 ${finalSelectedSum}입니다. 합이 ${currentLevel.targetSum}인 과일을 찾아보세요.`,
      );
    }

    setDrag(null);
    setSelectedIds([]);
  };

  const handlePointerCancel = () => {
    setDrag(null);
    setSelectedIds([]);
  };

  const startLevel = (nextLevelIndex, keepTotalScore = true) => {
    const nextLevel = LEVELS[nextLevelIndex];

    setLevelIndex(nextLevelIndex);
    setBoard(createBoard(nextLevel));
    setSelectedIds([]);
    setDrag(null);
    setLevelScore(0);
    setTimeLeft(nextLevel.timeLimit);
    setStatus('ready');
    setLastClearPoints(0);
    setLastLevelBonus(0);
    setMessage(`${nextLevel.level}단계 안내를 확인하고 시작하세요.`);

    if (!keepTotalScore) {
      setTotalScore(0);
    }
  };

  const handleNextLevel = () => {
    startLevel(levelIndex + 1);
  };

  const handleStartLevel = () => {
    setStatus('playing');
    setMessage(
      `${currentLevel.level}단계: 합이 ${currentLevel.targetSum}이 되도록 ${currentLevel.fruit.name}를 선택하세요.`,
    );
  };

  const handleRestartLevel = () => {
    startLevel(levelIndex);
  };

  const handleRestartGame = () => {
    startLevel(0, false);
  };

  const boardRect = boardRef.current?.getBoundingClientRect();
  const selectionStyle =
    drag && boardRect
      ? {
          left: `${Math.min(drag.start.x, drag.current.x) - boardRect.left}px`,
          top: `${Math.min(drag.start.y, drag.current.y) - boardRect.top}px`,
          width: `${Math.abs(drag.current.x - drag.start.x)}px`,
          height: `${Math.abs(drag.current.y - drag.start.y)}px`,
        }
      : null;

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Level {currentLevel.level} / {MAX_LEVEL}</p>
        <h1>Fruit Box</h1>
        <p className="description">
          제한 시간 안에 합계 {currentLevel.targetSum}인 {currentLevel.fruit.name} 묶음을
          찾아보세요.
        </p>
      </section>

      <section className="status-panel" aria-live="polite">
        <div>
          <span>남은 시간</span>
          <strong>{timeLeft}s</strong>
        </div>
        <div>
          <span>선택 합계</span>
          <strong>{selectedSum}</strong>
        </div>
        <div>
          <span>목표 합계</span>
          <strong>{currentLevel.targetSum}</strong>
        </div>
        <div>
          <span>맞춘 과일</span>
          <strong>{levelScore}/{currentLevel.target}</strong>
        </div>
        <div>
          <span>총점</span>
          <strong>{totalScore}</strong>
        </div>
        <div>
          <span>과일 점수</span>
          <strong>{currentLevel.scorePerFruit}</strong>
        </div>
        <div>
          <span>남은 과일</span>
          <strong>{remainingCount}</strong>
        </div>
      </section>

      <div className="progress" aria-label={`단계 진행률 ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <p className="message">{message}</p>

      <section
        ref={boardRef}
        className={`board ${status !== 'playing' ? 'paused' : ''}`}
        style={{ '--rows': currentLevel.rows, '--cols': currentLevel.cols }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {board.map((fruit, index) =>
          fruit ? (
            <div
              key={fruit.id}
              className={`fruit-tile ${
                selectedIds.includes(fruit.id) ? 'selected' : ''
              }`}
              data-fruit-id={fruit.id}
              aria-label={`${fruit.value} ${currentLevel.fruit.name}`}
            >
              <img
                className="fruit-image"
                src={currentLevel.fruit.image}
                alt=""
                draggable="false"
              />
              <span>{fruit.value}</span>
            </div>
          ) : (
            <div key={`empty-${index}`} className="fruit-slot" aria-hidden="true" />
          ),
        )}
        {selectionStyle && <div className="selection-box" style={selectionStyle} />}
      </section>

      {status !== 'playing' && (
        <section className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="result-modal">
            <img src={currentLevel.fruit.image} alt="" />
            {status === 'ready' ? (
              <>
                <p className="modal-kicker">Level Guide</p>
                <h2>{currentLevel.level}단계</h2>
                <p>
                  목표 합계는 <strong>{currentLevel.targetSum}</strong>입니다.
                </p>
                <p>
                  제한 시간 {currentLevel.timeLimit}초 안에 {currentLevel.fruit.name}{' '}
                  {currentLevel.target}개를 맞추면 성공입니다.
                </p>
                <p>
                  과일 1개당 {currentLevel.scorePerFruit}점, 남은 시간 보너스는 초당{' '}
                  {currentLevel.timeBonus}점입니다.
                </p>
                <button type="button" onClick={handleStartLevel}>
                  시작하기
                </button>
              </>
            ) : status === 'failed' ? (
              <>
                <p className="modal-kicker">Time Over</p>
                <h2>도전 실패</h2>
                <p>
                  {currentLevel.level}단계 제한 시간이 끝났습니다. 목표 합계는{' '}
                  {currentLevel.targetSum}, 목표 과일은 {currentLevel.target}개입니다.
                </p>
                <p>
                  현재 기록은 {levelScore}개입니다. 다시 도전해 보세요.
                </p>
                <button type="button" onClick={handleRestartLevel}>
                  다시 도전
                </button>
              </>
            ) : (
              <>
                <p className="modal-kicker">Clear</p>
                <h2>
                  {status === 'won'
                    ? '모든 단계 완료!'
                    : `${currentLevel.level}단계 성공!`}
                </h2>
                <p>
                  이번 선택 점수 {lastClearPoints}점 + 시간 보너스 {lastLevelBonus}점
                </p>
                <p>현재 총점은 {totalScore}점입니다.</p>
                <button
                  type="button"
                  onClick={status === 'won' ? handleRestartGame : handleNextLevel}
                >
                  {status === 'won' ? '처음부터 다시' : '다음 단계'}
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
