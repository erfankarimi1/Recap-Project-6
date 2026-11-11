import { useRef, useState } from "react";
import { useParams } from "react-router";

import { isArrowKey, moveBy, moveByKey, startPosition } from "../roomPosition";
import type { Position } from "../roomPosition";
import type { ArtPiece } from "../types";

type RoomViewProps = {
  pieces: ArtPiece[];
};

type Drag = { pointerX: number; pointerY: number; start: Position };

export default function RoomView({ pieces }: RoomViewProps) {
  const { slug } = useParams();
  const piece = pieces.find((item) => item.slug === slug);
  const [position, setPosition] = useState(startPosition);
  const roomRef = useRef<HTMLElement>(null);
  const dragRef = useRef<Drag | null>(null);

  if (!piece) return <p>Art piece not found</p>;

  // The size of the picture, in percent of the room
  function getPictureSize(picture: HTMLElement, room: HTMLElement): Position {
    const roomBox = room.getBoundingClientRect();
    const pictureBox = picture.getBoundingClientRect();
    return {
      x: (pictureBox.width / roomBox.width) * 100,
      y: (pictureBox.height / roomBox.height) * 100,
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      start: position,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const room = roomRef.current;
    if (!drag || !room) return;

    const { width, height } = room.getBoundingClientRect();
    setPosition(
      moveBy(
        drag.start,
        {
          x: ((event.clientX - drag.pointerX) / width) * 100,
          y: ((event.clientY - drag.pointerY) / height) * 100,
        },
        getPictureSize(event.currentTarget, room)
      )
    );
  }

  function handlePointerEnd() {
    dragRef.current = null;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const room = roomRef.current;
    if (!room || !isArrowKey(event.key)) return;

    // The arrow keys must not scroll the page
    event.preventDefault();
    setPosition(
      moveByKey(position, event.key, getPictureSize(event.currentTarget, room))
    );
  }

  return (
    <section className="room" aria-label="Room view" ref={roomRef}>
      <img
        className="room-photo"
        src="/room.jpg"
        alt="A living room with an empty wall"
      />
      <div
        className="room-picture"
        role="group"
        aria-label={`Move ${piece.name}`}
        tabIndex={0}
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
      >
        <img
          src={piece.imageSource}
          alt={piece.name}
          width={piece.dimensions.width}
          height={piece.dimensions.height}
        />
      </div>
    </section>
  );
}
