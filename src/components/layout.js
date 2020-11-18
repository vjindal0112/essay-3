import React from "react"
import { Link } from "gatsby"
import "./global.css"

// import { rhythm, scale } from "../utils/typography"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const blogPath = `${__PATH_PREFIX__}/blog`
    const blogPath2 = `${__PATH_PREFIX__}/blog/`
    let header

    if (location.pathname === blogPath || location.pathname === blogPath2) {
      header = (
        <h1
          style={{
            fontSize: "24px",
            marginBottom: "24px",
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/blog`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/blog`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: "40em",
          padding: "24px",
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        {/* <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer> */}
      </div>
    )
  }
}

export default Layout
