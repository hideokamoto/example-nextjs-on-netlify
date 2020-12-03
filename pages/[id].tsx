import Axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styles from '../styles/Home.module.css'

export const Page: NextPage<{
    post: {
        title: {
            rendered: string;
        }
        content: {
            rendered: string;
        }
    }
    buildAt: string;
}> = (props) => {
    const router = useRouter()
  
    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
      return <div>Loading...</div>
    }
    return (
        <div>
            <Link href="/"><h1>Home</h1></Link>
        <main>
            <h1 className={styles.title} dangerouslySetInnerHTML={{
                __html: props.post.title.rendered
            }} />
            <b>{props.buildAt}</b>
                <div className={styles.card} dangerouslySetInnerHTML={{
                    __html: props.post.content.rendered
                }} />
            </main>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const {data: posts} = await Axios.get('https://api.wp-kyoto.net/wp-json/wp/v2/posts?per_page=10')

    return {
        paths: posts.map(post => ({
            params: {
                id: `${post.id}`,
            }
        })),
        fallback: true
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const {data: post} = await Axios.get('https://api.wp-kyoto.net/wp-json/wp/v2/posts/' + id)
    return {
        props: {
            post,
            buildAt: new Date().toISOString()
        },
        revalidate: 10
    }
}
export default Page