// To render markdown content,
// we’ ll use the remark library
import remark from 'remark'
import html from 'remark-html'
// We’ ll create a simple library
// for fetching data from the file system.


import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // Get file names under /posts
    // The fs.readdirSync() method is used to synchronously read the contents of a given directory. 
    // The method returns an array with all the file names or objects in the directory.
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
            // Remove ".md" from file name to get id
            // The replace() method searches a string for a specified value, or a regular expression,
            //  and returns a new string where the specified values are replaced.
            const id = fileName.replace(/\.md$/, '')

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
                // Use gray-matter to parse the post mmetadata section
                // gray - matter returns a file object
            const matterResult = matter(fileContents)

            // Combine the data with the id
            return {
                id,
                ...matterResult.data
            }
        })
        // Sort posts by date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else {
            return 0
        }
    })
}


// this function t will return the list of file names
// (excluding.md) in the posts directory:
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)

    //Returns an array that looks like this:
    // it must be an array of objects
    // Each object must have the params key and contain an object with the id key
    //  (because we’re using [id] in the file name). Otherwise, getStaticPaths will fail.
    // [{
    //         params: {
    //             id: 'ssg-ssr'
    //         }
    //     },
    //     {
    //         params: {
    //             id: 'pre-rendering'
    //         }

    //     }
    // ]

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })

}


// We need to fetch necessary data to render the post with the given id.
// getPostData function will return the post data based on id: 
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    //Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    //Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()


    //Commbine the data with the id and contentHtmml
    return {

        id,
        contentHtml,
        ...matterResult.data
    }
}