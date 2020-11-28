import React from "react"
import styled from 'styled-components'
import { Link, graphql } from "gatsby"
import "../components/global.css"



// import Bio from "../components/bio"
import Layout from "../components/layout"
// import SEO from "../components/seo"
// import { rhythm, scale } from "../utils/typography"



const Section = styled.section`
  line-height: 1.5;
  color: #333;
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    // const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        {/* <SEO
          title={post.frontmatter.title}
          spoiler={post.frontmatter.spoiler || post.excerpt}
        /> */}
        <article>
          <header>
            <h1
              style={{
                marginTop: "16px",
                marginBottom: 0,
              }}
            >
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                fontSize: "12px",
                display: `block`,
                marginBottom: "16px",
              }}
            >
              {post.frontmatter.date} &#183; {post.timeToRead} min read
            </p>
          </header>
          <Section dangerouslySetInnerHTML={{ __html: post.html }} />
          <hr
            style={{
              marginBottom: "16px",
            }}
          />
          {/* <footer>
            <Bio />
          </footer> */}
        </article>

        {/* <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav> */}
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query VignetteBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        spoiler
      }
    }
  }
`
