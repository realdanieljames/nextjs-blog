
import Layout from "../../components/layout"
// The post page is now using the getPostData function in getStaticProps 
// to get the post data and return it as props.
import {getAllPostIds, getPostData} from "../../lib/posts"


export async function getStaticProps({params}){
    const postData = await getPostData(params.id)
    return {
        props:{
            postData
        }
    }

}



export async function getStaticPaths(){
    // paths contains the array of known paths returned by getAllPostIds()
    //which include the params defined by pages/posts/[id].js
    const paths = getAllPostIds()
        
    return {
        paths, 
        fallback: false
    }
}



export default function Post({postData}){
    return (

        <Layout>
            {postData.title}
            <br />
            {postData.id}
            <br />
            {postData.date}
            <br />
            <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
        </Layout>
    )
    
}