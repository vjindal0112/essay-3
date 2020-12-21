import React, { useRef, useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import "../components/global.css"
import * as d3 from "d3"

const Wrapper = styled.div`
  padding-top: 32px;
  max-width: 40em;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-family: Roboto, Arial, sans-serif;
`

function drawGraph(ref) {
  var numNodes = 100
  var nodes = d3.range(numNodes).map(function (d) {
    return { radius: Math.random() * 25 }
  })
  var simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(5))
    .force("center", d3.forceCenter(500 / 2, 500 / 2))
    .force(
      "collision",
      d3.forceCollide().radius(function (d) {
        return d.radius
      })
    )

  d3.select(ref).append(simulation)
}

export default function Graph({ data }) {
  const posts = data.allMarkdownRemark.edges

  const test = useRef(null)

  const datums = {
    nodes: [
      { id: "test", group: 1 },
      { id: "test2", group: 1 },
    ],
    links: [{ source: "test", target: "test2", value: 3 }],
  }

  useEffect(() => {
    const drag = simulation => {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    }

    const links = datums.links.map(d => Object.create(d))
    const nodes = datums.nodes.map(d => Object.create(d))

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id(d => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(500 / 2, 500 / 2))

    const svg = d3.create("svg").attr("viewBox", [0, 0, 500, 500])

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "#666") // color
      .call(drag(simulation))

    node.append("title").text(d => d.id)

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

      node.attr("cx", d => d.x).attr("cy", d => d.y)
    })

    // invalidation.then(() => simulation.stop())

    if (test) {
      d3.select(test.current).append(function(){return svg.node();})
    }
  })

  return (
    <Wrapper>
      <div ref={test}></div>
    </Wrapper>
  )
}

export const graphQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark {
      edges {
        node {
          excerpt
          frontmatter {
            id
            title
            slug
          }
        }
      }
    }
  }
`
