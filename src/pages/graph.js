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

  .node {
    circle,
    text,
    line {
      transition: all 0.2s ease-out;
    }
    :hover {
      circle {
        fill: #3bb2e2;
        stroke: #333;
        stroke-width: 1;
      }
      text {
        font-size: 8px !important;
      }
    }
  }

  div.tooltip {
    position: absolute;
    background-color: white;
    max-width: 200px;
    height: auto;
    padding: 1px;
    border-style: solid;
    border-radius: 4px;
    border-width: 1px;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5);
    pointer-events: none;
  }
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

function getData(posts) {
  let nodeArray = []
  let linkArray = []
  posts.forEach(post => {
    let node = { id: post.node.frontmatter.id, group: 1 }
    nodeArray.push(node)
    post.node.frontmatter.edges.forEach(edge => {
      let link = { source: post.node.frontmatter.id, target: edge, value: 1 }
      linkArray.push(link)
    })
  })
  return { nodes: nodeArray, links: linkArray }
}

export default function Graph({ data }) {
  const posts = data.allMarkdownRemark.edges

  const test = useRef(null)
  const [hoverIndex, setHoverIndex] = useState(null)

  const datums = getData(posts)

  var postsMap = new Map()

  posts.forEach(post => {
    postsMap.set(post.node.frontmatter.id, {
      title: post.node.frontmatter.title,
      slug: post.node.frontmatter.slug,
    })
  })

  function highlightLines(lineIndices, link) {
    lineIndices.forEach(line => {
      console.log(link)
      console.log(link._groups)
      console.log(link._groups[0][line])
      link._groups[0][line].setAttribute("stroke-width", 3)
      link._groups[0][line].setAttribute("stroke", "#59A5D8")
    })
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
      .force("center", d3.forceCenter(400 / 2, 400 / 2))
      .force("collide", d3.forceCollide(30).strength(0.6))

    const svg = d3.create("svg").attr("viewBox", [0, 0, 500, 500])

    var linkMap = new Map()

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .classed("node", true)
      .attr("stroke-width", d => {
        if (linkMap.has(d.source.index)) {
          linkMap.set(d.source.index, linkMap.get(d.source.index).add(d.index))
        } else {
          let tempSet = new Set()
          tempSet.add(d.index)
          linkMap.set(d.source.index, tempSet)
        }

        if (linkMap.has(d.target.index)) {
          linkMap.set(d.target.index, linkMap.get(d.source.index).add(d.index))
        } else {
          let tempSet = new Set()
          tempSet.add(d.index)
          linkMap.set(d.target.index, tempSet)
        }
        return Math.sqrt(d.value)
      })

    console.log(linkMap)

    link.attr("distance", d => {
      console.log(d)
      return 10
    })

    // if(linkMap.has(3)) {
      // highlightLines(linkMap.get(5), link);
    // }

    const node = svg
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .join("a")
      // .on("mouseover.fade", fade(0.1))
      .classed("node", true)
      .attr("href", d => `/${postsMap.get(d.id).slug}`)
      // .attr("onmouseover", "setHoverIndex(3)") //
      .call(drag(simulation))

    node.append("circle").attr("r", 5).attr("fill", "#666") // color

    node
      .append("text")
      .text(function (d) {
        return postsMap.get(d.id).title
      })
      .style("fill", "#555")
      .style("font-size", "7px")
      .attr("text-anchor", "middle")
      .attr("y", 15)
    // .attr("x", 6)

    node.append("title").text(d => d.id)

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

      // node.attr("x", d => d.x).attr("y", d => d.y)
      node.attr("transform", d => `translate(${d.x}, ${d.y})`)
    })

    // invalidation.then(() => simulation.stop())

    // var color = d3.scaleOrdinal(d3.schemeSet3)
    // color(0)
    // color(1)
    // color(2)
    // color(3)
    // color(4)
    // color(5)
    // color(6)
    // color(7)
    // color(8)
    // color(9)
    // color(10)

    // var tooltip = d3
    //   .select("body")
    //   .append("div")
    //   .attr("class", "tooltip")
    //   .style("opacity", 0)

    //  const width = 500;
    //   const height = 500;

    // const simulation = d3
    //   .forceSimulation()
    //   .nodes(nodes)
    //   .force(
    //     "link",
    //     d3.forceLink().id(d => d.id)
    //   )
    //   .force("charge", d3.forceManyBody())
    //   .force("center", d3.forceCenter(width / 2, height / 2))
    //   .on("tick", ticked)

    // simulation.force("link").links(links)

    // const R = 6

    // let link = svg.selectAll("line").data(links).enter().append("line")

    // link
    //   .attr("class", "link")
    //   .attr("stroke", "#aaa")
    //   // .on("mouseover.tooltip", function (d) {
    //   //   tooltip.transition().duration(300).style("opacity", 0.8)
    //   //   tooltip
    //   //     .html(
    //   //       "Source:" +
    //   //         d.source.id +
    //   //         "<p/>Target:" +
    //   //         d.target.id +
    //   //         "<p/>Strength:" +
    //   //         d.value
    //   //     )
    //   //     .style("left", d3.event.pageX + "px")
    //   //     .style("top", d3.event.pageY + 10 + "px")
    //   // })
    //   // .on("mouseout.tooltip", function () {
    //   //   tooltip.transition().duration(100).style("opacity", 0)
    //   // })
    //   .on("mouseout.fade", fade(1))
    //   // .on("mousemove", function () {
    //   //   tooltip
    //   //     .style("left", d3.event.pageX + "px")
    //   //     .style("top", d3.event.pageY + 10 + "px")
    //   // })
    // let node = svg
    //   .selectAll(".node")
    //   .data(nodes)
    //   .enter()
    //   .append("g")
    //   .attr("class", "node")
    //   .call(
    //     d3
    //       .drag()
    //       .on("start", dragstarted)
    //       .on("drag", dragged)
    //       .on("end", dragended)
    //   )

    // node
    //   .append("circle")
    //   .attr("r", R)
    //   .attr("fill", function (d) {
    //     return color(d.group)
    //   })
    //   // .on("mouseover.tooltip", function (d) {
    //   //   tooltip.transition().duration(300).style("opacity", 0.8)
    //   //   tooltip
    //   //     .html("Name:" + d.id + "<p/>group:" + d.group)
    //   //     .style("left", d3.event.pageX + "px")
    //   //     .style("top", d3.event.pageY + 10 + "px")
    //   // })
    //   .on("mouseover.fade", fade(0.1))
    //   // .on("mouseout.tooltip", function () {
    //   //   tooltip.transition().duration(100).style("opacity", 0)
    //   // })
    //   .on("mouseout.fade", fade(1))
    //   // .on("mousemove", function () {
    //   //   tooltip
    //   //     .style("left", d3.event.pageX + "px")
    //   //     .style("top", d3.event.pageY + 10 + "px")
    //   // })
    //   .on("dblclick", releasenode)

    // node
    //   .append("text")
    //   .attr("x", 0)
    //   .attr("dy", ".35em")
    //   .text(d => d.name)

    // function ticked() {
    //   link
    //     .attr("x1", d => d.source.x)
    //     .attr("y1", d => d.source.y)
    //     .attr("x2", d => d.target.x)
    //     .attr("y2", d => d.target.y)

    //   node.attr("transform", d => `translate(${d.x},${d.y})`)
    // }

    // function dragstarted(d) {
    //   if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    //   d.fx = d.x
    //   d.fy = d.y
    // }

    // function dragged(d) {
    //   d.fx = d3.event.x
    //   d.fy = d3.event.y
    // }

    // function dragended(d) {
    //   if (!d3.event.active) simulation.alphaTarget(0)
    //   //d.fx = null;
    //   //d.fy = null;
    // }
    // function releasenode(d) {
    //   d.fx = null
    //   d.fy = null
    // }

    // const linkedByIndex = {}
    // links.forEach(d => {
    //   linkedByIndex[`${d.source.index},${d.target.index}`] = 1
    //   console.log(linkedByIndex);
    // })

    // function isConnected(a, b) {
    //   return (
    //     linkedByIndex[`${a.index},${b.index}`] ||
    //     linkedByIndex[`${b.index},${a.index}`] ||
    //     a.index === b.index
    //   )
    // }

    // function fade(opacity) {
    //   return d => {
    //     node.style("stroke-opacity", function (o) {
    //       const thisOpacity = isConnected(d, o) ? 1 : opacity
    //       console.log(d);
    //       console.log(o);
    //       console.log("d: " + d + ", o: " + o + ", " + isConnected(d,o));
    //       this.setAttribute("fill-opacity", thisOpacity)
    //       return thisOpacity
    //     })

    //     link.style("stroke-opacity", o =>
    //       o.source === d || o.target === d ? 1 : opacity
    //     )
    //   }
    // }

    // svg
    //   .append("g")
    //   // .attr("class", "legendSequential")
    //   .attr(
    //     "transform",
    //     "translate(" + (width - 140) + "," + (height - 300) + ")"
    //   )

    // // var legendSequential = d3
    // // .shapeWidth(30)
    // // .legendColor()
    //   // .cells(11)
    //   // .orient("vertical")
    //   // .title("Group number by color:")
    //   // .titleWidth(100)
    //   // .scale(sequentialScale)

    // // svg.select(".legendSequential").call(legendSequential)

    d3.select(test.current).append(function () {
      return svg.node()
    })
  })

  // if (test) {
  // }
  // })

  return (
    <Wrapper>
      {/* {hoverIndex ? highlightLines(linkMap[hoverIndex], link) : null} */}
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
            edges
          }
        }
      }
    }
  }
`
