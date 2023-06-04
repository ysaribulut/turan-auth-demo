import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { getSession, signOut, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { usePermission } from "@/hooks/use-permission";
import { PolicyKeys } from "@/lib/policy-keys";
import { api } from "@/lib/api";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, update } = useSession();

  const showUserCreate = usePermission(PolicyKeys.USER_CREATE);
  const showUserDelete = usePermission(PolicyKeys.USER_DELETE);
  const showUserEdit = usePermission(PolicyKeys.USER_EDIT);
  const showUserRead = usePermission(PolicyKeys.USER_READ);

  async function updateUserPermissions(policyKey: string, checked: boolean) {
    try {
      await api.post("/update-user-permissions", {
        policyKey,
        checked,
      });
      await update();
      alert("permission updated");
    } catch (ex) {
      alert("An error occurred!");
    }
  }

  return (
    <>
      <Head>
        <title>HOME</title>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>Welcome {session?.user?.name}</div>

        <div className="row">
          <div className="col-6">
            <h2>EDIT PERMISSIONS</h2>
            <div className="row">
              <div className="col-12 mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={showUserCreate}
                    onChange={(ev) =>
                      updateUserPermissions(
                        PolicyKeys.USER_CREATE,
                        ev.target.checked
                      )
                    }
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    {PolicyKeys.USER_CREATE}
                  </label>
                </div>
              </div>
              <div className="col-12 mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={showUserEdit}
                    onChange={(ev) =>
                      updateUserPermissions(
                        PolicyKeys.USER_EDIT,
                        ev.target.checked
                      )
                    }
                    id="flexCheckDefault2"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault2"
                  >
                    {PolicyKeys.USER_EDIT}
                  </label>
                </div>
              </div>
              <div className="col-12 mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={showUserDelete}
                    onChange={(ev) =>
                      updateUserPermissions(
                        PolicyKeys.USER_DELETE,
                        ev.target.checked
                      )
                    }
                    id="flexCheckDefault3"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault3"
                  >
                    {PolicyKeys.USER_DELETE}
                  </label>
                </div>
              </div>
              <div className="col-12 mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={showUserRead}
                    onChange={(ev) =>
                      updateUserPermissions(
                        PolicyKeys.USER_READ,
                        ev.target.checked
                      )
                    }
                    id="flexCheckDefault4"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault4"
                  >
                    {PolicyKeys.USER_READ}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <h2>PERMISSION RESULTS</h2>
            <div className="row">
              {showUserCreate && (
                <div className="col-12 mb-2">
                  <button className="btn btn-primary">
                    {PolicyKeys.USER_CREATE}
                  </button>
                </div>
              )}
              {showUserEdit && (
                <div className="col-12 mb-2">
                  <button className="btn btn-warning">
                    {PolicyKeys.USER_EDIT}
                  </button>
                </div>
              )}
              {showUserDelete && (
                <div className="col-12 mb-2">
                  <button className="btn btn-danger">
                    {PolicyKeys.USER_DELETE}
                  </button>
                </div>
              )}
              {showUserRead && (
                <div className="col-12 mb-2">
                  <button className="btn btn-secondary">
                    {PolicyKeys.USER_READ}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button className="btn btn-danger mt-4" onClick={() => signOut()}>
          LOGOUT
        </button>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    context.res.statusCode = 403;
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
}
