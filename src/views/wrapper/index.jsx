import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd"


const { Header, Content, Footer } = Layout


const layout = React.memo(function () {
  const navigator = useNavigate()
  const items = [
    {
      label: 'canvas',
      key: 'canvas',
    },
    {
      label: 'water-mark',
      key: 'water-mark',
    }
  ]
  const handleClickMenu = (menu) => {
    navigator('/' + menu.key)
  }
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
          onClick={handleClickMenu}
        />
      </Header>
      <Layout>
        {/* <Sider width="150" style={siderStyle}>
          <a href="/canvas">canvas</a>
        </Sider> */}
        <Content style={contentStyle}>
          <div style={{ margin: '20px', borderRadius: '10px', background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
  </Layout>
  )
})
const headerStyle = {
  height: '60px',
  padding: '0 60px'
};

const contentStyle = {
  minHeight: 'calc(100vh - 120px)',
  lineHeight: '120px',
};

const siderStyle = {
  'min-height': 'calc(100vh - 120px)',
  'text-align': 'center'
};

const footerStyle = {
  height: '60px'
};
const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden'
};
export default layout