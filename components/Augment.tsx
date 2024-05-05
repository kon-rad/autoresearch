"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import styles from "./augment.module.css";
import { AwesomeButton, AwesomeButtonProgress } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

const getAugmentResult = async (inputText : string) => {
  const response = await fetch("/api/augment_apiXXX", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputText }),
  })
}

const Augment = () => {
    const [inputText, setInputText] = useState(
        "The newest AI trend of 2024 is multi-modal applications."
    )

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black">
      <div className={styles.title}>Augment</div>
      <div><textarea className="bg-gray-800 text-gray-100 rounded-lg p-2 w-full max-w-md" rows={10} value={inputText} onChange={(e) => setInputText(e.target.value)} /></div>
      <div>
      <AwesomeButton
          style={{ AwesomeButtonStyles }}
          type="disabled"
          onPress={getAugmentResult(inputText)}
        >
          Augment
        </AwesomeButton>
      </div>
    </div>
  );
};

export default Augment;
