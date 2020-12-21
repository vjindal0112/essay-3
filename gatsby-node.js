const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const vignette = path.resolve(`./src/templates/vignette.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                id
                slug
                edges
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  var postMap = new Map();

  posts.forEach((post) => {
    postMap[post.node.frontmatter.id] = post.node.frontmatter;
  })
  console.log(postMap);

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    let connections = [];
    post.node.frontmatter.edges.forEach((postIndex, i) => {
        connections.push(postMap[postIndex]);
    })

    createPage({
      path: post.node.frontmatter.slug,
      component: vignette,
      context: {
        slug: post.node.fields.slug,
        connections,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
