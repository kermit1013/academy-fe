import React, { useEffect, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

interface Props {
  isMain: boolean;
  text: string;
}

const Bubble = () => {
  const [state, setState] = useState({
    activeDrags: 0,
    deltaPosition: {
      x: 0,
      y: 0
    },
    controlledPosition: {
      x: 0,
      y: 0
    }
  });
  const onStart = () => {
    setState((prev) => ({
      ...prev,
      activeDrags: ++state.activeDrags
    }));
  };

  const onStop = () => {
    setState((prev) => ({
      ...prev,
      activeDrags: --state.activeDrags
    }));
  };

  const [isEdit, setIsEdit] = useState(false);
  const hintTextList = [
    "寫一項 你喜歡的 人事物",
    "寫一項 令你困擾的 人事物",
    "寫一項 你擅長的 事物",
    "寫一項 你不擅長的 事物",
    "過去一週 發生的趣事"
  ];
  const randomIndex = Math.floor(Math.random() * hintTextList.length);
  const [bubbleText, setBubbleText] = useState(hintTextList[randomIndex]);
  const [bubblePlaceholder, setBubblePlaceholder] = useState(hintTextList[randomIndex]);
  const handleEdit = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    event.stopPropagation();
    setBubbleText("");
    setIsEdit(true);
  };
  const handleEdited = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 20) {
      alert("over text!");
    } else {
      setBubbleText(event.target.value);
    }
  };

  const handleFinishedEdit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event!.code === "Enter") {
      setIsEdit(false);
    } else if (event!.code === "Esc") {
      setBubbleText("寫一項 你喜歡的 人事物");
      setIsEdit(false);
    }
  };
  const onControlledDrag = (e: DraggableEvent, position: DraggableData) => {
    // console.log(e);
    // console.log(position);
    const { x, y } = position;
    setState((prev) => ({
      ...prev,
      controlledPosition: { x, y }
    }));
  };

  const onControlledDragStop = (e: DraggableEvent, position: DraggableData) => {
    onControlledDrag(e, position);
    onStop();
  };
  const dragHandlers = { onStart: onStart, onStop: onStop };

  return (
    <div className="bg-blue-300">
      <Draggable bounds="parent" position={state.controlledPosition} {...dragHandlers} onDrag={onControlledDrag}>
        <div className=" flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-8 border-green-400  bg-red-300 object-fill text-center shadow-lg hover:cursor-move">
          {isEdit ? (
            <div>
              <textarea
                className="h-40 w-40 resize-none bg-transparent box-decoration-slice p-4 text-center text-lg font-bold"
                placeholder={bubblePlaceholder}
                value={bubbleText}
                onChange={handleEdited}
                onBlur={(event) => {
                  setIsEdit(false);
                }}
                onKeyDown={handleFinishedEdit}
              />
            </div>
          ) : (
            <p className=" box-decoration-slice text-center text-2xl font-bold" onDoubleClick={handleEdit}>
              {bubbleText}
            </p>
          )}
        </div>
      </Draggable>
    </div>
  );
};

export default Bubble;
