"use client";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [firstPlayer, setFirstPlayer] = useState<string>("");
  const [secondPlayer, setSecondPlayer] = useState<string>("");
  const [firstResult, setFirstResult] = useState<
    { text: string; result: number }[]
  >([]);
  const [secondResult, setSecondResult] = useState<
    { text: string; result: number }[]
  >([]);
  const [firstPlayerDisable, setFirstPlayerDisable] = useState<boolean>(false);
  const [secondPlayerDisable, setSecondPlayerDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const textLengthCheck = (testText: string) => {
    return testText?.length >= 4 ? true : false;
  };

  const dictionarySearch = async (searchText: string) => {
    try {
      const res = await axios.get(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + searchText
      );
      const resData = res.data;

      return {
        text: searchText,
        result: searchText.length > 4 ? 5 + (searchText.length - 5) : 5,
      };
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.title);
      return { text: searchText, result: -1 };
    }
  };
  const handleFirstKey = async (e: any) => {
    if (e.key === "Enter") {
      if (textLengthCheck(firstPlayer)) {
        setFirstPlayerDisable(true);
        setSecondPlayerDisable(false);
        const responseData = await dictionarySearch(firstPlayer);
        console.log(responseData);
        setFirstResult([...firstResult, responseData]);

        setFirstPlayer("");
      } else {
        setErrorMessage("Word is less than 4");
      }
    }
  };
  const handleSecondKey = async (e: any) => {
    if (e.key === "Enter") {
      if (textLengthCheck(secondPlayer)) {
        setSecondPlayerDisable(true);
        setFirstPlayerDisable(false);
        const responseData = await dictionarySearch(secondPlayer);
        setSecondResult([...secondResult, responseData]);
        setSecondPlayer("");
      } else {
        setErrorMessage("Word is less than 4");
      }
    }
  };

  const handleFirstFocus = async (e: any) => {
    if (textLengthCheck(firstPlayer)) {
      setFirstPlayerDisable(true);
      setSecondPlayerDisable(false);
      const responseData = await dictionarySearch(firstPlayer);
      setFirstResult([...firstResult, responseData]);
      setFirstPlayer("");
    } else {
      setErrorMessage("Word is less than 4");
    }
  };
  const handleSecondFocus = async (e: any) => {
    if (textLengthCheck(secondPlayer)) {
      setSecondPlayerDisable(true);
      setFirstPlayerDisable(false);
      const responseData = await dictionarySearch(secondPlayer);

      setSecondResult([...secondResult, responseData]);
      setSecondPlayer("");
    } else {
      setErrorMessage("Word is less than 4");
    }
  };
  return (
    <div className=" bg-gray-800 w-full min-h-screen  ">
      <div className=" w-full h-full flex items-center justify-center gap-6 pt-16">
        <div className=" flex  flex-col gap-2 w-[400px]">
          <p className=" text-[20px] font-semibold text-white">Player 1</p>
          <input
            type="text"
            value={firstPlayer}
            disabled={firstPlayerDisable}
            onChange={(e: any) => {
              setFirstPlayer(e.target.value);
              if (textLengthCheck(e.target.value)) {
                setSecondPlayerDisable(false);
              }
            }}
            onKeyDown={handleFirstKey}
            onFocus={handleSecondFocus}
            className={` ${
              firstPlayerDisable ? "bg-gray-600" : "bg-gray-400"
            } text-black w-full p-1 outline-none text-[16px] rounded-md`}
          />
          <p className=" text-red-800">{errorMessage}</p>
          <div className=" flex flex-col gap-2 h-[400px] overflow-auto">
            {firstResult?.map((item: any, index: number) => (
              <div
                key={index}
                className=" flex justify-between w-full text-white"
              >
                <p>{item?.text}</p>
                <p>{item?.result}</p>
              </div>
            ))}
          </div>
        </div>
        <div className=" flex  flex-col gap-2 w-[400px]">
          <p className=" text-[20px] font-semibold text-white">Player 2</p>
          <input
            type="text"
            value={secondPlayer}
            disabled={secondPlayerDisable}
            onChange={(e: any) => {
              setSecondPlayer(e.target.value);
              if (textLengthCheck(e.target.value)) {
                setFirstPlayerDisable(false);
              }
            }}
            onKeyDown={handleSecondKey}
            onFocus={handleFirstFocus}
            className={` ${
              secondPlayerDisable ? "bg-gray-600" : "bg-gray-400"
            } text-black w-full p-1 outline-none text-[16px] rounded-md`}
          />
          <p className=" text-red-800">{errorMessage}</p>
          <div className=" flex flex-col gap-2 h-[400px] overflow-auto">
            {secondResult?.map((item: any, index: number) => (
              <div
                key={index}
                className=" flex justify-between w-full text-white"
              >
                <p>{item?.text}</p>
                <p>{item?.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
