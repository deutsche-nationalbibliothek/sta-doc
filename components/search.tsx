import { SearchOutlined } from "@ant-design/icons"
import { Button, Drawer, Input, Menu, Space } from "antd"
import { useEffect, useState } from "react"

export const Search: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const onClose = () => setIsSearchOpen(false)

  // useEffect(() => { isSearchOpen && setTimeout(onClose, 6000) }, [isSearchOpen])

  const onSearch = (e) => {
    console.log(e)
  }

  return (
    <Menu theme="dark"
      style={{ position: 'fixed', right: 50, width: 64, display: 'inline-block' }}
      mode="horizontal" items={[
        {
          label:
            <>
              <SearchOutlined style={{ fontSize: 20 }} />
              <Drawer
                size='large'
                placement="right"
                onClose={onClose}
                open={isSearchOpen}
              >
                <Input.Search placeholder="does not work yet" onSearch={onSearch} />
              </Drawer>
            </>,
          key: 'search',
          onClick: () => !isSearchOpen && setIsSearchOpen(true)
        }

      ]} />
  )
}
