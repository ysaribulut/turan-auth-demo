import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {getSession, signOut, useSession} from "next-auth/react";
import {GetServerSidePropsContext} from "next";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { data:session } = useSession();

  return (
    <>
      <Head>
        <title>HOME</title>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          Welcome {session?.user?.name}
        </div>

        <button className="btn btn-danger mt-4" onClick={() => signOut()}>LOGOUT</button>
      </main>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if(!session) {
    context.res.statusCode = 403;
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    };
  }

  return { props: {} };
}
