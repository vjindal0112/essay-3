import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import "../components/global.css"

const Wrapper = styled.div`
  padding-top: 32px;
  max-width: 40em;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-family: Roboto, Arial, sans-serif;
`

const Spoiler = styled.p`
  font-size: 14px;
`

const Result = styled(Link)`
  box-shadow: none;
  color: #1a0dab;
  font-size: 20px;
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
`

const InputDiv = styled.div`
  border-radius: 24px;
  padding: 8px;
  border: 1px solid #ddd;
  height: 24px;
  margin-bottom: 24px;
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

const SVG = styled.svg`
  line-height: 24px;
  height: 24px;
  color: #9aa0a6;
  fill: #9aa0a6;
  position: relative;
  padding: 4px;
`

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Results({ data }) {
  const posts = data.allMarkdownRemark.edges

  const [query, setQuery] = useState("what makes me... me?");

  return (
    <Wrapper>
      <InputDiv >
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
            }}
            value={query}
          />
        </InputDiv>
        {/* <hr style={{"border": "1px solid #ccc", color: "#ccc", width: "100%"}}/> */}
      {shuffleArray(posts).map(({ node }) => {
        const title = node.frontmatter.title || node.frontmatter.slug
        return (
          <article key={node.frontmatter.slug}>
            <header>
              <h3
                style={{
                  marginBottom: "12px",
                }}
              >
                <Result to={`/${node.frontmatter.slug}`}>{title}</Result>
              </h3>
              {/* <small>{node.frontmatter.date}</small> */}
            </header>
            <section>
              <Spoiler
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.spoiler,
                }}
              />
            </section>
          </article>
        )
      })}
    </Wrapper>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            slug
            spoiler
          }
        }
      }
    }
  }
`
