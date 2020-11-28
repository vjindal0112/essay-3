import React, { useState } from "react"
import { Link, graphql, navigate } from "gatsby"
import styled from "styled-components"
import "../components/global.css"

const InputDiv = styled.div`
  border-radius: 24px;
  padding: 8px;
  border: 1px solid #ddd;
  height: 24px;
  outline: none;
  :hover {
    box-shadow: ${props =>
      props.focus
        ? "0px -1px 3px rgba(32, 33, 36, 0.28)"
        : "0px 1px 6px rgba(32, 33, 36, 0.28)"};
  }
  border-bottom-left-radius: ${props => (props.focus ? "0px" : "24px")};
  border-bottom-right-radius: ${props => (props.focus ? "0px" : "24px")};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Input = styled.input`
  border: none;
  outline: none;
  flex-grow: 2;
  font-size: 16px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`

const SVG = styled.svg`
  line-height: 24px;
  height: 24px;
  color: #9aa0a6;
  fill: #9aa0a6;
  position: relative;
  padding: 4px;
`

const Logo = styled.img`
  flex-grow: 0;
  flex-shrink: 0;
  width: 300px;
  margin-bottom: 20px;
`

const Suggestions = styled.div`
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  padding: 0;
  padding-bottom: 12px;
  border: 1px solid #ddd;
  outline: none;
  box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
  position: relative;
  align-items: center;
  z-index: 2;
  top: -1px;
  display: ${props => (props.focus ? "flex" : "none")};
  font-size: 16px;
`

const Suggestion = styled.div`
  padding: 4px 10px;
  text-align: left;
  display: flex;
  align-items: center;
  :hover {
    background-color: #f2f2f2;
  }
  width: 100%;
`

export default function Home() {
  const [query, setQuery] = useState("")
  const [numEnterPressed, setNumEnterPressed] = useState(0)
  const [focused, setFocused] = useState(false)
  const [mouseIn, setMouseIn] = useState(false)

  return (
    <Wrapper>
      <div>
        <Logo src="/googleLogo.png" />
        <InputDiv focus={focused}>
          <SVG
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </SVG>
          <Input
            onChange={e => {
              console.log(query)
              setQuery(e.target.value)
              e.target.value != "" ? setFocused(true) : setFocused(false)
            }}
            value={query}
            onFocus={() => setFocused(query != "" ? true : false)}
            onBlur={() => setFocused(mouseIn ? true : false)}
            onKeyDown={e => {
              let key = e.key || e.keyCode
              if (key === "Enter" || key === 13) {
                setNumEnterPressed(num => num + 1)
                if (query == "what makes me... me?") {
                  navigate("/results")
                } else if (numEnterPressed > 4) {
                  alert("Try the suggestion 👀")
                  setNumEnterPressed(0)
                }
              }
            }}
          />
        </InputDiv>
        <Suggestions
          focus={focused}
          onMouseEnter={() => setMouseIn(true)}
          onMouseLeave={() => setMouseIn(false)}
        >
          <Suggestion
            onClick={() => {
              console.log("clicked")
              setQuery("what makes me... me?")
              setFocused(false)
              navigate("/results");
            }}
          >
            <SVG
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{ height: "20px" }}
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </SVG>
            what makes me... me?
          </Suggestion>
        </Suggestions>
      </div>
    </Wrapper>
  )
}
