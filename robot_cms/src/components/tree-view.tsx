import React from 'react'
import {
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import hourglass from '../../public/lottie/HourglassIcon.json'
import loading from '../../public/lottie/Loading.json'
import check from '../../public/lottie/Check.json'
import Lottie from 'lottie-react'

type TreeNodeProp = {
  text: string
  moveUp?: boolean
  moveDown?: boolean
  status?: 'finished' | 'doing' | 'waiting'
}

const HandleMoveDown = (text: string) => {
}

const HandleMoveUp = (text: string) => {
}

const TitleBlock: React.FC<TreeNodeProp> = ({
  text,
  moveDown,
  moveUp,
  status = 'finished',
}) => {
  return (
    <div
      style={{
        border: 'solid 3px',
        width: '40vw',
        height: '7vh',
        lineHeight: '4vh',
        borderRadius: '16px',
        backgroundColor: '#F5F5F5',
        padding: 10,
        marginLeft: 20,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.0vw',
      }}
    >
      {text}
      <div>
        {moveUp && (
          <button
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              marginRight: '8px',
            }}
            onClick={() => HandleMoveUp(text)}
          >
            <VerticalAlignTopOutlined
              rev={undefined}
              style={{ fontSize: '24px' }}
            />
          </button>
        )}

        {moveDown && (
          <button
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => HandleMoveDown(text)}
          >
            <VerticalAlignBottomOutlined
              rev={undefined}
              style={{ fontSize: '24px' }}
            />
          </button>
        )}
      </div>
    </div>
  )
}

const treeData: DataNode[] = [
  {
    title: (
      <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
    ),
    key: '0-0',
    icon: (
      <Lottie animationData={hourglass} loop={true} style={{ width: '30px' }} />
    ),
    children: [
      {
        title: (
          <TitleBlock
            text="Lorem ipsum dolor sit amet consectetur. Fames aliquam"
            moveDown={true}
          />
        ),
        key: '0-0-0',
        icon: (
          <Lottie
            animationData={loading}
            loop={true}
            style={{ width: '30px' }}
          />
        ),
        children: [
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-0-0-0',
            icon: (
              <Lottie
                animationData={check}
                loop={false}
                style={{ width: '30px' }}
              />
            ),
          },
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-0-0-1',
            icon: (
              <Lottie
                animationData={loading}
                loop={true}
                style={{ width: '30px' }}
              />
            ),
          },
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-0-0-2',
            icon: (
              <Lottie
                animationData={hourglass}
                loop={true}
                style={{ width: '30px' }}
              />
            ),
          },
        ],
      },
      {
        title: (
          <TitleBlock
            text="Lorem ipsum dolor sit amet consectetur. Fames aliquam"
            moveUp={true}
            moveDown={true}
          />
        ),
        key: '0-0-1',
        icon: (
          <Lottie
            animationData={hourglass}
            loop={true}
            style={{ width: '30px' }}
          />
        ),
        children: [
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-0-1-0',
            icon: (
              <Lottie
                animationData={hourglass}
                loop={true}
                style={{ width: '30px' }}
              />
            ),
          },
        ],
      },
      {
        title: (
          <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
        ),
        key: '0-0-2',
        icon: (
          <Lottie
            animationData={hourglass}
            loop={true}
            style={{ width: '30px' }}
          />
        ),
        children: [
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-0-2-0',
            icon: (
              <Lottie
                animationData={hourglass}
                loop={true}
                style={{ width: '30px' }}
              />
            ),
          },
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-0-2-1',
            icon: (
              <Lottie
                animationData={hourglass}
                loop={true}
                style={{ width: '30px' }}
              />
            ),
          },
        ],
      },
    ],
  },
  {
    title: (
      <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
    ),
    key: '0-1',
    icon: (
      <Lottie animationData={hourglass} loop={true} style={{ width: '30px' }} />
    ),
    children: [
      {
        title: (
          <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
        ),
        key: '0-1-0',
        icon: (
          <Lottie
            animationData={hourglass}
            loop={true}
            style={{ width: '30px' }}
          />
        ),
        children: [
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-1-0-0',
            icon: (
              <Lottie
                animationData={hourglass}
                loop={true}
                style={{ width: '30px' }}
              />
            ),
          },
          {
            title: (
              <TitleBlock text="Lorem ipsum dolor sit amet consectetur. Fames aliquam" />
            ),
            key: '0-1-0-1',
            icon: (
              <Lottie
                animationData={hourglass}
                loop={true}
                style={{ width: '30px' }}
              />
            ),
          },
        ],
      },
    ],
  },
]

const TreeView: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '',
        },
      }}
    >
      <div>
        <div style={{ fontSize: '36px', marginLeft: '1rem' }}>
          Robot Name : Robot Name 1
        </div>
        <div style={{ margin: '1% 0 0 2%' }}>
          <Tree
            showLine={true}
            showIcon={true}
            defaultExpandedKeys={['0-0-0']}
            selectable={false}
            treeData={treeData}
          />
        </div>
      </div>
    </ConfigProvider>
  )
}

export default TreeView
