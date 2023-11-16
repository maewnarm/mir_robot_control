import React, { ReactNode } from "react"
import { Button, Layout, Spin } from "antd"
import { useRouter } from "next/router"
import { FaListAlt, FaRobot } from "react-icons/fa"
import { assetUrl } from "@/util/environment"
import { useStore } from "@/store"

const { Header } = Layout

Layout.Sider.defaultProps = { width: "12vw" }
interface Props {
  children?: ReactNode
}

const HeaderSideBarLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const { isLoading, loadingDescription } = useStore()

  return (
    <Spin
      tip={loadingDescription}
      spinning={isLoading}
      size="large"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      <Layout style={{ height: "100vh" }}>
        <Header className="text-start text-white h-[6vh] bg-red-600 fixed top-0 z-2 w-full px-4 flex items-center justify-start">
          <img src={assetUrl("/logo-denso.png")} alt="logo-denso" />
        </Header>
        <div className="flex flex-grow">
          <div className="fixed top-[6vh] bottom-0 w-[12vw] bg-white overflow-y-auto border ">
            <Button
              type="text"
              onClick={() => {
                router.push("/manage-robot")
              }}
              block
              className="h-14 text-base text-black justify-start"
              icon={<FaRobot className="text-xl mr-4" />}
            >
              Manage Robot
            </Button>
            <Button
              type="text"
              onClick={() => {
                router.push("/task-queue")
              }}
              block
              className="h-14 text-base text-black justify-start"
              icon={<FaListAlt className="text-xl mr-4" />}
            >
              Task Queue
            </Button>
          </div>
          <div className="absolute top-[6vh] left-[12vw] right-0 bottom-0 p-4 overflow-y-auto bg-white">{children}</div>
        </div>
      </Layout>
    </Spin>
  )
}

export default HeaderSideBarLayout

