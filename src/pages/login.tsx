import Head from "next/head";
import { getSession, signIn } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function submitLogin() {
    if (!email) {
      alert("Please enter email!");
      return;
    }

    if (!password) {
      alert("Please enter password!");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res) {
      if (res.error) {
        alert(res.error);
      } else {
        await router.push("/");
      }
    }
  }

  return (
    <>
      <Head>
        <title>LOGIN</title>
      </Head>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-6">
            <h2 className="mb-3 mt-4">LOGIN PAGE</h2>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="name@example.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput2" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleFormControlInput2"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
            <div className="mb-3">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() => submitLogin()}
              >
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // await prisma.user.create({
  //     data: {
  //         name: 'TEST',
  //         email: 'test@test.com',
  //         password: await hash('123456', 12),
  //     }
  // });

  const session = await getSession({ req: context.req });

  if (session) {
    context.res.statusCode = 403;
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
